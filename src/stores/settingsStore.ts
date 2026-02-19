import { create } from 'zustand';

interface SettingsState {
    theme: 'light' | 'dark' | 'system';
    wordWrap: boolean;
    zoom: number;
    showStatusBar: boolean;
    fontFamily: string;
    fontSize: number;
    showFindReplace: boolean;
    findReplaceMode: 'find' | 'replace';

    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    toggleWordWrap: () => void;
    setZoom: (zoom: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    toggleStatusBar: () => void;
    setFontFamily: (font: string) => void;
    setFontSize: (size: number) => void;
    toggleFindReplace: (mode?: 'find' | 'replace') => void;
    closeFindReplace: () => void;
    isSettingsOpen: boolean;
    toggleSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    theme: 'system',
    wordWrap: true,
    zoom: 100,
    showStatusBar: true,
    fontFamily: 'SF Mono, Menlo, Consolas, monospace',
    fontSize: 14,
    showFindReplace: false,
    findReplaceMode: 'find',
    isSettingsOpen: false,

    setTheme: (theme) => set({ theme }),
    toggleWordWrap: () => set((s) => ({ wordWrap: !s.wordWrap })),
    setZoom: (zoom) => set({ zoom: Math.max(50, Math.min(500, zoom)) }),
    zoomIn: () => set((s) => ({ zoom: Math.min(500, s.zoom + 10) })),
    zoomOut: () => set((s) => ({ zoom: Math.max(50, s.zoom - 10) })),
    resetZoom: () => set({ zoom: 100 }),
    toggleStatusBar: () => set((s) => ({ showStatusBar: !s.showStatusBar })),
    setFontFamily: (fontFamily) => set({ fontFamily }),
    setFontSize: (fontSize) => set({ fontSize: Math.max(8, Math.min(72, fontSize)) }),
    toggleFindReplace: (mode) =>
        set((s) => {
            if (s.showFindReplace && s.findReplaceMode === (mode || 'find')) {
                return { showFindReplace: false };
            }
            return { showFindReplace: true, findReplaceMode: mode || 'find' };
        }),
    closeFindReplace: () => set({ showFindReplace: false }),
    toggleSettings: () => set((s) => ({ isSettingsOpen: !s.isSettingsOpen })),
}));
