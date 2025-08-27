import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'pro' | 'enterprise';
  credits: number;
}

export interface Preset {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  preview: string;
  author: {
    name: string;
    avatar: string;
  };
  price: number;
  isPremium: boolean;
  downloads: number;
  rating: number;
  createdAt: Date;
  fileUrl: string;
  fileSize: string;
  format: 'figma' | 'sketch' | 'psd' | 'html' | 'react';
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: User[];
  presets: Preset[];
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

// 💡 This describes a saved action (e.g., download) that runs after login
interface PostAuthAction {
  action: string;
  from: string;
}

interface Store {
  // 🔐 Authentication
  user: User | null;
  setUser: (user: User | null) => void;

  // 📥 Post-login download action
  postAuthAction: PostAuthAction | null;
  setPostAuthAction: (action: string, from: string) => void;
  clearPostAuthAction: () => void;

  // 📦 App Data
  presets: Preset[];
  teams: Team[];
  favoritePresets: string[];
  searchQuery: string;
  selectedCategory: string;
  priceFilter: 'all' | 'free' | 'premium';
  sortBy: 'newest' | 'popular' | 'rating';

  // ⚙️ Actions
  setPresets: (presets: Preset[]) => void;
  addPreset: (preset: Preset) => void;
  toggleFavorite: (presetId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceFilter: (filter: 'all' | 'free' | 'premium') => void;
  setSortBy: (sort: 'newest' | 'popular' | 'rating') => void;
}

export const useStore = create<Store>((set, get) => ({
  // 🔐 Auth state
  user: null,
  setUser: (user) => set({ user }),

  // 📥 Download after login
  postAuthAction: null,
  setPostAuthAction: (action, from) => set({ postAuthAction: { action, from } }),
  clearPostAuthAction: () => set({ postAuthAction: null }),

  // 📦 Initial state
  presets: [],
  teams: [],
  favoritePresets: [],
  searchQuery: '',
  selectedCategory: 'all',
  priceFilter: 'all',
  sortBy: 'newest',

  // ⚙️ Actions
  setPresets: (presets) => set({ presets }),
  addPreset: (preset) => set((state) => ({ presets: [preset, ...state.presets] })),
  toggleFavorite: (presetId) =>
    set((state) => ({
      favoritePresets: state.favoritePresets.includes(presetId)
        ? state.favoritePresets.filter((id) => id !== presetId)
        : [...state.favoritePresets, presetId],
    })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setPriceFilter: (priceFilter) => set({ priceFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
}));
