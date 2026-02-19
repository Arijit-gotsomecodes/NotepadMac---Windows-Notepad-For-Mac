import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { useEditorStore } from '../stores/editorStore';
import './FindReplace.css';

export const FindReplace: React.FC = () => {
    const { showFindReplace, findReplaceMode, closeFindReplace } = useSettingsStore();
    const { tabs, activeTabId, updateContent, pushUndo } = useEditorStore();
    const activeTab = tabs.find((t) => t.id === activeTabId);

    const [searchTerm, setSearchTerm] = useState('');
    const [replaceTerm, setReplaceTerm] = useState('');
    const [matchCase, setMatchCase] = useState(false);
    const [wholeWord, setWholeWord] = useState(false);
    const [currentMatch, setCurrentMatch] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);

    const findInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showFindReplace && findInputRef.current) {
            findInputRef.current.focus();
            findInputRef.current.select();
        }
    }, [showFindReplace, findReplaceMode]);

    const findMatches = useCallback((): number[] => {
        if (!activeTab || !searchTerm) return [];
        const content = activeTab.content;
        const flags = matchCase ? 'g' : 'gi';
        let pattern = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (wholeWord) {
            pattern = `\\b${pattern}\\b`;
        }
        const regex = new RegExp(pattern, flags);
        const positions: number[] = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            positions.push(match.index);
        }
        return positions;
    }, [activeTab?.content, searchTerm, matchCase, wholeWord]);

    useEffect(() => {
        const positions = findMatches();
        setTotalMatches(positions.length);
        if (currentMatch >= positions.length) {
            setCurrentMatch(positions.length > 0 ? 0 : 0);
        }
    }, [searchTerm, matchCase, wholeWord, activeTab?.content, findMatches]);

    const navigateMatch = (direction: 'next' | 'prev') => {
        const positions = findMatches();
        if (positions.length === 0) return;

        let newIndex = currentMatch;
        if (direction === 'next') {
            newIndex = (currentMatch + 1) % positions.length;
        } else {
            newIndex = (currentMatch - 1 + positions.length) % positions.length;
        }
        setCurrentMatch(newIndex);

        // Select the match in the textarea
        const textarea = document.querySelector('.editor-textarea') as HTMLTextAreaElement;
        if (textarea) {
            const pos = positions[newIndex];
            textarea.focus();
            textarea.setSelectionRange(pos, pos + searchTerm.length);
            // Scroll into view
            const textBefore = activeTab!.content.substring(0, pos);
            const lineNum = textBefore.split('\n').length;
            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
            textarea.scrollTop = Math.max(0, (lineNum - 5) * lineHeight);
        }
    };

    const handleReplace = () => {
        if (!activeTab || totalMatches === 0) return;
        const positions = findMatches();
        if (positions.length === 0) return;

        const pos = positions[currentMatch];
        pushUndo(activeTab.id, activeTab.content);
        const newContent =
            activeTab.content.substring(0, pos) +
            replaceTerm +
            activeTab.content.substring(pos + searchTerm.length);
        updateContent(activeTab.id, newContent);

        // Update textarea
        const textarea = document.querySelector('.editor-textarea') as HTMLTextAreaElement;
        if (textarea) {
            textarea.value = newContent;
            textarea.setSelectionRange(pos, pos + replaceTerm.length);
        }
    };

    const handleReplaceAll = () => {
        if (!activeTab || totalMatches === 0) return;

        pushUndo(activeTab.id, activeTab.content);
        const flags = matchCase ? 'g' : 'gi';
        let pattern = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (wholeWord) {
            pattern = `\\b${pattern}\\b`;
        }
        const regex = new RegExp(pattern, flags);
        const newContent = activeTab.content.replace(regex, replaceTerm);
        updateContent(activeTab.id, newContent);

        const textarea = document.querySelector('.editor-textarea') as HTMLTextAreaElement;
        if (textarea) {
            textarea.value = newContent;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeFindReplace();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            navigateMatch(e.shiftKey ? 'prev' : 'next');
        }
    };

    if (!showFindReplace) return null;

    return (
        <div className="find-replace-bar" onKeyDown={handleKeyDown}>
            <div className="find-row">
                <div className="find-input-group">
                    <input
                        ref={findInputRef}
                        type="text"
                        className="find-input"
                        placeholder="Find"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="match-count">
                        {searchTerm ? `${totalMatches > 0 ? currentMatch + 1 : 0} of ${totalMatches}` : 'No results'}
                    </span>
                </div>

                <div className="find-actions">
                    <button
                        className={`find-toggle ${matchCase ? 'active' : ''}`}
                        onClick={() => setMatchCase(!matchCase)}
                        title="Match Case"
                    >
                        Aa
                    </button>
                    <button
                        className={`find-toggle ${wholeWord ? 'active' : ''}`}
                        onClick={() => setWholeWord(!wholeWord)}
                        title="Whole Word"
                    >
                        W
                    </button>
                    <button className="find-btn" onClick={() => navigateMatch('prev')} title="Previous (Shift+Enter)">
                        ↑
                    </button>
                    <button className="find-btn" onClick={() => navigateMatch('next')} title="Next (Enter)">
                        ↓
                    </button>
                    <button className="find-close" onClick={closeFindReplace} title="Close (Esc)">
                        ×
                    </button>
                </div>
            </div>

            {findReplaceMode === 'replace' && (
                <div className="replace-row">
                    <div className="find-input-group">
                        <input
                            type="text"
                            className="find-input"
                            placeholder="Replace"
                            value={replaceTerm}
                            onChange={(e) => setReplaceTerm(e.target.value)}
                        />
                    </div>
                    <div className="find-actions">
                        <button className="find-btn replace-btn" onClick={handleReplace} title="Replace">
                            Replace
                        </button>
                        <button className="find-btn replace-btn" onClick={handleReplaceAll} title="Replace All">
                            All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
