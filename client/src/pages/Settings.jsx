import React, { useState, useEffect } from 'react';
import './Settings.css';
import api from '../services/api';
import {
  Save,
  Bell,
  Shield,
  User,
  Building,
  Mail,
  Globe,
  Lock,
  Database,
  Palette,
  Clock,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Key,
  Users,
  FileText,
  CreditCard,
  MessageCircle,
  Link,
  Smartphone,
  Laptop,
  Tablet,
  Printer,
  MapPin,
  Phone,
  Settings as SettingsIcon,
  ToggleLeft,
  ToggleRight,
  Plus,
  Minus,
  Edit,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';

function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showPassword, setShowPassword] = useState({});

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    general: {
      companyName: 'Your Company',
      companyEmail: 'admin@company.com',
      companyPhone: '+1 234 567 890',
      companyAddress: '123 Business St, City, Country',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      currency: 'USD',
      language: 'en'
    },

    // Appearance Settings
    appearance: {
      theme: 'light',
      primaryColor: '#667eea',
      sidebarCollapsed: false,
      denseMode: false,
      animations: true,
      fontSize: 'medium',
      borderRadius: 'medium'
    },

    // Notification Settings
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      desktopNotifications: true,
      leadAlerts: true,
      projectUpdates: true,
      paymentAlerts: true,
      taskReminders: true,
      marketingEmails: false,
      dailyDigest: true,
      weeklyReport: true
    },

    // Security Settings
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelisting: false,
      requireStrongPassword: true,
      mfaMethods: ['email'],
      allowedDomains: []
    },

    // User Management
    userManagement: {
      defaultUserRole: 'employee',
      allowRegistration: false,
      requireEmailVerification: true,
      allowSocialLogin: false,
      sessionManagement: true,
      maxSessionsPerUser: 3
    },

    // Integration Settings
    integrations: {
      googleAnalytics: '',
      slackWebhook: '',
      zapierWebhook: '',
      mailchimpApi: '',
      stripeEnabled: false,
      stripeKey: '',
      paypalEnabled: false,
      paypalEmail: ''
    },

    // Backup Settings
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '00:00',
      retainBackups: 30,
      lastBackup: null,
      backupLocation: 'local'
    },

    // Email Settings
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      smtpEncryption: 'tls',
      fromEmail: '',
      fromName: '',
      replyTo: ''
    },

    // Localization
    localization: {
      country: 'US',
      language: 'en',
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      weekStartsOn: 'monday',
      numberFormat: 'en-US'
    },

    // Advanced Settings
    advanced: {
      debugMode: false,
      maintenanceMode: false,
      apiRateLimit: 1000,
      cacheEnabled: true,
      cacheDuration: 3600,
      logLevel: 'error',
      allowBetaFeatures: false
    }
  });

  const [backupHistory, setBackupHistory] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);

  // Tabs configuration
  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'localization', label: 'Localization', icon: Globe },
    { id: 'advanced', label: 'Advanced', icon: Lock }
  ];

  useEffect(() => {
    fetchSettings();
    fetchBackupHistory();
    fetchAuditLogs();
    fetchApiKeys();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/settings');
      setSettings(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackupHistory = async () => {
    try {
      const response = await api.get('/settings/backups');
      setBackupHistory(response.data);
    } catch (error) {
      console.error('Error fetching backup history:', error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await api.get('/settings/audit-logs');
      setAuditLogs(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const response = await api.get('/settings/api-keys');
      setApiKeys(response.data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      await api.put('/settings', settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Log the action
      await api.post('/settings/audit-log', {
        action: 'settings_updated',
        user: 'current_user',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setSaveError('Failed to save settings. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    setConfirmAction({
      title: 'Reset to Defaults',
      message: 'Are you sure you want to reset all settings to default values? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.post('/settings/reset');
          fetchSettings();
          setShowConfirmDialog(false);
        } catch (error) {
          console.error('Error resetting settings:', error);
        }
      }
    });
    setShowConfirmDialog(true);
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      await api.post('/settings/backup');
      fetchBackupHistory();
      alert('Backup created successfully!');
    } catch (error) {
      console.error('Error creating backup:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = async (backupId) => {
    setConfirmAction({
      title: 'Restore Backup',
      message: 'Are you sure you want to restore this backup? Current settings will be overwritten.',
      onConfirm: async () => {
        try {
          await api.post(`/settings/restore/${backupId}`);
          fetchSettings();
          setShowConfirmDialog(false);
          alert('Backup restored successfully!');
        } catch (error) {
          console.error('Error restoring backup:', error);
        }
      }
    });
    setShowConfirmDialog(true);
  };

  const handleGenerateApiKey = async () => {
    try {
      const response = await api.post('/settings/api-keys');
      setApiKeys([...apiKeys, response.data]);
    } catch (error) {
      console.error('Error generating API key:', error);
    }
  };

  const handleDeleteApiKey = async (keyId) => {
    setConfirmAction({
      title: 'Delete API Key',
      message: 'Are you sure you want to delete this API key? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.delete(`/settings/api-keys/${keyId}`);
          setApiKeys(apiKeys.filter(key => key._id !== keyId));
          setShowConfirmDialog(false);
        } catch (error) {
          console.error('Error deleting API key:', error);
        }
      }
    });
    setShowConfirmDialog(true);
  };

  const handleTestEmail = async () => {
    try {
      await api.post('/settings/test-email', { to: settings.general.companyEmail });
      alert('Test email sent successfully!');
    } catch (error) {
      console.error('Error sending test email:', error);
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        setSettings(importedSettings);
        alert('Settings imported successfully!');
      } catch (error) {
        alert('Error importing settings: Invalid file format');
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearCache = async () => {
    setConfirmAction({
      title: 'Clear Cache',
      message: 'Are you sure you want to clear the system cache? This may temporarily affect performance.',
      onConfirm: async () => {
        try {
          await api.post('/settings/clear-cache');
          setShowConfirmDialog(false);
          alert('Cache cleared successfully!');
        } catch (error) {
          console.error('Error clearing cache:', error);
        }
      }
    });
    setShowConfirmDialog(true);
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3>General Information</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label>
            <Building size={16} />
            Company Name
          </label>
          <input
            type="text"
            value={settings.general.companyName}
            onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
            placeholder="Enter company name"
          />
        </div>

        <div className="setting-item">
          <label>
            <Mail size={16} />
            Company Email
          </label>
          <input
            type="email"
            value={settings.general.companyEmail}
            onChange={(e) => handleSettingChange('general', 'companyEmail', e.target.value)}
            placeholder="Enter company email"
          />
        </div>

        <div className="setting-item">
          <label>
            <Phone size={16} />
            Company Phone
          </label>
          <input
            type="tel"
            value={settings.general.companyPhone}
            onChange={(e) => handleSettingChange('general', 'companyPhone', e.target.value)}
            placeholder="Enter company phone"
          />
        </div>

        <div className="setting-item full-width">
          <label>
            <MapPin size={16} />
            Company Address
          </label>
          <textarea
            value={settings.general.companyAddress}
            onChange={(e) => handleSettingChange('general', 'companyAddress', e.target.value)}
            placeholder="Enter company address"
            rows="2"
          />
        </div>

        <div className="setting-item">
          <label>
            <Globe size={16} />
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
            <option value="Asia/Shanghai">Shanghai</option>
            <option value="Australia/Sydney">Sydney</option>
          </select>
        </div>

        <div className="setting-item">
          <label>
            <Clock size={16} />
            Date Format
          </label>
          <select
            value={settings.general.dateFormat}
            onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div className="setting-item">
          <label>
            <Clock size={16} />
            Time Format
          </label>
          <select
            value={settings.general.timeFormat}
            onChange={(e) => handleSettingChange('general', 'timeFormat', e.target.value)}
          >
            <option value="12h">12-hour (AM/PM)</option>
            <option value="24h">24-hour</option>
          </select>
        </div>

        <div className="setting-item">
          <label>
            <CreditCard size={16} />
            Currency
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="INR">INR (₹)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div>

        <div className="setting-item">
          <label>
            <Globe size={16} />
            Language
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <h3>Appearance Settings</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label>Theme</label>
          <div className="theme-selector">
            <button
              className={`theme-option ${settings.appearance.theme === 'light' ? 'active' : ''}`}
              onClick={() => handleSettingChange('appearance', 'theme', 'light')}
            >
              <Sun size={20} />
              Light
            </button>
            <button
              className={`theme-option ${settings.appearance.theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
            >
              <Moon size={20} />
              Dark
            </button>
            <button
              className={`theme-option ${settings.appearance.theme === 'system' ? 'active' : ''}`}
              onClick={() => handleSettingChange('appearance', 'theme', 'system')}
            >
              <Laptop size={20} />
              System
            </button>
          </div>
        </div>

        <div className="setting-item">
          <label>Primary Color</label>
          <div className="color-picker">
            <input
              type="color"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
            />
            <span>{settings.appearance.primaryColor}</span>
          </div>
        </div>

        <div className="setting-item">
          <label>Font Size</label>
          <select
            value={settings.appearance.fontSize}
            onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Border Radius</label>
          <select
            value={settings.appearance.borderRadius}
            onChange={(e) => handleSettingChange('appearance', 'borderRadius', e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Sidebar Collapsed</span>
            <button
              className={`toggle ${settings.appearance.sidebarCollapsed ? 'active' : ''}`}
              onClick={() => handleSettingChange('appearance', 'sidebarCollapsed', !settings.appearance.sidebarCollapsed)}
            >
              {settings.appearance.sidebarCollapsed ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Dense Mode</span>
            <button
              className={`toggle ${settings.appearance.denseMode ? 'active' : ''}`}
              onClick={() => handleSettingChange('appearance', 'denseMode', !settings.appearance.denseMode)}
            >
              {settings.appearance.denseMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Animations</span>
            <button
              className={`toggle ${settings.appearance.animations ? 'active' : ''}`}
              onClick={() => handleSettingChange('appearance', 'animations', !settings.appearance.animations)}
            >
              {settings.appearance.animations ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Notification Preferences</h3>
      <div className="settings-grid">
        <div className="setting-item toggle-setting">
          <label>
            <span>Email Notifications</span>
            <button
              className={`toggle ${settings.notifications.emailNotifications ? 'active' : ''}`}
              onClick={() => handleSettingChange('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
            >
              {settings.notifications.emailNotifications ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Push Notifications</span>
            <button
              className={`toggle ${settings.notifications.pushNotifications ? 'active' : ''}`}
              onClick={() => handleSettingChange('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
            >
              {settings.notifications.pushNotifications ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Desktop Notifications</span>
            <button
              className={`toggle ${settings.notifications.desktopNotifications ? 'active' : ''}`}
              onClick={() => handleSettingChange('notifications', 'desktopNotifications', !settings.notifications.desktopNotifications)}
            >
              {settings.notifications.desktopNotifications ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Lead Alerts</span>
            <button
              className={`toggle ${settings.notifications.leadAlerts ? 'active' : ''}`}
              onClick={() => handleSettingChange('notifications', 'leadAlerts', !settings.notifications.leadAlerts)}
            >
              {settings.notifications.leadAlerts ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Project Updates</span>
            <button
              className={`toggle ${settings.notifications.projectUpdates ? 'active' : ''}`}
              onClick={() => handleSettingChange('notifications', 'projectUpdates', !settings.notifications.projectUpdates)}
            >
              {settings.notifications.projectUpdates ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Payment Alerts</span>
            <button
              className={`toggle ${settings.notifications.paymentAlerts ? 'active' : ''}`}
              onClick={() => handleSettingChange('notifications', 'paymentAlerts', !settings.notifications.paymentAlerts)}
            >
              {settings.notifications.paymentAlerts ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Task Reminders</span>
            <button
              className={`toggle ${settings.notifications.taskReminders ? 'active' : ''}`}
              onClick={() => handleSettingChange('notifications', 'taskReminders', !settings.notifications.taskReminders)}
            >
              {settings.notifications.taskReminders ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Daily Digest</span>
            <button
              className={`toggle ${settings.notifications.dailyDigest ? 'active' : ''}`}
              onClick={() => handleSettingChange('notifications', 'dailyDigest', !settings.notifications.dailyDigest)}
            >
              {settings.notifications.dailyDigest ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Weekly Report</span>
            <button
              className={`toggle ${settings.notifications.weeklyReport ? 'active' : ''}`}
              onClick={() => handleSettingChange('notifications', 'weeklyReport', !settings.notifications.weeklyReport)}
            >
              {settings.notifications.weeklyReport ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3>Security Settings</h3>
      <div className="settings-grid">
        <div className="setting-item toggle-setting">
          <label>
            <span>Two-Factor Authentication</span>
            <button
              className={`toggle ${settings.security.twoFactorAuth ? 'active' : ''}`}
              onClick={() => handleSettingChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
            >
              {settings.security.twoFactorAuth ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item">
          <label>Session Timeout (minutes)</label>
          <input
            type="number"
            min="1"
            max="480"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
          />
        </div>

        <div className="setting-item">
          <label>Password Expiry (days)</label>
          <input
            type="number"
            min="0"
            max="365"
            value={settings.security.passwordExpiry}
            onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
          />
        </div>

        <div className="setting-item">
          <label>Max Login Attempts</label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.security.loginAttempts}
            onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
          />
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>IP Whitelisting</span>
            <button
              className={`toggle ${settings.security.ipWhitelisting ? 'active' : ''}`}
              onClick={() => handleSettingChange('security', 'ipWhitelisting', !settings.security.ipWhitelisting)}
            >
              {settings.security.ipWhitelisting ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Require Strong Password</span>
            <button
              className={`toggle ${settings.security.requireStrongPassword ? 'active' : ''}`}
              onClick={() => handleSettingChange('security', 'requireStrongPassword', !settings.security.requireStrongPassword)}
            >
              {settings.security.requireStrongPassword ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item full-width">
          <label>MFA Methods</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={settings.security.mfaMethods.includes('email')}
                onChange={(e) => {
                  const methods = e.target.checked
                    ? [...settings.security.mfaMethods, 'email']
                    : settings.security.mfaMethods.filter(m => m !== 'email');
                  handleSettingChange('security', 'mfaMethods', methods);
                }}
              />
              Email
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.security.mfaMethods.includes('sms')}
                onChange={(e) => {
                  const methods = e.target.checked
                    ? [...settings.security.mfaMethods, 'sms']
                    : settings.security.mfaMethods.filter(m => m !== 'sms');
                  handleSettingChange('security', 'mfaMethods', methods);
                }}
              />
              SMS
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.security.mfaMethods.includes('authenticator')}
                onChange={(e) => {
                  const methods = e.target.checked
                    ? [...settings.security.mfaMethods, 'authenticator']
                    : settings.security.mfaMethods.filter(m => m !== 'authenticator');
                  handleSettingChange('security', 'mfaMethods', methods);
                }}
              />
              Authenticator App
            </label>
          </div>
        </div>

        <div className="setting-item full-width">
          <label>Allowed Domains (one per line)</label>
          <textarea
            value={settings.security.allowedDomains.join('\n')}
            onChange={(e) => handleSettingChange('security', 'allowedDomains', e.target.value.split('\n').filter(d => d.trim()))}
            placeholder="company.com&#10;example.org"
            rows="3"
          />
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="settings-section">
      <h3>Backup Settings</h3>
      <div className="settings-grid">
        <div className="setting-item toggle-setting">
          <label>
            <span>Automatic Backup</span>
            <button
              className={`toggle ${settings.backup.autoBackup ? 'active' : ''}`}
              onClick={() => handleSettingChange('backup', 'autoBackup', !settings.backup.autoBackup)}
            >
              {settings.backup.autoBackup ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item">
          <label>Backup Frequency</label>
          <select
            value={settings.backup.backupFrequency}
            onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Backup Time</label>
          <input
            type="time"
            value={settings.backup.backupTime}
            onChange={(e) => handleSettingChange('backup', 'backupTime', e.target.value)}
          />
        </div>

        <div className="setting-item">
          <label>Retain Backups (days)</label>
          <input
            type="number"
            min="1"
            max="365"
            value={settings.backup.retainBackups}
            onChange={(e) => handleSettingChange('backup', 'retainBackups', parseInt(e.target.value))}
          />
        </div>

        <div className="setting-item">
          <label>Backup Location</label>
          <select
            value={settings.backup.backupLocation}
            onChange={(e) => handleSettingChange('backup', 'backupLocation', e.target.value)}
          >
            <option value="local">Local Storage</option>
            <option value="s3">Amazon S3</option>
            <option value="gcs">Google Cloud Storage</option>
            <option value="dropbox">Dropbox</option>
          </select>
        </div>
      </div>

      <div className="backup-actions">
        <button className="btn-primary" onClick={handleCreateBackup}>
          <Download size={16} />
          Create Backup Now
        </button>
        <button className="btn-secondary" onClick={handleExportSettings}>
          <Upload size={16} />
          Export Settings
        </button>
        <label className="btn-secondary">
          <Upload size={16} />
          Import Settings
          <input
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="backup-history">
        <h4>Backup History</h4>
        <div className="backup-list">
          {backupHistory.length === 0 ? (
            <p className="no-data">No backups found</p>
          ) : (
            backupHistory.map(backup => (
              <div key={backup._id} className="backup-item">
                <div className="backup-info">
                  <Database size={16} />
                  <div>
                    <strong>{new Date(backup.createdAt).toLocaleString()}</strong>
                    <span>Size: {backup.size}</span>
                  </div>
                </div>
                <div className="backup-actions">
                  <button onClick={() => handleRestoreBackup(backup._id)} title="Restore">
                    <RefreshCw size={14} />
                  </button>
                  <button onClick={() => window.open(backup.downloadUrl)} title="Download">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="settings-section">
      <h3>Advanced Settings</h3>
      <div className="settings-grid">
        <div className="setting-item toggle-setting">
          <label>
            <span>Debug Mode</span>
            <button
              className={`toggle ${settings.advanced.debugMode ? 'active' : ''}`}
              onClick={() => handleSettingChange('advanced', 'debugMode', !settings.advanced.debugMode)}
            >
              {settings.advanced.debugMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Maintenance Mode</span>
            <button
              className={`toggle ${settings.advanced.maintenanceMode ? 'active' : ''}`}
              onClick={() => handleSettingChange('advanced', 'maintenanceMode', !settings.advanced.maintenanceMode)}
            >
              {settings.advanced.maintenanceMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item">
          <label>API Rate Limit (requests/minute)</label>
          <input
            type="number"
            min="1"
            max="10000"
            value={settings.advanced.apiRateLimit}
            onChange={(e) => handleSettingChange('advanced', 'apiRateLimit', parseInt(e.target.value))}
          />
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Cache Enabled</span>
            <button
              className={`toggle ${settings.advanced.cacheEnabled ? 'active' : ''}`}
              onClick={() => handleSettingChange('advanced', 'cacheEnabled', !settings.advanced.cacheEnabled)}
            >
              {settings.advanced.cacheEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>

        <div className="setting-item">
          <label>Cache Duration (seconds)</label>
          <input
            type="number"
            min="0"
            max="86400"
            value={settings.advanced.cacheDuration}
            onChange={(e) => handleSettingChange('advanced', 'cacheDuration', parseInt(e.target.value))}
          />
        </div>

        <div className="setting-item">
          <label>Log Level</label>
          <select
            value={settings.advanced.logLevel}
            onChange={(e) => handleSettingChange('advanced', 'logLevel', e.target.value)}
          >
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        <div className="setting-item toggle-setting">
          <label>
            <span>Allow Beta Features</span>
            <button
              className={`toggle ${settings.advanced.allowBetaFeatures ? 'active' : ''}`}
              onClick={() => handleSettingChange('advanced', 'allowBetaFeatures', !settings.advanced.allowBetaFeatures)}
            >
              {settings.advanced.allowBetaFeatures ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </label>
        </div>
      </div>

      <div className="danger-zone">
        <h4>Danger Zone</h4>
        <div className="danger-actions">
          <button className="btn-danger" onClick={handleClearCache}>
            <Trash2 size={16} />
            Clear Cache
          </button>
          <button className="btn-danger" onClick={handleResetToDefaults}>
            <RefreshCw size={16} />
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="audit-logs">
        <h4>Recent Audit Logs</h4>
        <div className="audit-list">
          {auditLogs.length === 0 ? (
            <p className="no-data">No audit logs found</p>
          ) : (
            auditLogs.map((log, index) => (
              <div key={index} className="audit-item">
                <Clock size={14} />
                <div className="audit-info">
                  <span className="audit-action">{log.action}</span>
                  <span className="audit-time">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <span className="audit-user">{log.user}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderApiKeys = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3>API Keys</h3>
        <button className="btn-primary" onClick={handleGenerateApiKey}>
          <Plus size={16} />
          Generate New Key
        </button>
      </div>

      <div className="api-keys-list">
        {apiKeys.length === 0 ? (
          <p className="no-data">No API keys generated</p>
        ) : (
          apiKeys.map(key => (
            <div key={key._id} className="api-key-item">
              <div className="key-info">
                <Key size={16} />
                <div>
                  <strong>{key.name}</strong>
                  <code>{key.key}</code>
                </div>
              </div>
              <div className="key-actions">
                <button onClick={() => {}} title="Copy">
                  <Copy size={14} />
                </button>
                <button onClick={() => handleDeleteApiKey(key._id)} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>
          <SettingsIcon size={28} />
          Settings
        </h1>
        <p className="header-subtitle">Configure and manage your application settings</p>

        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={handleResetToDefaults}
          >
            <RefreshCw size={18} />
            Reset
          </button>
          <button 
            className="btn-primary"
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>

        {saveSuccess && (
          <div className="save-success">
            <CheckCircle size={18} />
            Settings saved successfully!
          </div>
        )}

        {saveError && (
          <div className="save-error">
            <AlertCircle size={18} />
            {saveError}
          </div>
        )}
      </div>

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
                <ChevronRight size={16} className="tab-arrow" />
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="settings-content">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'appearance' && renderAppearanceSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'users' && (
            <>
              <div className="settings-section">
                <h3>User Management</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Default User Role</label>
                    <select
                      value={settings.userManagement.defaultUserRole}
                      onChange={(e) => handleSettingChange('userManagement', 'defaultUserRole', e.target.value)}
                    >
                      <option value="employee">Employee</option>
                      <option value="sales">Sales</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="setting-item toggle-setting">
                    <label>
                      <span>Allow Registration</span>
                      <button
                        className={`toggle ${settings.userManagement.allowRegistration ? 'active' : ''}`}
                        onClick={() => handleSettingChange('userManagement', 'allowRegistration', !settings.userManagement.allowRegistration)}
                      >
                        {settings.userManagement.allowRegistration ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </label>
                  </div>

                  <div className="setting-item toggle-setting">
                    <label>
                      <span>Require Email Verification</span>
                      <button
                        className={`toggle ${settings.userManagement.requireEmailVerification ? 'active' : ''}`}
                        onClick={() => handleSettingChange('userManagement', 'requireEmailVerification', !settings.userManagement.requireEmailVerification)}
                      >
                        {settings.userManagement.requireEmailVerification ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </label>
                  </div>

                  <div className="setting-item toggle-setting">
                    <label>
                      <span>Allow Social Login</span>
                      <button
                        className={`toggle ${settings.userManagement.allowSocialLogin ? 'active' : ''}`}
                        onClick={() => handleSettingChange('userManagement', 'allowSocialLogin', !settings.userManagement.allowSocialLogin)}
                      >
                        {settings.userManagement.allowSocialLogin ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </label>
                  </div>

                  <div className="setting-item">
                    <label>Max Sessions Per User</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.userManagement.maxSessionsPerUser}
                      onChange={(e) => handleSettingChange('userManagement', 'maxSessionsPerUser', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              {renderApiKeys()}
            </>
          )}
          {activeTab === 'integrations' && (
            <div className="settings-section">
              <h3>Integrations</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Google Analytics ID</label>
                  <input
                    type="text"
                    value={settings.integrations.googleAnalytics}
                    onChange={(e) => handleSettingChange('integrations', 'googleAnalytics', e.target.value)}
                    placeholder="UA-XXXXX-Y"
                  />
                </div>

                <div className="setting-item">
                  <label>Slack Webhook URL</label>
                  <input
                    type="url"
                    value={settings.integrations.slackWebhook}
                    onChange={(e) => handleSettingChange('integrations', 'slackWebhook', e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>

                <div className="setting-item">
                  <label>Zapier Webhook URL</label>
                  <input
                    type="url"
                    value={settings.integrations.zapierWebhook}
                    onChange={(e) => handleSettingChange('integrations', 'zapierWebhook', e.target.value)}
                    placeholder="https://hooks.zapier.com/..."
                  />
                </div>

                <div className="setting-item">
                  <label>Mailchimp API Key</label>
                  <input
                    type="password"
                    value={settings.integrations.mailchimpApi}
                    onChange={(e) => handleSettingChange('integrations', 'mailchimpApi', e.target.value)}
                    placeholder="Your Mailchimp API key"
                  />
                </div>

                <div className="setting-item toggle-setting">
                  <label>
                    <span>Enable Stripe</span>
                    <button
                      className={`toggle ${settings.integrations.stripeEnabled ? 'active' : ''}`}
                      onClick={() => handleSettingChange('integrations', 'stripeEnabled', !settings.integrations.stripeEnabled)}
                    >
                      {settings.integrations.stripeEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </label>
                </div>

                {settings.integrations.stripeEnabled && (
                  <div className="setting-item">
                    <label>Stripe Secret Key</label>
                    <input
                      type="password"
                      value={settings.integrations.stripeKey}
                      onChange={(e) => handleSettingChange('integrations', 'stripeKey', e.target.value)}
                      placeholder="sk_live_..."
                    />
                  </div>
                )}

                <div className="setting-item toggle-setting">
                  <label>
                    <span>Enable PayPal</span>
                    <button
                      className={`toggle ${settings.integrations.paypalEnabled ? 'active' : ''}`}
                      onClick={() => handleSettingChange('integrations', 'paypalEnabled', !settings.integrations.paypalEnabled)}
                    >
                      {settings.integrations.paypalEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </label>
                </div>

                {settings.integrations.paypalEnabled && (
                  <div className="setting-item">
                    <label>PayPal Email</label>
                    <input
                      type="email"
                      value={settings.integrations.paypalEmail}
                      onChange={(e) => handleSettingChange('integrations', 'paypalEmail', e.target.value)}
                      placeholder="merchant@example.com"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'email' && (
            <div className="settings-section">
              <h3>Email Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>SMTP Host</label>
                  <input
                    type="text"
                    value={settings.email.smtpHost}
                    onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="setting-item">
                  <label>SMTP Port</label>
                  <input
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>

                <div className="setting-item">
                  <label>SMTP Username</label>
                  <input
                    type="text"
                    value={settings.email.smtpUser}
                    onChange={(e) => handleSettingChange('email', 'smtpUser', e.target.value)}
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div className="setting-item">
                  <label>SMTP Password</label>
                  <div className="password-input">
                    <input
                      type={showPassword.smtp ? 'text' : 'password'}
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, smtp: !showPassword.smtp })}
                      className="password-toggle"
                    >
                      {showPassword.smtp ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="setting-item">
                  <label>Encryption</label>
                  <select
                    value={settings.email.smtpEncryption}
                    onChange={(e) => handleSettingChange('email', 'smtpEncryption', e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>From Email</label>
                  <input
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                    placeholder="noreply@yourcompany.com"
                  />
                </div>

                <div className="setting-item">
                  <label>From Name</label>
                  <input
                    type="text"
                    value={settings.email.fromName}
                    onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                    placeholder="Your Company"
                  />
                </div>

                <div className="setting-item">
                  <label>Reply-To Email</label>
                  <input
                    type="email"
                    value={settings.email.replyTo}
                    onChange={(e) => handleSettingChange('email', 'replyTo', e.target.value)}
                    placeholder="support@yourcompany.com"
                  />
                </div>
              </div>

              <div className="email-test">
                <button className="btn-secondary" onClick={handleTestEmail}>
                  <Mail size={16} />
                  Send Test Email
                </button>
              </div>
            </div>
          )}
          {activeTab === 'localization' && (
            <div className="settings-section">
              <h3>Localization</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Country</label>
                  <select
                    value={settings.localization.country}
                    onChange={(e) => handleSettingChange('localization', 'country', e.target.value)}
                  >
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="IN">India</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Language</label>
                  <select
                    value={settings.localization.language}
                    onChange={(e) => handleSettingChange('localization', 'language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Timezone</label>
                  <select
                    value={settings.localization.timezone}
                    onChange={(e) => handleSettingChange('localization', 'timezone', e.target.value)}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Shanghai">Shanghai</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Currency</label>
                  <select
                    value={settings.localization.currency}
                    onChange={(e) => handleSettingChange('localization', 'currency', e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Date Format</label>
                  <select
                    value={settings.localization.dateFormat}
                    onChange={(e) => handleSettingChange('localization', 'dateFormat', e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Week Starts On</label>
                  <select
                    value={settings.localization.weekStartsOn}
                    onChange={(e) => handleSettingChange('localization', 'weekStartsOn', e.target.value)}
                  >
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="saturday">Saturday</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Number Format</label>
                  <select
                    value={settings.localization.numberFormat}
                    onChange={(e) => handleSettingChange('localization', 'numberFormat', e.target.value)}
                  >
                    <option value="en-US">1,234.56</option>
                    <option value="en-IN">1,23,456.78</option>
                    <option value="de-DE">1.234,56</option>
                    <option value="fr-FR">1 234,56</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'backup' && renderBackupSettings()}
          {activeTab === 'advanced' && renderAdvancedSettings()}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && confirmAction && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <AlertTriangle size={32} className="confirm-icon" />
            <h3>{confirmAction.title}</h3>
            <p>{confirmAction.message}</p>
            <div className="confirm-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={() => {
                  confirmAction.onConfirm();
                  setShowConfirmDialog(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;