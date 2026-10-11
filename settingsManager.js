export const SettingsManager = {
  _userId: 'guest',

  init(userId) {
    this._userId = userId;
  },

  _getKey() {
    return `${this._userId}_SETTINGS`;
  },

  getSettings() {
    const defaultSettings = {
      appearance: 'dark',
      language: 'en',
      notifications: true
    };
    const saved = localStorage.getItem(this._getKey());
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  },

  saveSettings(settings) {
    localStorage.setItem(this._getKey(), JSON.stringify(settings));
    this.applySettings(settings);
  },

  applySettings(settings) {
    // Apply Appearance
    if (settings.appearance === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }
};
