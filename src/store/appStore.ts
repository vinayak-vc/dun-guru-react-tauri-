import create from 'zustand';
import { AppScreen } from '@/models/screen';

interface AppState {
  currentScreen: AppScreen;
  selectedButton: unknown | null;
  selectedGalleryItem: unknown | null;
  selectedIndex: number | null;
  setScreen: (screen: AppScreen) => void;
  setButton: (button: unknown | null) => void;
  setGalleryItem: (item: unknown | null) => void;
  setSelectedIndex: (index: number | null) => void;
  reset: () => void;
}

const useAppStore = create<AppState>((set) => ({
  currentScreen: 'HOME',
  selectedButton: null,
  selectedGalleryItem: null,
  selectedIndex: null,
  setScreen: (screen) => set({ currentScreen: screen }),
  setButton: (button) => set({ selectedButton: button }),
  setGalleryItem: (item) => set({ selectedGalleryItem: item }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),
  reset: () => set({
    currentScreen: 'HOME',
    selectedButton: null,
    selectedGalleryItem: null,
    selectedIndex: null
  })
}));

export default useAppStore;
