use regex::Regex;
use serde::{Deserialize, Serialize};
use std::fs;

/// 表示一个路径变更
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PathChange {
    pub old_path: String,
    pub new_path: String,
}

/// 转换结果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConvertResult {
    pub content: String,
    pub changes: Vec<PathChange>,
}

/// 读取文件内容
#[tauri::command]
fn read_file(path: &str) -> Result<String, String> {
    // 尝试 UTF-8
    match fs::read_to_string(path) {
        Ok(content) => Ok(content),
        Err(_) => {
            // 尝试读取为字节并使用 GBK 解码
            match fs::read(path) {
                Ok(bytes) => {
                    // 简单的 GBK 兼容处理 - 对于大多数中文 Windows 系统
                Ok(String::from_utf8_lossy(&bytes).to_string())
                }
                Err(e) => Err(format!("无法读取文件: {}", e)),
            }
        }
    }
}

/// 转换图片路径
#[tauri::command]
fn convert_paths(content: &str, target_prefix: &str) -> Result<ConvertResult, String> {
    // 匹配 Markdown 图片语法: ![alt](path)
    let re = Regex::new(r"(!\[[^\]]*\]\()([^)]+)(\))").map_err(|e| e.to_string())?;
    
    let mut changes: Vec<PathChange> = Vec::new();
    
    let new_content = re.replace_all(content, |caps: &regex::Captures| {
        let prefix = &caps[1];
        let full_path = &caps[2];
        let suffix = &caps[3];
        
        // 将反斜杠转为正斜杠，提取文件名
        let normalized = full_path.replace('\\', "/");
        let filename = normalized.rsplit('/').next().unwrap_or(full_path);
        
        let new_path = format!("{}/{}", target_prefix, filename);
        
        // 记录变更（如果路径确实改变了）
        if full_path != new_path {
            changes.push(PathChange {
                old_path: full_path.to_string(),
                new_path: new_path.clone(),
            });
        }
        
        format!("{}{}{}", prefix, new_path, suffix)
    });
    
    Ok(ConvertResult {
        content: new_content.to_string(),
        changes,
    })
}

/// 转换并保存（覆盖原文件）
#[tauri::command]
fn convert_and_save(path: &str, target_prefix: &str) -> Result<usize, String> {
    let content = read_file(path)?;
    let result = convert_paths(&content, target_prefix)?;
    
    fs::write(path, &result.content).map_err(|e| format!("保存失败: {}", e))?;
    
    Ok(result.changes.len())
}

/// 转换并另存为
#[tauri::command]
fn convert_and_save_as(
    source_path: &str,
    target_path: &str,
    target_prefix: &str,
) -> Result<usize, String> {
    let content = read_file(source_path)?;
    let result = convert_paths(&content, target_prefix)?;
    
    fs::write(target_path, &result.content).map_err(|e| format!("保存失败: {}", e))?;
    
    Ok(result.changes.len())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            read_file,
            convert_paths,
            convert_and_save,
            convert_and_save_as
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
