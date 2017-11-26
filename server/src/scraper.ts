import * as express from "express";
import * as puppeteer from "puppeteer";

const scrapePage = (page: puppeteer.Page, pageNum: number) => {
  (async () => {
    await page.goto(`https://sonja2018.nationbuilder.com/admin/financial_transactions?page=${pageNum}`);

    const buttonSelector = "a.btn-muted";
    await page.waitFor(buttonSelector);

    const links = await page.$$eval(buttonSelector, btn => btn.href);
    console.log(links);
  });
}

export const scrapeNationbuilder = (req: express.Request, res: express.Response) => {
  (async () => {
    console.log("Scraping nationbuilder");

    if (!process.env.NATIONBUILDER_EMAIL || !process.env.NATIONBUILDER_PASSWORD) {
      throw new Error("you need to specify a nationbuilder user or password in env vars to use this");
    }
    const nbEmail = process.env.NATIONBUILDER_EMAIL as string;
    const nbPassword = process.env.NATIONBUILDER_PASSWORD as string;

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log("Beginning login");
    const page = await browser.newPage();
    await page.goto("https://sonja2018.nationbuilder.com/forms/user_sessions/new");

    // log in
    const emailSelector = "#user_session_email";
    const passwordSelector = "#user_session_password";

    await page.waitFor(emailSelector);
    await page.type(emailSelector, nbEmail);
    await page.waitFor(passwordSelector);
    await page.type(passwordSelector, nbPassword);

    console.log("Submitting info");
    const loginSelector = '.submit-button[value="Sign in with email"]';
    await page.waitFor(loginSelector);
    await page.click(loginSelector);
    await page.waitForSelector('$(".user_pic")');

    console.log("Scraping transactions");
    await scrapePage(page, 1);

    await browser.close();
  })();
};