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

with open(json_file_path, 'r') as file:
    data = json.load(file)

shutil.copy(json_file_path, temp_json_file_path)

link = "http://localhost:3000/index.html"
driver = webdriver.Chrome()
driver.get(link)
login_button = driver.find_element(By.XPATH, "/html/body/div[1]/a[4]/div")
login_button.click()
regestration = driver.find_element(By.XPATH, "/html/body/div[2]/p[2]/a")
regestration.click()

login_email = driver.find_element(By.XPATH, "/html/body/div[2]/input[1]")
test_email = "vova2@ne.test"
login_email.send_keys(test_email)
login_name = driver.find_element(By.XPATH, "/html/body/div[2]/input[2]")
test_name = "Vova2"
login_name.send_keys(test_name)
login_surname = driver.find_element(By.XPATH, "/html/body/div[2]/input[3]")
test_surname = "Tester2"
login_surname.send_keys(test_surname)
login_number = driver.find_element(By.XPATH, "/html/body/div[2]/input[4]")
test_number = "+48666666666"
login_number.send_keys(test_number)
login_password = driver.find_element(By.XPATH, "/html/body/div[2]/input[5]")
test_password = "testProfi!e2"
login_password.send_keys(test_password)
login_password2 = driver.find_element(By.XPATH, "/html/body/div[2]/input[6]")
login_password2.send_keys(test_password)
regestration = driver.find_element(By.XPATH, "/html/body/div[2]/button")
regestration.click()


time.sleep(5)
driver.quit()

matched_user = None
for user in data["users"]:
    if (
        user["email"] == test_email
        and user["phone"] == test_number
        and user["password"] == test_password
        and user["name"] == test_name
        and user["surname"] == test_surname
    ):
        matched_user = user
        break

print("Everything OK")

shutil.copy(temp_json_file_path, json_file_path)
os.remove(temp_json_file_path)

server_process.terminate()