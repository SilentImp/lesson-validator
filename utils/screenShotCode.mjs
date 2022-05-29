import puppeteer from 'puppeteer';
import convertTo from './convertTo.mjs';

const screenShotCode = async ({
  customerCode,
  customerPath,
  referenceCode,
  referencePath,
}) => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(customerCode);
  await page.screenshot({
    path: customerPath('png'),
    fullPage: true,
    type: 'png',
  });
  await page.screenshot({
    path: customerPath('webp'),
    fullPage: true,
    quality: 100,
    type: 'webp',
  });
  await page.setContent(referenceCode);
  await page.screenshot({
    path: referencePath('png'),
    fullPage: true,
    type: 'png',
  });
  await page.screenshot({
    path: referencePath('webp'),
    fullPage: true,
    quality: 100,
    type: 'webp',
  });

  convertTo(customerPath, 'webp', ['avif']);
  convertTo(referencePath, 'webp', ['avif']);

  await browser.close();
};

export default screenShotCode;