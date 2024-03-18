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
server_process = subprocess.Popen(['node', 'server.js'], cwd='C:\\Users\\sb085\\Downloads\\Projekt_PO\\Projekt PO')

time.sleep(5)

json_file_path = 'db.json'
temp_json_file_path = 'temp_file.json'
shutil.copy(json_file_path, temp_json_file_path)

link = "http://localhost:3000/index.html"
driver = webdriver.Chrome()
driver.get(link)
driver.fullscreen_window()
login_button = driver.find_element(By.XPATH, "/html/body/div[1]/a[4]/div")
login_button.click()
login_login = driver.find_element(By.XPATH, "/html/body/div[2]/input[1]")
login_login.send_keys("vova@ne.test")
login_password = driver.find_element(By.XPATH, "/html/body/div[2]/input[2]")
login_password.send_keys("testProfi!e")
login_login_button = driver.find_element(By.XPATH, "/html/body/div[2]/button")
login_login_button.click()


time.sleep(1)
oferta_to = driver.find_element(By.XPATH, "/html/body/div[1]/a[2]/div")
oferta_to.click()

element = driver.find_element(By.XPATH, "/html/body/ul/li[1]/div/p[2]")
element_text = element.text
availability = int(element_text.split(':')[-1].strip().split(' ')[0])
print(availability)
dowiedz_sie_wiecej = driver.find_element(By.XPATH, "/html/body/ul/li[1]/a/div")
dowiedz_sie_wiecej.click()

wypozyc = driver.find_element(By.XPATH, "/html/body/button")
wypozyc.click()

time.sleep(2)

try:
    alert = Alert(driver)
    alert.accept()
except NoAlertPresentException:
    print("No alert present")

element2 = driver.find_element(By.XPATH, "/html/body/div[2]/div/p[2]")
element_text = element2.text
availability2 = int(element_text.split(':')[-1].strip().split(' ')[0])
print(availability)

if availability2 == availability - 1:
    print("Everything OK")

time.sleep(5)
driver.quit()

shutil.copy(temp_json_file_path, json_file_path)
os.remove(temp_json_file_path)

server_process.terminate()