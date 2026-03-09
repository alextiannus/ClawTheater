import { create } from "zustand";

// ============================================
// User Store — Authentication & Wallet State
// ============================================

interface UserState {
    isAuthenticated: boolean;
    userType: "human" | "agent" | null;
    walletAddress: string | null;
    usdcBalance: number;
    displayName: string | null;
    agentId: string | null;
    apiKey: string | null;

    // Actions
    login: (userType: "human" | "agent", displayName: string) => void;
    logout: () => void;
    setWallet: (address: string) => void;
    setBalance: (balance: number) => void;
    setAgentCredentials: (agentId: string, apiKey: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    isAuthenticated: false,
    userType: null,
    walletAddress: null,
    usdcBalance: 0,
    displayName: null,
    agentId: null,
    apiKey: null,

    login: (userType, displayName) =>
        set({ isAuthenticated: true, userType, displayName }),
    logout: () =>
        set({
            isAuthenticated: false,
            userType: null,
            walletAddress: null,
            usdcBalance: 0,
            displayName: null,
            agentId: null,
            apiKey: null,
        }),
    setWallet: (address) => set({ walletAddress: address }),
    setBalance: (balance) => set({ usdcBalance: balance }),
    setAgentCredentials: (agentId, apiKey) => set({ agentId, apiKey }),
}));

// ============================================
// Reading Store — Novel reading state
// ============================================

interface ReadingState {
    currentNovelId: string | null;
    currentChapterId: string | null;
    readingProgress: Record<string, number>; // novelId -> last chapter read
    bookmarks: string[]; // chapterIds

    // Actions
    setCurrentReading: (novelId: string, chapterId: string) => void;
    updateProgress: (novelId: string, chapterIndex: number) => void;
    toggleBookmark: (chapterId: string) => void;
    clearReading: () => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
    currentNovelId: null,
    currentChapterId: null,
    readingProgress: {},
    bookmarks: [],

    setCurrentReading: (novelId, chapterId) =>
        set({ currentNovelId: novelId, currentChapterId: chapterId }),
    updateProgress: (novelId, chapterIndex) =>
        set((state) => ({
            readingProgress: { ...state.readingProgress, [novelId]: chapterIndex },
        })),
    toggleBookmark: (chapterId) =>
        set((state) => ({
            bookmarks: state.bookmarks.includes(chapterId)
                ? state.bookmarks.filter((id) => id !== chapterId)
                : [...state.bookmarks, chapterId],
        })),
    clearReading: () =>
        set({ currentNovelId: null, currentChapterId: null }),
}));

// ============================================
// Bounty Store — Bounty Hall state
// ============================================

export type BountyStatus = "funding" | "auditing" | "resolved";

interface BountyFilters {
    status: BountyStatus | "all";
    minAmount: number;
    maxAmount: number;
    tags: string[];
    language: string | "all";
    sortBy: "newest" | "amount" | "popular";
}

interface BountyState {
    filters: BountyFilters;
    selectedBountyId: string | null;

    // Actions
    setFilters: (filters: Partial<BountyFilters>) => void;
    resetFilters: () => void;
    selectBounty: (id: string | null) => void;
}

const DEFAULT_FILTERS: BountyFilters = {
    status: "all",
    minAmount: 0,
    maxAmount: 10000,
    tags: [],
    language: "all",
    sortBy: "newest",
};

export const useBountyStore = create<BountyState>((set) => ({
    filters: DEFAULT_FILTERS,
    selectedBountyId: null,

    setFilters: (newFilters) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        })),
    resetFilters: () => set({ filters: DEFAULT_FILTERS }),
    selectBounty: (id) => set({ selectedBountyId: id }),
}));

// ============================================
// Language Store — Lobby language state
// ============================================

export type LobbyLanguage = "en" | "zh";

interface LanguageState {
    lang: LobbyLanguage;
    setLang: (lang: LobbyLanguage) => void;
    toggleLang: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    lang: "zh",
    setLang: (lang) => set({ lang }),
    toggleLang: () => set((state) => ({ lang: state.lang === "en" ? "zh" : "en" })),
}));
