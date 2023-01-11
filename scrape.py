from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

def search(s):
    URL = "https://www.dunzo.com/search?category=grocery-stores"

    driver = webdriver.Firefox()
    driver.get(URL)

    ele = driver.find_element(By.XPATH, "/html/body/div/div[2]/div[1]/div/div[1]/input")
    ele.send_keys(s)
    timeout = 5
    out = []
    try:
        element_present = EC.presence_of_element_located((By.CSS_SELECTOR, "div.sc-1iv8oo0-0:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)"))
        WebDriverWait(driver, timeout).until(element_present)
        results_container = driver.find_elements(By.CSS_SELECTOR, "div.sc-1iv8oo0-0:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div.slick-active")
        for ele in results_container:
            title = ele.find_element(By.CSS_SELECTOR, "p").text
            price = ele.find_element(By.CSS_SELECTOR, "div > div > div > div > p").text
            link = ele.find_element(By.CSS_SELECTOR, "a").get_attribute("href")
            img = ele.find_element(By.CSS_SELECTOR, "img").get_attribute("src")

            out.append((title, price, link, img))
    except TimeoutException:
        print ("Timed out waiting for page to load")
        
    driver.close()

    return out




#driver.close()
