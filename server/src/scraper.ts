import * as express from "express";
import * as puppeteer from "puppeteer";

import { Donation } from "./entity/donation";

const DONATION_REGEX = /.*\/signups\/(\d+)\/donations\/(\d+)\/edit/;

const getDonationInfo = async (page: puppeteer.Page, donationUrl: string, donationId: string) => {
  console.log(`Scraping ${donationUrl}`);

  await page.goto(donationUrl);
  await page.waitFor(".signup-name");
  const nameField = await page.$eval(".signup-name", elem => elem.textContent.match(/^\s*(.+?)(\s+\(.*\))?$/));
  if (nameField === null) {
    console.log(`Error: could not parse name ${nameField}`);
    return;
  }
  const name = (nameField[1] as string).toLowerCase().trim();

  const profileLinks: string[] = await page.$$eval(".signup-info-row a", elems => elems.map((e: any) => e.href));
  const emailWithMailto = profileLinks.filter((href) => href.startsWith("mailto"))
  let email = null;
  if (emailWithMailto.length !== 1) {
    console.log(`Error: could not get email from ${profileLinks}`);
  } else {
    email = emailWithMailto[0].toLowerCase().substr("mailto:".length).trim();
  }

  const donationRowInfo: string[] = await page.$$eval(".bs-row h2", elems => elems.map((e: any) => e.innerHTML));
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
  donation.email = email as string;
  donation.name = name;
  donation.nbId = donationId;
  await donation.save();
}

const scrapePage = async (page: puppeteer.Page, pageNum: number, forceAllPages?: boolean) => {
  console.log(`Scraping page ${pageNum}`);

  await page.goto(`https://sonja2018.nationbuilder.com/admin/financial_transactions?page=${pageNum}`);

  const buttonSelector = "a.btn-muted";
  await page.waitFor(buttonSelector);

  const links: string[] = await page.$$eval(buttonSelector, buttons => buttons.map((btn: any) => btn.href));
  for (let i=0; i < links.length; i++) {
    const donationLink = links[i];

    const donationParts = donationLink.match(DONATION_REGEX);
    if (donationParts === null || donationParts.length < 3) {
      throw new Error(`Can't parse donation URL ${donationLink}`);
    }

    const donationId = `${donationParts[1]}:${donationParts[2]}`;
    const doesExist = await Donation.existsInDb(donationId);
    if (!doesExist) {
      if (Math.random() > 0.35) {
        (async () => {
          console.log("Sleeping");
          await new Promise(resolve => setTimeout(resolve, 1000 * (2.0 + (Math.random() * 3))));
        })();
      }
      await getDonationInfo(page, donationLink, donationId);
      if (i === links.length - 1 || forceAllPages) {
        console.log(`Got to last link and we didn't have it -- moving to page ${pageNum + 1}`);
        // we didn't have info for the last item -- go back one page, too
        await scrapePage(page, pageNum + 1);
      }
    } else {
      console.log(`We've already seen ${donationId}`);
    }
  }
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
    await scrapePage(page, 1, req.query.forceAllPages);

    console.log("Done scraping");

    await browser.close();
  })();
};