from selenium import webdriver
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.common.exceptions import NoAlertPresentException
import shutil
import json
import os
import subprocess
import psutil

for proc in psutil.process_iter(['pid', 'name']):
    if 'node.exe' in proc.info['name'] and 'server.js' in ' '.join(proc.cmdline()):
        print(f"Terminating existing Node.js process with PID {proc.info['pid']}")
        psutil.Process(proc.info['pid']).terminate()

time.sleep(2)

#Trzeba podac path na kod projektu
server_process = subprocess.Popen(['node', 'server.js'], cwd='D:\\PO projekt\\PO\\Projekt PO')

time.sleep(5)

json_file_path = 'D:\PO projekt\PO\Projekt PO\db.json'
temp_json_file_path = 'temp_file.json'
shutil.copy(json_file_path, temp_json_file_path)

link = "http://localhost:3000/index.html"
driver = webdriver.Chrome()
driver.get(link)
login_button = driver.find_element(By.XPATH, "/html/body/div[1]/a[4]/div")
login_button.click()
login_login = driver.find_element(By.XPATH, "/html/body/div[2]/input[1]")
login_login.send_keys("vova@ne.test")
login_password = driver.find_element(By.XPATH, "/html/body/div[2]/input[2]")
login_password.send_keys("testProfi!e")
login_login_button = driver.find_element(By.XPATH, "/html/body/div[2]/button")
login_login_button.click()


time.sleep(1)

#Opinia
opinia_button = driver.find_element(By.XPATH, "/html/body/div[1]/a[4]/div")
opinia_button.click()
star_button = driver.find_element(By.XPATH, "/html/body/div[3]/label[3]")
star_button.click()
text_opinia = driver.find_element(By.XPATH, "/html/body/textarea")
test_text = "Test123Test2"
text_opinia.send_keys(test_text)
text_opinia_button = driver.find_element(By.XPATH, "/html/body/button")
text_opinia_button.click()

time.sleep(2)

try:
    alert = Alert(driver)
    alert.accept()
except NoAlertPresentException:
    print("No alert present")

time.sleep(5)
driver.quit()





with open(json_file_path, 'r') as json_file:
    data = json.load(json_file)
    last_opinion_content = data["opinions"][-1]["content"]

time.sleep(1)


if test_text == last_opinion_content:
    print("Everything OK")

time.sleep(1)

shutil.copy(temp_json_file_path, json_file_path)
os.remove(temp_json_file_path)

server_process.terminate()