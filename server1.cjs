// server1.js (CommonJS) — works on Windows with Node 18+
// Run with: node server1.js

const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

// ---------------------- Setup & helpers ----------------------
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure folders exist
const UPLOAD_ROOT = path.join(__dirname, "uploads");
const TMP_DIR = path.join(UPLOAD_ROOT, "tmp");
const PROCESSED_DIR = path.join(UPLOAD_ROOT, "processed");

[UPLOAD_ROOT, TMP_DIR, PROCESSED_DIR].forEach((p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Serve processed files statically so your frontend can show them
// e.g. http://localhost:5000/uploads/processed/filename.jpg
app.use("/uploads", express.static(UPLOAD_ROOT));

// Minimal JSON "database"
const DB_FILE = path.join(__dirname, "db.json");
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ datasets: [], files: [] }, null, 2));
}

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Simple perceptual-ish average hash for dedup (8x8 grayscale)
async function aHash(buffer) {
  const img = sharp(buffer).grayscale().resize(8, 8, { fit: "fill" });
  const raw = await img.raw().toBuffer(); // 64 bytes (8x8)
  let avg = 0;
  for (let i = 0; i < raw.length; i++) avg += raw[i];
  avg = avg / raw.length || 0;

  let bits = "";
  for (let i = 0; i < raw.length; i++) {
    bits += raw[i] >= avg ? "1" : "0";
  }
  // convert every 4 bits to hex
  let hex = "";
  for (let i = 0; i < 64; i += 4) {
    hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  }
  return hex;
}

// Multer: keep files in memory so Sharp can process directly
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB per file (adjust as needed)
});

// Image processing pipeline with Sharp, driven by your checkboxes
async function processImageBuffer(originalBuffer, filenameBase, options) {
  const {
    resize = false,
    compress = true,
    normalize = false,
    crop = false,
    format = "jpg",
  } = options || {};

  let image = sharp(originalBuffer);

  // Optional normalize (equalize/normalize illumination)
  if (normalize) {
    image = image.normalize();
  }

  // Resize (example: max 1280px width, auto height)
  if (resize) {
    image = image.resize({ width: 1280, withoutEnlargement: true });
  }

  // Crop to 16:9 center if requested
  if (crop) {
    image = image.resize({
      width: 1280,
      height: Math.round(1280 * 9 / 16),
      fit: "cover",
      position: "center",
    });
  }

  // Format + compression
  const targetExt = (format || "jpg").toLowerCase();
  if (targetExt === "jpg" || targetExt === "jpeg") {
    image = image.jpeg({ quality: compress ? 80 : 95, mozjpeg: true });
  } else if (targetExt === "png") {
    image = image.png({ compressionLevel: compress ? 9 : 0 });
  } else if (targetExt === "webp") {
    image = image.webp({ quality: compress ? 80 : 95 });
  } else {
    // default jpeg if unknown
    image = image.jpeg({ quality: compress ? 80 : 95, mozjpeg: true });
  }

  const processedBuffer = await image.toBuffer();

  const safeBase = filenameBase
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-]/g, "")
    .slice(0, 50);

  const outName = `${Date.now()}_${safeBase}.${targetExt === "jpeg" ? "jpg" : targetExt}`;
  const outPath = path.join(PROCESSED_DIR, outName);
  fs.writeFileSync(outPath, processedBuffer);

  return {
    filename: outName,
    url: `/uploads/processed/${outName}`,
    absPath: outPath,
    buffer: processedBuffer,
  };
}

// ---------------------- Routes ----------------------

// GET: list datasets (for browsing/verification)
app.get("/api/datasets", (req, res) => {
  const db = readDB();
  res.json({ datasets: db.datasets });
});

// POST: create dataset + process images
app.post("/api/datasets", upload.array("files"), async (req, res) => {
  try {
    const { title, datasetType, version } = req.body;

    // Parse preprocessing options safely
    let preprocessOptions = {};
    try {
      preprocessOptions = JSON.parse(req.body.preprocessOptions || "{}");
    } catch (e) {
      preprocessOptions = {};
    }

    if (!title || !datasetType || !version) {
      return res.status(400).json({ error: "Missing title/datasetType/version" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Load DB + prep duplicate detection
    const db = readDB();
    const existingHashes = new Set(db.files.map((f) => f.hash));
    const currentBatchHashes = new Set();

    const processedFiles = [];
    for (const file of req.files) {
      const { originalname, mimetype, buffer } = file;

      // Only process images with Sharp; other types are stored raw (optional)
      const isImage = mimetype.startsWith("image/");

      if (isImage) {
        // Deduplicate?
        if (preprocessOptions.deduplicate) {
          const hash = await aHash(buffer);

          // If already seen (in DB or inside this batch), skip
          if (existingHashes.has(hash) || currentBatchHashes.has(hash)) {
            console.log(`Skipped duplicate: ${originalname}`);
            continue;
          }
          currentBatchHashes.add(hash);
        }

        // Process image according to options
        const baseName = path.parse(originalname).name;
        const result = await processImageBuffer(buffer, baseName, preprocessOptions);

        processedFiles.push({ filename: result.filename, url: result.url });

        // Record in DB "files" index (for future dedup)
        const hashForDB = preprocessOptions.deduplicate ? await aHash(buffer) : null;
        db.files.push({
          filename: result.filename,
          url: result.url,
          hash: hashForDB,
          createdAt: new Date().toISOString(),
        });
      } else {
        // Not an image: optional store as-is to tmp/raw (simple example)
        const rawName = `${Date.now()}_${originalname.replace(/\s+/g, "_")}`;
        const rawPath = path.join(TMP_DIR, rawName);
        fs.writeFileSync(rawPath, buffer);
        // You could also copy raw files to processed, or handle videos/audio separately.
        processedFiles.push({ filename: rawName, url: `/uploads/tmp/${rawName}` });
      }
    }

    // Save dataset record
    const dataset = {
      id: `ds_${Date.now()}`,
      title,
      datasetType,
      version,
      files: processedFiles, // processed file entries
      options: preprocessOptions,
      createdAt: new Date().toISOString(),
    };

    db.datasets.push(dataset);
    writeDB(db);

    return res.json({
      ok: true,
      dataset,
      processedFiles,
      message: "Dataset created & files processed.",
    });
  } catch (err) {
    console.error("ERROR /api/datasets:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Health check (optional)
app.get("/", (_req, res) => {
  res.send("Backend is running. POST /api/datasets to upload.");
});

// ---------------------- Start server ----------------------
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
