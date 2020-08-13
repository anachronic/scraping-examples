# Ejemplos de scraping

Este repositorio contiene dos repositorios de ejemplo.

El primero usa [puppeteer](https://pptr.dev/) y el segundo [Selenium](https://selenium-python.readthedocs.io/) con [chromedriver](https://chromedriver.chromium.org/).

El propósito de este repositorio es mostrar que es posible hacerle scraping a UCampus a través de estas librerías y ambas pueden navegar el sitio sin problemas.

Para ocuparlo simplemente defina las variables de entorno `UCAMPUS_USER` y `UCAMPUS_PASS` y corra los archivos (`index.js` para puppeteer y `scraper.py` para selenium). Note que para usar selenium deberá instalar algún driver. Las pruebas para este repositorio fueron hechas en macOS 10.15.5 y ChromeDriver 84.0.4147.30 (48b3e868b4cc0aa7e8149519690b6f6949e110a8-refs/branch-heads/4147@{#310}) instalado a través de [Homebrew](https://brew.sh/). Para evitar la complejidad, es más fácil correr puppeteer, que no necesita dependencias externas a las de Node.
