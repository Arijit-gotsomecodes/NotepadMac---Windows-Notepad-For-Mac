mod file_ops;
mod models;
mod session;

use file_ops::{read_file, write_file};
use session::{load_session, save_session};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            read_file,
            write_file,
            save_session,
            load_session,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
