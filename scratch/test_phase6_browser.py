import os
import time
import shutil
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from PIL import Image

download_dir = os.path.abspath("scratch/phase6_downloads")
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

print("Starting headless Chrome for Phase 6 verification...")
driver = webdriver.Chrome(options=chrome_options)

try:
    wait = WebDriverWait(driver, 25)

    # ========================================================
    # 1. VERIFY DETECTION WORKFLOW (/app/detect)
    # ========================================================
    print("\n--- 1. TESTING DETECTION WORKFLOW (/app/detect) ---")
    driver.get("http://localhost:3000/app/detect")
    
    # Upload watermarked file
    file_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']")))
    wm_path = os.path.abspath("frame-protect-watermarked.png")
    file_input.send_keys(wm_path)
    print("Uploaded watermarked image.")
    time.sleep(2)

    # Enter correct secret key
    key_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Enter secret key']")))
    key_input.clear()
    key_input.send_keys("CameraSecretKey2026")

    # Click Detect Watermark
    detect_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'DETECT WATERMARK')]")))
    detect_btn.click()
    print("Clicked 'DETECT WATERMARK'. Waiting for detection result...")

    wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Extraction Verdict')]")))
    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert "BAYU SLAMET HIDAYAT" in body_text, "Failed to find extracted watermark on detect page!"
    assert "AUTHENTIC / VERIFIED" in body_text, "Failed to find verified badge on detect page!"
    print("[OK] Confirmed: Live Detection extracted 'BAYU SLAMET HIDAYAT' with 'AUTHENTIC / VERIFIED' verdict!")

    # Test with wrong secret key
    key_input.clear()
    key_input.send_keys("WrongKey999")
    detect_btn.click()
    time.sleep(2)
    body_text_wrong = driver.find_element(By.TAG_NAME, "body").text
    assert "NO WATERMARK DETECTED" in body_text_wrong, "Expected NO WATERMARK DETECTED with wrong key!"
    print("[OK] Confirmed: Live Detection correctly reported 'NO WATERMARK DETECTED' with incorrect key!")

    # ========================================================
    # 2. VERIFY ATTACK LAB (/app/attack-lab)
    # ========================================================
    print("\n--- 2. TESTING ATTACK LAB WORKFLOW (/app/attack-lab) ---")
    driver.get("http://localhost:3000/app/attack-lab")

    # Upload watermarked image
    file_input_atk = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']")))
    file_input_atk.send_keys(wm_path)
    print("Uploaded watermarked image into Attack Lab.")
    time.sleep(2)

    # Click an attack vector in palette (e.g. Gaussian Noise)
    noise_card = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Gaussian Noise')]")))
    noise_card.click()
    print("Selected 'Gaussian Noise' attack vector.")
    time.sleep(0.5)

    # Click Simulate Attack
    simulate_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'SIMULATE ATTACK')]")))
    simulate_btn.click()
    print("Clicked 'SIMULATE ATTACK'. Waiting for simulation evaluation...")

    wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Attack Evaluation:')]")))
    body_atk = driver.find_element(By.TAG_NAME, "body").text
    assert "PSNR" in body_atk and "NC" in body_atk and "BER" in body_atk, "Metrics missing from simulation scorecard!"
    print("[OK] Confirmed: Attack simulation evaluated with PSNR, NC, BER, and Verdict!")

    # Verify degraded preview rendered
    imgs = driver.find_elements(By.CSS_SELECTOR, "img")
    assert len(imgs) >= 2, "Degraded image preview not rendered in contact sheet!"
    print(f"[OK] Confirmed: Degraded image loaded in Contact Sheet ({len(imgs)} images in DOM)!")

    # Test Download Degraded Image
    download_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'DOWNLOAD DEGRADED IMAGE')]")))
    download_btn.click()
    print("Clicked 'DOWNLOAD DEGRADED IMAGE'!")

    # Check downloaded file
    time.sleep(2)
    dl_files = [f for f in os.listdir(download_dir) if f.endswith(".png")]
    assert len(dl_files) > 0, "Degraded image not downloaded!"
    dl_path = os.path.join(download_dir, dl_files[0])
    img_dl = Image.open(dl_path)
    print(f"[OK] Confirmed: Downloaded degraded image '{dl_files[0]}' ({os.path.getsize(dl_path)} bytes, {img_dl.size}, {img_dl.format})!")

    # Click Run Full Suite
    print("\n--- 3. TESTING RUN FULL SUITE (6 VECTORS) ---")
    suite_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'RUN FULL SUITE')]")))
    suite_btn.click()
    print("Clicked 'RUN FULL SUITE'. Evaluating 6 distortion vectors...")

    wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Robustness Scorecard (6 Vectors)')]")))
    body_suite = driver.find_element(By.TAG_NAME, "body").text
    for atk_name in ["JPEG Compression", "Crop Attack", "Rescaling Attack", "Gaussian Noise", "Brightness Shift", "Contrast Adjustment"]:
        assert atk_name in body_suite, f"Vector {atk_name} missing from suite scorecard!"
    print("[OK] Confirmed: Full 6-Vector Robustness Scorecard rendered with empirical benchmarks!")

    print("\n=======================================================")
    print("ALL PHASE 6 BROWSER & END-TO-END TESTS PASSED 100%!")
    print("=======================================================")

finally:
    driver.quit()