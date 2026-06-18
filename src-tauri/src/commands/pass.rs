use crate::commands::vault::VaultState;
use tauri::{AppHandle, Emitter, Manager};
use tokio::sync::oneshot;

#[tauri::command]
pub async fn request_confirmation(app: AppHandle) -> bool {
    let (tx, rx) = oneshot::channel();

    {
        let state = app.state::<VaultState>();
        *state.pending_confirmation.lock().unwrap() = Some(tx);
    }

    let Some(window) = app.get_webview_window("auth") else {
        return false;
    };

    let _ = window.emit("navigate", "confirm");
    let _ = window.show();
    let _ = window.set_focus();

    rx.await.unwrap_or(false)
}

#[tauri::command]
pub async fn confirm_action(app: AppHandle, result: bool) {
    let state = app.state::<VaultState>();
    let tx = state.pending_confirmation.lock().unwrap().take();
    if let Some(tx) = tx {
        let _ = tx.send(result);
    }
}

#[tauri::command]
pub async fn cancel_confirmation(app: AppHandle) {
    let state = app.state::<VaultState>();
    let tx = state.pending_confirmation.lock().unwrap().take();
    if let Some(tx) = tx {
        let _ = tx.send(false); // resolve o oneshot com false
    }
}
