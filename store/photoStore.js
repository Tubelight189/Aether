import { create } from 'zustand';

// 1. Add `get` as the second argument here
export const usePhotoStore = create((set, get) => ({
  photos: [],
  setInitialPhoto: (uri) => {
    // 2. Use `get()` here instead of the incorrect `set.getState()`
    if (get().photos.length === 0 && uri) {
      set({ photos: [uri] });
    }
  },
  addPhoto: (uri) => {
    // This function was already correct
    set((state) => ({ photos: [...state.photos, uri] }));
  },
  clearPhotos: () => {
    set({ photos: [] });
  },
}));