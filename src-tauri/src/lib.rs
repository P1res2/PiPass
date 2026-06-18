use crate::commands::vault::VaultState;
use std::sync::Mutex;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

mod commands;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        // Start vault state
        .manage(VaultState {
            is_unlocked: Mutex::new(false),
            pending_confirmation: Mutex::new(None),
        })
        .setup(|app| {
            let salt_path = app
                .path()
                .app_local_data_dir()
                .expect("could not resolve app local data path")
                .join("salt.txt");

            app.handle()
                .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;

            // System Tray
            let show = MenuItem::with_id(app, "show", "Open", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show, &quit_i])?;

            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .show_menu_on_left_click(false)
                .icon(app.default_window_icon().unwrap().clone())
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        handle_open_window(app);
                    }
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } => {
                        handle_open_window(tray.app_handle());
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                window.hide().unwrap();
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::process::get_focused_process,
            commands::icon::extract_exe_icon,
            commands::vault::set_vault_state,
            commands::vault::get_vault_state,
            commands::pass::request_confirmation,
            commands::pass::confirm_action,
            commands::pass::cancel_confirmation,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn handle_open_window(app: &tauri::AppHandle) {
    let state = app.state::<VaultState>();
    let is_unlocked = *state.is_unlocked.lock().unwrap();

    if let Some(window) = app.get_webview_window(if is_unlocked { "main" } else { "auth" }) {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}
