use crate::models::FileContent;
use encoding_rs::*;
use std::fs;
use std::path::Path;

fn detect_encoding(bytes: &[u8]) -> &'static Encoding {
    // Check BOM
    if bytes.len() >= 3 && bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF {
        return UTF_8;
    }
    if bytes.len() >= 2 {
        if bytes[0] == 0xFF && bytes[1] == 0xFE {
            return UTF_16LE;
        }
        if bytes[0] == 0xFE && bytes[1] == 0xFF {
            return UTF_16BE;
        }
    }
    // Default to UTF-8
    UTF_8
}

fn detect_line_ending(content: &str) -> String {
    if content.contains("\r\n") {
        "CRLF".to_string()
    } else if content.contains('\r') {
        "CR".to_string()
    } else {
        "LF".to_string()
    }
}

fn normalize_line_endings(content: &str) -> String {
    // Normalize to LF internally
    content.replace("\r\n", "\n").replace('\r', "\n")
}

fn apply_line_ending(content: &str, line_ending: &str) -> String {
    let normalized = normalize_line_endings(content);
    match line_ending {
        "CRLF" => normalized.replace('\n', "\r\n"),
        "CR" => normalized.replace('\n', "\r"),
        _ => normalized,
    }
}

#[tauri::command]
pub fn read_file(path: String) -> Result<FileContent, String> {
    let file_path = Path::new(&path);
    if !file_path.exists() {
        return Err(format!("File not found: {}", path));
    }

    let bytes = fs::read(file_path).map_err(|e| e.to_string())?;
    let encoding = detect_encoding(&bytes);
    let encoding_name = encoding.name().to_string();

    let (decoded, _, had_errors) = encoding.decode(&bytes);
    if had_errors {
        return Err("Failed to decode file content".to_string());
    }

    let content_str = decoded.to_string();
    let line_ending = detect_line_ending(&content_str);
    let normalized = normalize_line_endings(&content_str);

    Ok(FileContent {
        content: normalized,
        encoding: encoding_name,
        line_ending,
    })
}

#[tauri::command]
pub fn write_file(
    path: String,
    content: String,
    encoding: String,
    line_ending: String,
) -> Result<(), String> {
    let final_content = apply_line_ending(&content, &line_ending);

    let enc = Encoding::for_label(encoding.as_bytes()).unwrap_or(UTF_8);
    let (encoded, _, had_errors) = enc.encode(&final_content);
    if had_errors {
        return Err("Failed to encode file content".to_string());
    }

    fs::write(Path::new(&path), &*encoded).map_err(|e| e.to_string())
}
