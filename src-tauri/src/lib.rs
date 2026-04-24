#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(debug_assertions)]
      {
        use tauri::Manager;
        use tauri::menu::{Menu, MenuItem};

        // Debug builds only: add an F12 accelerator to toggle DevTools.
        // (Tauri v2 doesn't expose a shortcut manager without a plugin.)
        let toggle_devtools = MenuItem::with_id(app, "toggle-devtools", "Toggle DevTools", true, Some("F12"))?;
        let menu = Menu::with_items(app, &[&toggle_devtools])?;
        app.set_menu(menu)?;

        let handle = app.handle().clone();
        app.on_menu_event(move |_app, event| {
          if event.id() == "toggle-devtools" {
            if let Some(window) = handle.get_webview_window("main") {
              if window.is_devtools_open() {
                let _ = window.close_devtools();
              } else {
                let _ = window.open_devtools();
              }
            }
          }
        });
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

