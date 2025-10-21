import type { ActionGuide } from '../types/actionGuide';
import type { Version } from '../types/version';
import type { Settings } from '../types/settings';

const STORAGE_KEYS = {
  ACTION_GUIDES: 'actionGuides',
  VERSIONS: 'versions',
  SETTINGS: 'settings',
};

export const localStorageService = {
  // Action Guides
  getActionGuides: (): ActionGuide[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ACTION_GUIDES);
    return data ? JSON.parse(data) : [];
  },

  saveActionGuides: (guides: ActionGuide[]): void => {
    localStorage.setItem(STORAGE_KEYS.ACTION_GUIDES, JSON.stringify(guides));
  },

  addActionGuide: (guide: ActionGuide): void => {
    const guides = localStorageService.getActionGuides();
    guides.push(guide);
    localStorageService.saveActionGuides(guides);
  },

  updateActionGuide: (id: string, updatedGuide: ActionGuide): void => {
    const guides = localStorageService.getActionGuides();
    const index = guides.findIndex((g) => g.id === id);
    if (index !== -1) {
      guides[index] = updatedGuide;
      localStorageService.saveActionGuides(guides);
    }
  },

  deleteActionGuide: (id: string): void => {
    const guides = localStorageService.getActionGuides();
    const filtered = guides.filter((g) => g.id !== id);
    localStorageService.saveActionGuides(filtered);
  },

  // Versions
  getVersions: (): Version[] => {
    const data = localStorage.getItem(STORAGE_KEYS.VERSIONS);
    return data ? JSON.parse(data) : [];
  },

  saveVersions: (versions: Version[]): void => {
    localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(versions));
  },

  addVersion: (version: Version): void => {
    const versions = localStorageService.getVersions();
    versions.push(version);
    localStorageService.saveVersions(versions);
  },

  getVersionsByActionGuideId: (actionGuideId: string): Version[] => {
    const versions = localStorageService.getVersions();
    return versions.filter((v) => v.actionGuideId === actionGuideId);
  },

  // Settings
  getSettings: (): Settings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : {
          backendEndpoint: '',
          apiKey: '',
          autoSync: false,
          theme: 'light',
        };
  },

  saveSettings: (settings: Settings): void => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Export/Import
  exportData: (): string => {
    const data = {
      actionGuides: localStorageService.getActionGuides(),
      versions: localStorageService.getVersions(),
      settings: localStorageService.getSettings(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData: (jsonString: string): void => {
    try {
      const data = JSON.parse(jsonString);
      if (data.actionGuides) {
        localStorageService.saveActionGuides(data.actionGuides);
      }
      if (data.versions) {
        localStorageService.saveVersions(data.versions);
      }
      if (data.settings) {
        localStorageService.saveSettings(data.settings);
      }
    } catch (error) {
      throw new Error('Invalid JSON data');
    }
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACTION_GUIDES);
    localStorage.removeItem(STORAGE_KEYS.VERSIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};
