import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';


// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Upload from './pages/Upload';
import PresetDetail from './pages/PresetDetail';
import Profile from './pages/Profile';
import Teams from './pages/Teams';
import Pricing from './pages/Pricing';
import Editor from './pages/Editor';
import DesignEditor from './pages/DesignEditor';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import UserProfile from "./pages/UserProfile";
import UserCreateDataset from "./pages/UserCreateDataset";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";

// New Components
import AdvancedEditor from './components/editor/AdvancedEditor';
import MarketplaceGrid from './components/marketplace/MarketplaceGrid';
import MultiFormatUploader from './components/upload/MultiFormatUploader';

// ✅ Import AuthGuard
import AuthGuard from './components/auth/AuthGuard';
import DesignPreview from './pages/DesignPreview';
import PresetDetailPage from './pages/presets/PresetDetailPage';
import CreateDataset from './pages/CreateDataset';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/marketplace" element={<MarketplaceGrid />} />
              <Route path="/preset/:id" element={<PresetDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/upload-advanced" element={<MultiFormatUploader />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/editor/:id" element={<Editor />} />
              <Route path="/design-editor" element={<DesignEditor />} />
              <Route path="/advanced-editor" element={<AdvancedEditor />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/design-preview" element={<DesignPreview />} />
              <Route path="/presetdetailpage" element={ <PresetDetailPage />} />
              <Route path="/datasets/create" element={<CreateDataset/>} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/user-create-dataset" element={<UserCreateDataset />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </motion.main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}



export default App;
