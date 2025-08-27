import React, { useEffect, useMemo, useState } from "react";

/** ---------- Sections ---------- */
const sections = [
  "Account Info",
  "Security",
  "Notifications",
  "Subscription & Billing",
  "Connected Apps",
  "Privacy Settings",
  "Language & Localization",
] as const;

type Section = (typeof sections)[number];

/** ---------- Settings Types ---------- */
type GeneralSettings = {
  theme: "System" | "Dark" | "Light";
  accent: "Default" | "Purple" | "Blue" | "Green";
  canvasSize: "1920x1080" | "1080x1080" | "1280x720" | "Custom";
  fileFormat: "PNG" | "JPG" | "SVG" | "PDF";
};

type NotificationsSettings = {
  projectCommentsPush: boolean;
  collaborationInvitesEmail: boolean;
  exportCompletion: boolean;
  versionHistoryUpdates: boolean;
  weeklySummaryEmails: boolean;
};

type PersonalizationSettings = {
  showTooltips: boolean;
  enableGridRuler: boolean;
  showAlignmentGuides: boolean;
  uiDensity: "Compact" | "Comfortable" | "Spacious";
  defaultFont: "Sans-serif" | "Serif" | "Monospace";
};

type ConnectedAppsSettings = {
  googleDrive: boolean;
  dropbox: boolean;
  oneDrive: boolean;
  slack: boolean;
};

type DataControlsSettings = {
  allowAnonymousFeedback: boolean;
  enableProjectAnalytics: boolean;
};

type SecuritySettings = {
  twoFactorAuth: boolean;
};

type AccountSettings = {
  displayName: string;
  email: string;
};

type Settings = {
  general: GeneralSettings;
  notifications: NotificationsSettings;
  personalization: PersonalizationSettings;
  connectedApps: ConnectedAppsSettings;
  dataControls: DataControlsSettings;
  security: SecuritySettings;
  account: AccountSettings;
};

/** ---------- Defaults ---------- */
const DEFAULT_SETTINGS: Settings = {
  general: {
    theme: "System",
    accent: "Default",
    canvasSize: "1920x1080",
    fileFormat: "PNG",
  },
  notifications: {
    projectCommentsPush: true,
    collaborationInvitesEmail: true,
    exportCompletion: true,
    versionHistoryUpdates: false,
    weeklySummaryEmails: false,
  },
  personalization: {
    showTooltips: true,
    enableGridRuler: false,
    showAlignmentGuides: true,
    uiDensity: "Comfortable",
    defaultFont: "Sans-serif",
  },
  connectedApps: {
    googleDrive: false,
    dropbox: false,
    oneDrive: false,
    slack: false,
  },
  dataControls: {
    allowAnonymousFeedback: false,
    enableProjectAnalytics: false,
  },
  security: {
    twoFactorAuth: false,
  },
  account: {
    displayName: "",
    email: "",
  },
};

const LS_KEY = "settings:v1";

/** ---------- Small building blocks ---------- */
type ToggleRowProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};
const ToggleRow: React.FC<ToggleRowProps> = ({ label, checked, onChange }) => (
  <label className="flex justify-between items-center bg-gray-800 rounded-md px-4 py-2 w-full max-w-md mx-auto">
    <span>{label}</span>
    <input
      type="checkbox"
      className="w-5 h-5 accent-purple-600"
      checked={checked}
      onChange={onChange}
    />
  </label>
);

type SelectRowProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
};
const SelectRow: React.FC<SelectRowProps> = ({
  label,
  value,
  options,
  onChange,
}) => (
  <div className="w-full max-w-md mx-auto">
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <select
      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

/** ---------- Main Component ---------- */
function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("Account Info");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saveNote, setSaveNote] = useState<string>("");

  /** Load from localStorage (real-world persistence) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Settings;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  /** Auto-save on any change */
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
      setSaveNote("All changes saved");
      const t = setTimeout(() => setSaveNote(""), 1200);
      return () => clearTimeout(t);
    } catch {
      setSaveNote("Failed to save");
    }
  }, [settings]);

  /** Handy updaters */
  const setGeneral = (patch: Partial<GeneralSettings>) =>
    setSettings((s) => ({ ...s, general: { ...s.general, ...patch } }));

  const setNotifications = (patch: Partial<NotificationsSettings>) =>
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, ...patch } }));

  const setPersonalization = (patch: Partial<PersonalizationSettings>) =>
    setSettings((s) => ({ ...s, personalization: { ...s.personalization, ...patch } }));

  const setConnectedApps = (patch: Partial<ConnectedAppsSettings>) =>
    setSettings((s) => ({ ...s, connectedApps: { ...s.connectedApps, ...patch } }));

  const setDataControls = (patch: Partial<DataControlsSettings>) =>
    setSettings((s) => ({ ...s, dataControls: { ...s.dataControls, ...patch } }));

  const setSecurity = (patch: Partial<SecuritySettings>) =>
    setSettings((s) => ({ ...s, security: { ...s.security, ...patch } }));

  const setAccount = (patch: Partial<AccountSettings>) =>
    setSettings((s) => ({ ...s, account: { ...s.account, ...patch } }));

  /** Real-world stubs (replace with API calls) */
  const changePassword = () => alert("Open change password flow / modal");
  const logoutThisDevice = () => alert("Logging out of this device…");
  const logoutAllDevices = () => alert("Logging out of all devices…");
  const exportProjects = () => alert("Export started…");
  const deleteAllProjects = () => confirm("Are you sure? This cannot be undone.") && alert("Deleted.");
  const upgradeToPro = () => alert("Redirecting to billing…");
  const deleteAccount = () => confirm("Are you sure you want to delete your account?") && alert("Account deleted.");

  /** UI density style tweaks (just a small real-world touch) */
  const densityClasses = useMemo(() => {
    switch (settings.personalization.uiDensity) {
      case "Compact":
        return "space-y-3";
      case "Spacious":
        return "space-y-6";
      default:
        return "space-y-4";
    }
  }, [settings.personalization.uiDensity]);

  /** Section renderers */
  const renderSectionContent = () => {
    switch (activeSection) {
      case "Account Info":
        return (
          <div className="space-y-6">
            {/* Account Info UI */}
          </div>
        );
      case "Security":
        return (
          <div className="space-y-6">
            {/* Security UI */}
          </div>
        );
      case "Notifications":
        return (
          <div className="space-y-6">
            {/* Notifications UI */}
          </div>
        );
      case "Subscription & Billing":
        return (
          <div className="space-y-6">
            {/* Subscription & Billing UI */}
          </div>
        );
      case "Connected Apps":
        return (
          <div className="space-y-6">
            {/* Connected Apps UI */}
          </div>
        );
      case "Privacy Settings":
        return (
          <div className="space-y-6">
            {/* Privacy Settings UI */}
          </div>
        );
      case "Language & Localization":
        return (
          <div className="space-y-6">
            {/* Language & Localization UI */}
          </div>
        );

      default:
        return null;
    }
  };

  /** Reset to defaults */
  const resetAll = () => setSettings(DEFAULT_SETTINGS);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section
                      ? "bg-primary-600 text-white"
                      : "hover:bg-dark-800 text-gray-300"
                  }`}
                >
                  {section}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1">
            <div className="bg-dark-800 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">{activeSection}</h2>
              {renderSectionContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
