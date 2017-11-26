import * as express from "express";
import * as puppeteer from "puppeteer";

export const scrapeNationbuilder = (req: express.Request, res: express.Response) => {
  (async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto("https://sonja2018.nationbuilder.com");
    await page.screenshot().then(function (buffer) {
      res.setHeader('Content-Disposition', 'attachment;filename=ss.png"');
      res.setHeader('Content-Type', 'image/png');
      res.send(buffer)
    });

    await browser.close();
  })();
};