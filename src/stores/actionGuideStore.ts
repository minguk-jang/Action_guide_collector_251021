import { create } from 'zustand';
import type { ActionGuide } from '../types/actionGuide';
import { localStorageService } from '../services/localStorage';
import { generateId } from '../utils/helpers';

interface ActionGuideStore {
  guides: ActionGuide[];
  loading: boolean;
  error: string | null;

  // Actions
  loadGuides: () => void;
  addGuide: (guide: Omit<ActionGuide, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGuide: (id: string, guide: Partial<ActionGuide>) => void;
  deleteGuide: (id: string) => void;
  getGuideById: (id: string) => ActionGuide | undefined;
}

export const useActionGuideStore = create<ActionGuideStore>((set, get) => ({
  guides: [],
  loading: false,
  error: null,

  loadGuides: () => {
    try {
      const guides = localStorageService.getActionGuides();
      set({ guides, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  addGuide: (guideData) => {
    try {
      const newGuide: ActionGuide = {
        ...guideData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorageService.addActionGuide(newGuide);
      set({ guides: [...get().guides, newGuide], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateGuide: (id, updates) => {
    try {
      const guides = get().guides;
      const guide = guides.find((g) => g.id === id);
      if (!guide) {
        throw new Error('Guide not found');
      }
      const updatedGuide = {
        ...guide,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorageService.updateActionGuide(id, updatedGuide);
      set({
        guides: guides.map((g) => (g.id === id ? updatedGuide : g)),
        error: null,
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteGuide: (id) => {
    try {
      localStorageService.deleteActionGuide(id);
      set({ guides: get().guides.filter((g) => g.id !== id), error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  getGuideById: (id) => {
    return get().guides.find((g) => g.id === id);
  },
}));
