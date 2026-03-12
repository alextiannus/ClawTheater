// Shared category constants for Claw Theater works.
// These are used for validation in API routes and dropdowns/filters in the frontend.

export const WORK_TYPES = [
    { value: "novel",    label: "小说",  labelEn: "Novel"       },
    { value: "manhwa",   label: "漫剧",  labelEn: "Manhwa"      },
    { value: "audio",    label: "有声书", labelEn: "Audiobook"   },
    { value: "video",    label: "视频",  labelEn: "Video"       },
    { value: "tv",       label: "电视剧", labelEn: "TV Drama"    },
    { value: "movie",    label: "电影",  labelEn: "Movie"       },
    { value: "other",    label: "其他",  labelEn: "Other"       },
] as const;

export type WorkType = typeof WORK_TYPES[number]["value"];

// Sub-genres — primarily for Novels, but reusable.
export const NOVEL_GENRES = [
    { value: "xuanhuan",    label: "玄幻",  labelEn: "Fantasy (Xuanhuan)" },
    { value: "wuxia",       label: "武侠",  labelEn: "Wuxia"              },
    { value: "xianxia",     label: "仙侠",  labelEn: "Xianxia"            },
    { value: "scifi",       label: "科幻",  labelEn: "Sci-Fi"             },
    { value: "history",     label: "历史",  labelEn: "Historical"         },
    { value: "military",    label: "军事",  labelEn: "Military"           },
    { value: "game",        label: "游戏",  labelEn: "Game"               },
    { value: "urban",       label: "都市",  labelEn: "Urban/Modern"       },
    { value: "romance",     label: "言情",  labelEn: "Romance"            },
    { value: "mystery",     label: "悬疑",  labelEn: "Mystery"            },
    { value: "horror",      label: "恐怖",  labelEn: "Horror"             },
    { value: "fanfiction",  label: "同人",  labelEn: "Fan Fiction"        },
    { value: "nonfiction",  label: "工具类", labelEn: "Non-fiction/Tools"  },
    { value: "other",       label: "其他",  labelEn: "Other"              },
] as const;

export type NovelGenre = typeof NOVEL_GENRES[number]["value"];

// Helper: find a work type label
export function getWorkTypeLabel(value: string, lang: "zh" | "en" = "zh"): string {
    const found = WORK_TYPES.find(t => t.value === value);
    if (!found) return value;
    return lang === "zh" ? found.label : found.labelEn;
}

// Helper: find a genre label
export function getGenreLabel(value: string, lang: "zh" | "en" = "zh"): string {
    const found = NOVEL_GENRES.find(g => g.value === value);
    if (!found) return value;
    return lang === "zh" ? found.label : found.labelEn;
}
