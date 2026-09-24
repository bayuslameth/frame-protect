import os
import time
import shutil
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from PIL import Image
import numpy as np

# Configure Download directory
download_dir = os.path.abspath("scratch/browser_downloads")
if os.path.exists(download_dir):
    shutil.rmtree(download_dir)
os.makedirs(download_dir, exist_ok=True)

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--window-size=1600,1200")
chrome_options.add_experimental_option("prefs", {
    "download.default_directory": download_dir,
    "download.prompt_for_download": False,
    "download.directory_upgrade": True,
    "safebrowsing.enabled": True
})

print("Starting headless Chrome...")
driver = webdriver.Chrome(options=chrome_options)

try:
    url = "http://localhost:3000/app/protect"
    print(f"Navigating to {url}...")
    driver.get(url)
    wait = WebDriverWait(driver, 25)

    # 1. Upload source image
    print("Step 1: Uploading photograph...")
    file_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']")))
    photo_path = os.path.abspath("sample_photo.jpg")
    file_input.send_keys(photo_path)
    print(f"Uploaded {photo_path}")

    # Wait for image preview in upload zone
    time.sleep(2)

    # 2. Configure Text Watermark
    print("Step 2: Entering watermark text 'BAYU SLAMET HIDAYAT'...")
    text_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='FRAME PROTECT']")))
    text_input.clear()
    text_input.send_keys("BAYU SLAMET HIDAYAT")

    # 3. Enter secret key
    print("Step 3: Entering secret key...")
    key_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Enter secret key']")))
    key_input.clear()
    key_input.send_keys("SecretKey2026")

    # 4. Click Embed Watermark button
    print("Step 4: Clicking 'EMBED WATERMARK'...")
    embed_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'EMBED WATERMARK')]")))
    embed_button.click()

    # 5. Confirm success & embedding record
    print("Step 5: Waiting for embedding and baseline verification to complete...")
    wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Embedding Record')]")))
    print("[OK] Confirmed: 'Embedding Record' is displayed!")
    
    # 6. Confirm watermarked preview in Contact Sheet
    contact_sheet = driver.find_elements(By.CSS_SELECTOR, "img")
    print(f"Found {len(contact_sheet)} preview image elements in DOM.")
    assert len(contact_sheet) >= 2, "Watermarked preview image not rendered in contact sheet!"
    print("[OK] Confirmed: Watermarked preview frame is loaded!")

    # 7. Confirm PSNR, NC, BER & 8. Confirm extracted watermark
    baseline_section = wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Baseline Verification')]")))
    print("[OK] Confirmed: 'Baseline Verification' section is displayed!")

    page_text = driver.find_element(By.TAG_NAME, "body").text
    print("\n--- UI DISPLAY VERIFICATION ---")
    
    # Check extracted watermark text
    assert "BAYU SLAMET HIDAYAT" in page_text, "Extracted watermark text 'BAYU SLAMET HIDAYAT' not found on page!"
    print("[OK] Confirmed: UI displays Extracted Watermark: 'BAYU SLAMET HIDAYAT'")

    # Check metrics
    assert "PSNR" in page_text, "PSNR metric not displayed"
    assert "NC" in page_text, "NC metric not displayed"
    assert "BER" in page_text, "BER metric not displayed"
    print("[OK] Confirmed: UI displays PSNR, NC, and BER metric cards!")

    # 9. Click Download button
    print("\nStep 9: Locating and clicking 'DOWNLOAD WATERMARKED IMAGE'...")
    download_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'DOWNLOAD WATERMARKED IMAGE')]")
    assert len(download_buttons) > 0, "DOWNLOAD WATERMARKED IMAGE button not found!"
    print(f"Found {len(download_buttons)} 'DOWNLOAD WATERMARKED IMAGE' button(s) in UI.")
    download_buttons[0].click()
    print("Clicked 'DOWNLOAD WATERMARKED IMAGE'!")

    # 10. Confirm downloaded file is valid
    print("\nStep 10: Verifying downloaded file in browser downloads...")
    downloaded_file = None
    for _ in range(25):
        time.sleep(0.5)
        files = os.listdir(download_dir)
        png_files = [f for f in files if f.endswith(".png")]
        if png_files:
            downloaded_file = os.path.join(download_dir, png_files[0])
            break

    assert downloaded_file and os.path.exists(downloaded_file), "Downloaded file did not appear in downloads folder!"
    file_size = os.path.getsize(downloaded_file)
    print(f"[OK] Downloaded file received: {os.path.basename(downloaded_file)} ({file_size} bytes)")

    # Verify image integrity
    dl_img = Image.open(downloaded_file)
    print(f"[OK] Image opens successfully! Format: {dl_img.format}, Size: {dl_img.size}, Mode: {dl_img.mode}")
    orig_img = Image.open("sample_photo.jpg")
    assert dl_img.size == orig_img.size, f"Dimension mismatch: {dl_img.size} vs {orig_img.size}"

    # Verify pixel difference
    orig_arr = np.array(orig_img.convert("RGB"))
    dl_arr = np.array(dl_img.convert("RGB"))
    diff_pixels = np.count_nonzero(np.abs(orig_arr.astype(int) - dl_arr.astype(int)).any(axis=-1))
    print(f"[OK] Pixel difference: {diff_pixels} / {orig_arr.shape[0]*orig_arr.shape[1]} pixels modified.")
    assert diff_pixels > 0, "Downloaded file is identical to original (no watermark embedded)!"

    # Blind extraction check from downloaded file
    from app.watermark.extract import extract_watermark
    from app.watermark.payload import bits_to_text, text_to_bits
    extracted_bits = extract_watermark(dl_arr, "SecretKey2026", max_payload_bits=208)
    recovered = bits_to_text(extracted_bits)
    print(f"[OK] Extracted text from downloaded file: '{recovered}'")
    assert recovered == "BAYU SLAMET HIDAYAT", f"Failed to extract watermark from downloaded file: '{recovered}'"

    print("\n==========================================")
    print("ALL BROWSER WORKFLOW VERIFICATION STEPS PASSED!")
    print("==========================================")

finally:
    driver.quit()
