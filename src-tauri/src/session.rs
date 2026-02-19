use crate::models::SessionData;
use std::fs;
use std::path::PathBuf;

fn session_file_path() -> PathBuf {
    let mut path = dirs::data_local_dir().unwrap_or_else(|| PathBuf::from("."));
    path.push("com.arijitdeb.notepad");
    fs::create_dir_all(&path).ok();
    path.push("session.json");
    path
}

#[tauri::command]
pub fn save_session(session: SessionData) -> Result<(), String> {
    let path = session_file_path();
    let json = serde_json::to_string_pretty(&session).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn load_session() -> Result<Option<SessionData>, String> {
    let path = session_file_path();
    if !path.exists() {
        return Ok(None);
    }
    let json = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let session: SessionData = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    Ok(Some(session))
}
