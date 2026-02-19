import React from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useSettingsStore } from '../stores/settingsStore';
import './StatusBar.css';

export const StatusBar: React.FC = () => {
    const { tabs, activeTabId } = useEditorStore();
    const { zoom, showStatusBar } = useSettingsStore();
    const activeTab = tabs.find((t) => t.id === activeTabId);

    if (!showStatusBar || !activeTab) return null;

    const charCount = activeTab.content.length;
    const lineCount = activeTab.content.split('\n').length;

    return (
        <div className="status-bar">
            <div className="status-left">
                <span className="status-item">
                    Ln {activeTab.cursorLine}, Col {activeTab.cursorCol}
                </span>
                <span className="status-item">
                    {charCount} characters
                </span>
                <span className="status-item">
                    {lineCount} lines
                </span>
            </div>
            <div className="status-right">
                <span className="status-item">{zoom}%</span>
                <span className="status-item">{activeTab.encoding}</span>
                <span className="status-item">{activeTab.lineEnding}</span>
            </div>
        </div>
    );
};
