import { useEffect } from 'react';
import { TabBar } from './components/TabBar';
import { MenuBar } from './components/MenuBar';
import { Editor } from './components/Editor';
import { FindReplace } from './components/FindReplace';
import { StatusBar } from './components/StatusBar';
import { Settings } from './components/Settings';
import { useEditorStore } from './stores/editorStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './hooks/useTheme';
import './App.css';

function App() {
  const loadSession = useEditorStore((s) => s.loadSession);

  useKeyboardShortcuts();
  useTheme();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return (
    <div className="app">
      <TabBar />
      <MenuBar />
      <FindReplace />
      <Editor />
      <StatusBar />
      <Settings />
    </div>
  );
}

export default App;
