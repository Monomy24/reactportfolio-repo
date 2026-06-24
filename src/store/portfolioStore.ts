import { create } from 'zustand';

// FIX: Force type-only imports so the compiler strips this completely out of the browser's runtime build
import type { PortfolioData } from '../types/portfolio';

interface PortfolioState {
  data: PortfolioData | null;
  draft: PortfolioData | null; // Tracks changes before pushing to GitHub
  isAuthenticated: boolean;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
  
  // State Action Enforcers
  setPortfolioData: (data: PortfolioData) => void;
  updateDraft: (updater: (draft: PortfolioData) => void) => void;
  setAuthenticated: (status: boolean) => void;
  setSaving: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  resetDraft: () => void;
}
export const usePortfolioStore = create<PortfolioState>((set) => ({
  data: null,
  draft: null,
  isAuthenticated: false,
  isSaving: false,
  isLoading: true,
  error: null,

  setPortfolioData: (data) => set({ data, draft: JSON.parse(JSON.stringify(data)), isLoading: false }),
  updateDraft: (updater) => set((state) => {
    if (!state.draft) return {};
    const newDraft = JSON.parse(JSON.stringify(state.draft));
    updater(newDraft);
    return { draft: newDraft };
  }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setSaving: (status) => set({ isSaving: status }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error }),
  resetDraft: () => set((state) => ({ draft: JSON.parse(JSON.stringify(state.data)) })),
}));
