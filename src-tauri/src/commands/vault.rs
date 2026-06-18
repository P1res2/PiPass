use std::sync::Mutex;
use tauri::State;
use tokio::sync::oneshot;

// Global state
pub struct VaultState {
    pub is_unlocked: Mutex<bool>,
    pub pending_confirmation: Mutex<Option<oneshot::Sender<bool>>>,
}

#[tauri::command]
pub fn set_vault_state(state: State<VaultState>, unlocked: bool) {
    let mut lock = state.is_unlocked.lock().unwrap();
    *lock = unlocked;
}

#[tauri::command]
pub fn get_vault_state(state: State<VaultState>) -> bool {
    *state.is_unlocked.lock().unwrap()
}
