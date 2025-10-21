import { create } from 'zustand';
import type { Settings } from '../types/settings';
import { localStorageService } from '../services/localStorage';

interface SettingsStore {
  settings: Settings;

  // Actions
  loadSettings: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: {
    backendEndpoint: '',
    apiKey: '',
    autoSync: false,
    theme: 'light',
  },

  loadSettings: () => {
    const settings = localStorageService.getSettings();
    set({ settings });
  },

  updateSettings: (updates) => {
    const newSettings = { ...get().settings, ...updates };
    localStorageService.saveSettings(newSettings);
    set({ settings: newSettings });
  },
}));
