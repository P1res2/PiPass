use tauri::{AppHandle, Manager};
use windows::core::PCWSTR;
use windows::Win32::Graphics::Gdi::{
    CreateCompatibleDC, DeleteDC, DeleteObject, GetDIBits, BITMAPINFO, BITMAPINFOHEADER, BI_RGB,
    DIB_RGB_COLORS,
};
use windows::Win32::UI::Shell::ExtractIconExW;
use windows::Win32::UI::WindowsAndMessaging::{DestroyIcon, GetIconInfo, HICON, ICONINFO};

#[tauri::command]
pub async fn extract_exe_icon(
    exe_path: String,
    credential_id: String,
    app: AppHandle,
) -> Result<String, String> {
    let wide: Vec<u16> = exe_path.encode_utf16().chain(std::iter::once(0)).collect();

    let mut large_icon = [HICON::default()];
    let mut small_icon = [HICON::default()];

    let count = unsafe {
        ExtractIconExW(
            PCWSTR(wide.as_ptr()),
            0,
            Some(large_icon.as_mut_ptr()), // &mut [HICON; 1] → *mut HICON
            Some(small_icon.as_mut_ptr()),
            1,
        )
    };

    if count == 0 {
        return Err("Nenhum ícone encontrado no executável".to_string());
    }

    let hicon = if !large_icon[0].is_invalid() {
        large_icon[0]
    } else {
        small_icon[0]
    };

    let png_bytes = hicon_to_png(hicon)?;

    unsafe {
        let _ = DestroyIcon(large_icon[0]);
        let _ = DestroyIcon(small_icon[0]);
    }

    let data_dir = app.path().app_local_data_dir().map_err(|e| e.to_string())?;

    let icons_dir = data_dir.join("icons");
    std::fs::create_dir_all(&icons_dir).map_err(|e| e.to_string())?;

    let file_path = icons_dir.join(format!("{}.png", credential_id));
    std::fs::write(&file_path, png_bytes).map_err(|e| e.to_string())?;

    Ok(format!("icons/{}.png", credential_id))
}

fn hicon_to_png(hicon: HICON) -> Result<Vec<u8>, String> {
    unsafe {
        let mut icon_info = ICONINFO::default();
        GetIconInfo(hicon, &mut icon_info).map_err(|e| e.to_string())?;

        let hdc = CreateCompatibleDC(None);

        let mut bmi = BITMAPINFO {
            bmiHeader: BITMAPINFOHEADER {
                biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
                biWidth: 32,
                biHeight: -32,
                biPlanes: 1,
                biBitCount: 32,
                biCompression: BI_RGB.0,
                ..Default::default()
            },
            ..Default::default()
        };

        let mut pixels = vec![0u8; 32 * 32 * 4];

        GetDIBits(
            hdc,
            icon_info.hbmColor,
            0,
            32,
            Some(pixels.as_mut_ptr() as *mut _),
            &mut bmi,
            DIB_RGB_COLORS,
        );

        let _ = DeleteDC(hdc);
        let _ = DeleteObject(icon_info.hbmColor.into());
        let _ = DeleteObject(icon_info.hbmMask.into());

        for chunk in pixels.chunks_mut(4) {
            chunk.swap(0, 2); // BGRA → RGBA
        }

        let img = image::RgbaImage::from_raw(32, 32, pixels).ok_or("Falha ao criar imagem")?;

        let mut buf = std::io::Cursor::new(Vec::new());
        img.write_to(&mut buf, image::ImageFormat::Png)
            .map_err(|e| e.to_string())?;

        Ok(buf.into_inner())
    }
}
