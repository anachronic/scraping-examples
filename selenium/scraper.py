from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os

driver_path = os.getenv('DRIVER_PATH', '/usr/local/bin/chromedriver')


def main():
    options = Options()
    options.headless = True
    options.add_argument("--window-size=1920,1200")

    driver = webdriver.Chrome(options=options, executable_path=driver_path)
    driver.get("https://ucampus.uchile.cl/")

    ucampus_user = os.environ['UCAMPUS_USER']
    ucampus_pass = os.environ['UCAMPUS_PASS']

    input_username = driver.find_element_by_css_selector('input[type=text]')
    input_password = driver.find_element_by_css_selector('input[type=password]')

    input_username.send_keys(ucampus_user)
    input_password.send_keys(ucampus_pass)

    driver.find_element_by_css_selector("input[type=submit]").click()

    link_tareas_iniciadas = driver.find_element_by_xpath(
        "//a[contains(text(), 'Tareas Iniciadas')]"
    )
    link_tareas_iniciadas.click()

    container_tabla = driver.find_element_by_xpath(
        "//h1[contains(.,'SIE')]/following-sibling::div"
    )
    tabla = container_tabla.find_element_by_css_selector('table')

    filas_iniciales = tabla.find_elements_by_css_selector('tbody > tr:not(.separador)')
    filas_iniciales = [
        [
            celda.text
            for celda in f.find_elements_by_css_selector('td')
        ]
        for f in filas_iniciales
    ]

    links = tabla.find_elements_by_css_selector('a')
    links = [link.get_attribute('href') for link in links]

    datos_scrapeados = []
    for link in links:
        driver.get(link)
        container_tabla = driver.find_element_by_xpath(
            "//h2[contains(.,'Detalle de la Solicitud')]/following-sibling::div"
        )
        tabla = container_tabla.find_element_by_css_selector('table')
        headers = tabla.find_elements_by_css_selector('th')
        headers = [header.text for header in headers]

        filas = tabla.find_elements_by_css_selector('tbody tr')
        datos_scrapeados += [
            {
                headers[i]: celda.text
                for i, celda in enumerate(fila.find_elements_by_css_selector('td'))
            }
            for fila in filas
        ]

    print('filas iniciales')
    print(filas_iniciales)

    print()

    print('especifico')
    import json
    print(json.dumps(datos_scrapeados, indent=True))

    driver.save_screenshot('screenshot.png')
    driver.quit()


if __name__ == '__main__':
    main()
