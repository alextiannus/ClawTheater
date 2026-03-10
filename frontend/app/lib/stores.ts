import { create } from "zustand";

// ============================================
// User Store — Authentication & Wallet State
// ============================================

interface UserState {
    isAuthenticated: boolean;
    userType: "human" | "agent" | null;
    userId: string | null;
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
    setUserId: (userId: string) => void;
    setAgentCredentials: (agentId: string, apiKey: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    isAuthenticated: false,
    userType: null,
    userId: null,
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
            userId: null,
            walletAddress: null,
            usdcBalance: 0,
            displayName: null,
            agentId: null,
            apiKey: null,
        }),
    setWallet: (address) => set({ walletAddress: address }),
    setBalance: (balance) => set({ usdcBalance: balance }),
    setUserId: (userId) => set({ userId }),
    setAgentCredentials: (agentId, apiKey) => set({ agentId, apiKey }),
}));

// ============================================
// Reading Store — Novel reading state
// ============================================

interface ReadingHistoryItem {
    novelId: string;
    chapterId: string;
    timestamp: number; // Date.now()
    scrollPosition: number; // scroll % (0-1)
}

interface ReadingState {
    currentNovelId: string | null;
    currentChapterId: string | null;
    readingProgress: Record<string, number>; // novelId -> last chapter read
    bookmarks: string[]; // chapterIds
    history: ReadingHistoryItem[]; // ordered by timestamp desc
    favorites: string[]; // novelIds
    scrollPositions: Record<string, number>; // chapterId -> scroll position

    // Actions
    setCurrentReading: (novelId: string, chapterId: string) => void;
    updateProgress: (novelId: string, chapterIndex: number) => void;
    toggleBookmark: (chapterId: string) => void;
    clearReading: () => void;
    addToHistory: (novelId: string, chapterId: string) => void;
    toggleFavorite: (novelId: string) => void;
    saveScrollPosition: (chapterId: string, position: number) => void;
    getScrollPosition: (chapterId: string) => number;
}

export const useReadingStore = create<ReadingState>((set, get) => ({
    currentNovelId: null,
    currentChapterId: null,
    readingProgress: {},
    bookmarks: [],
    history: [],
    favorites: [],
    scrollPositions: {},

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
    addToHistory: (novelId, chapterId) =>
        set((state) => {
            const filtered = state.history.filter((h) => !(h.novelId === novelId && h.chapterId === chapterId));
            return {
                history: [{ novelId, chapterId, timestamp: Date.now(), scrollPosition: 0 }, ...filtered].slice(0, 50),
            };
        }),
    toggleFavorite: (novelId) =>
        set((state) => ({
            favorites: state.favorites.includes(novelId)
                ? state.favorites.filter((id) => id !== novelId)
                : [...state.favorites, novelId],
        })),
    saveScrollPosition: (chapterId, position) =>
        set((state) => ({
            scrollPositions: { ...state.scrollPositions, [chapterId]: position },
        })),
    getScrollPosition: (chapterId) => get().scrollPositions[chapterId] || 0,
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
// Language Store — Cultural Universe system
// ============================================

export const SUPPORTED_LANGUAGES = [
    { code: "zh", native: "中文", english: "Chinese", flag: "🇨🇳" },
    { code: "en", native: "English", english: "English", flag: "🇺🇸" },
    { code: "ar", native: "العربية", english: "Arabic", flag: "🇸🇦" },
    { code: "hi", native: "हिन्दी", english: "Hindi", flag: "🇮🇳" },
    { code: "vi", native: "Tiếng Việt", english: "Vietnamese", flag: "🇻🇳" },
    { code: "ms", native: "Bahasa Melayu", english: "Malay", flag: "🇲🇾" },
    { code: "ja", native: "日本語", english: "Japanese", flag: "🇯🇵" },
    { code: "ko", native: "한국어", english: "Korean", flag: "🇰🇷" },
    { code: "es", native: "Español", english: "Spanish", flag: "🇪🇸" },
    { code: "fr", native: "Français", english: "French", flag: "🇫🇷" },
    { code: "pt", native: "Português", english: "Portuguese", flag: "🇧🇷" },
    { code: "ru", native: "Русский", english: "Russian", flag: "🇷🇺" },
    { code: "th", native: "ภาษาไทย", english: "Thai", flag: "🇹🇭" },
    { code: "id", native: "Bahasa Indonesia", english: "Indonesian", flag: "🇮🇩" },
    { code: "de", native: "Deutsch", english: "German", flag: "🇩🇪" },
] as const;

export type LobbyLanguage = typeof SUPPORTED_LANGUAGES[number]["code"];

interface LanguageState {
    lang: LobbyLanguage;
    setLang: (lang: string) => void;
    autoDetect: () => void;
}

function detectBrowserLanguage(): LobbyLanguage {
    if (typeof navigator === "undefined") return "zh";
    const browserLang = navigator.language.toLowerCase().split("-")[0];
    const match = SUPPORTED_LANGUAGES.find((l) => l.code === browserLang);
    return match ? match.code : "en"; // fallback to English for unsupported
}

export const useLanguageStore = create<LanguageState>((set) => ({
    lang: "zh", // SSR default, will be overridden by autoDetect
    setLang: (lang) => {
        const match = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
        if (match) set({ lang: match.code });
    },
    autoDetect: () => set({ lang: detectBrowserLanguage() }),
}));
