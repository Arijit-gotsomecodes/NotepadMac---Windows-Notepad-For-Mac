use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileContent {
    pub content: String,
    pub encoding: String,
    pub line_ending: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TabState {
    pub id: String,
    pub title: String,
    pub file_path: Option<String>,
    pub content: String,
    pub is_dirty: bool,
    pub encoding: String,
    pub line_ending: String,
    pub cursor_line: usize,
    pub cursor_col: usize,
    pub scroll_top: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionData {
    pub tabs: Vec<TabState>,
    pub active_tab_id: String,
}
