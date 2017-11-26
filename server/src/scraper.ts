import * as express from "express";
import * as puppeteer from "puppeteer";

import { Donation } from "./entity/donation";

const DONATION_REGEX = /.*\/signups\/(\d+)\/donations\/(\d+)\/edit/;

const getDonationInfo = (page: puppeteer.Page, donationUrl: string, donationId: string) => {
  (async () => {
    console.log(`Scraping ${donationUrl}`);

    await page.goto(donationUrl);
    await page.waitFor(".signup-name");
    const nameField = await page.$eval(".signup-name", elem => elem.text().match(/\s*(.*)\s*\(.*\)/));
    if (nameField === null) {
      console.log(`Error: could not parse name ${nameField}`);
      return;
    }
    const name = nameField[1];

    const profileLinks: string[] = await page.$$eval(".signup-info-row a", elem => elem.href);
    const emailWithMailto = profileLinks.filter((href) => href.startsWith("mailto"))
    if (emailWithMailto.length !== 1) {
      console.log(`Error: could not get email from ${profileLinks}`);
      return;
    }
    const email = emailWithMailto[0].substr("mailto:".length);

    const donationRowInfo: string[] = await page.$$eval(".bs-row h2", elem => elem.innerHTML);
    if (donationRowInfo.length !== 1) {
      console.log(`Error: donation row weirdness ${donationRowInfo}`);
      return;
    }
    const matchedAmount = donationRowInfo[0].match(/\$(\d+\.?\d*)\s+/);
    if (matchedAmount === null) {
      console.log(`Error: couldn't get the donation amount ${donationRowInfo[0]}`);
      return;
    }
    const amount = Number(matchedAmount[1]);

    console.log(`Inserting ${amount}, ${email}, ${name}, to ${donationId}`);

    const donation = new Donation();
    donation.amount = amount;
    donation.email = email;
    donation.name = name;
    donation.nbId = donationId;
    await donation.save();
  })();
}

const scrapePage = (page: puppeteer.Page, pageNum: number) => {
  (async () => {
    await page.goto(`https://sonja2018.nationbuilder.com/admin/financial_transactions?page=${pageNum}`);

    const buttonSelector = "a.btn-muted";
    await page.waitFor(buttonSelector);

    const links: string[] = await page.$$eval(buttonSelector, btn => btn.href);
    //links.map((donationLink, index) => {
    links.slice(0, 1).map((donationLink, index) => {
      const donationParts = donationLink.match(DONATION_REGEX);
      if (donationParts === null || donationParts.length < 3) {
        throw new Error(`Can't parse donation URL ${donationLink}`);
      }

      const donationId = `${donationParts[1]}:${donationParts[2]}`;
      Donation.existsInDb(donationId)
      .then((doesExist) => {
        if (!doesExist) {
          if (Math.random() > 0.35) {
            (async () => {
              console.log("Sleeping");
              await new Promise(resolve => setTimeout(resolve, 1000 * (2.0 + (Math.random() * 3))));
            })();
          }
          getDonationInfo(page, donationLink, donationId);
          if (index === links.length - 1) {
            // we didn't have info for the last item -- go back one page, too
            // scrapePage(page, pageNum + 1);
          }
        }
      });
    });
  })();
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
    await page.waitForSelector('.user_pic');

    console.log("Scraping transactions");
    scrapePage(page, 1);

    await browser.close();
  })();
};