const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://ucampus.uchile.cl/");

  await page.type("input[name=username]", process.env.UCAMPUS_USER);
  await page.type("input[name=password]", process.env.UCAMPUS_PASS);

  await page.click("input[type=submit]");
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  const linkTareasIniciadas = await page.$x(
    "//a[contains(text(), 'Tareas Iniciadas')]"
  );

  if (linkTareasIniciadas.length > 0) {
    await linkTareasIniciadas[0].click();
  } else {
    console.log("fallé en encontrar tareas iniciadas");
    process.exit(-1);
  }

  await page.waitForSelector("h1");
  const [filas, links] = await page.evaluate(() => {
    const h1Titulo = Array.from(document.querySelectorAll("h1")).find((el) =>
      el.innerText.includes("SIE")
    );

    const tabla = h1Titulo.nextElementSibling.querySelector("table");

    const filas = Array.from(
      tabla.querySelectorAll("tbody > tr:not(.separador)")
    ).map((fila) => {
      return Array.from(fila.querySelectorAll("td")).map(
        (celda) => celda.innerText
      );
    });

    const links = Array.from(tabla.querySelectorAll("tbody a")).map((link) =>
      link.getAttribute("href")
    );

    return [filas, links];
  });

  console.log("datos de filas obtenidos");
  console.log(filas);

  const baseUcampusUrl = page
    .url()
    .substring(0, page.url().lastIndexOf("/") + 1);

  for (const link of links) {
    const url = `${baseUcampusUrl}${link}`;
    console.log(`ingresando a ${url}...`);
    await page.goto(url);

    const filas = await page.evaluate(() => {
      const referencia = Array.from(
        document.querySelectorAll("h2")
      ).find((el) => el.innerText.includes("Detalle de la Solicitud"));
      const tabla = referencia.nextElementSibling.querySelector("table");

      const headers = Array.from(tabla.querySelectorAll("th")).map(
        (head) => head.innerText
      );

      let filas = Array.from(tabla.querySelectorAll("tbody tr")).map((fila) => {
        return Array.from(fila.querySelectorAll("td")).map(
          (celda) => celda.innerText
        );
      });

      filas = filas.map((fila) =>
        Object.fromEntries(fila.map((dato, index) => [headers[index], dato]))
      );

      return filas;
    });

    console.log(filas);
  }

  // await page.screenshot({ path: "example.png" });

  await page.close();
  await browser.close();
})()
  .then(() => console.log("terminado"))
  .catch((err) => {
    console.error("failed", err);
  });
