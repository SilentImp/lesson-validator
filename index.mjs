import fs from 'fs';
import Rembrandt from 'rembrandt';
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent('<s>some</s>');
  await page.screenshot({
    path: '1.png',
    type: 'png',
  });
  await page.setContent('<p>some</p>');
  await page.screenshot({
    path: '2.png',
    type: 'png',
  });


  const rembrandt = new Rembrandt({
    // `imageA` and `imageB` can be either Strings (file path on node.js,
    // public url on Browsers) or Buffers
    imageA: '1.png',
    imageB: fs.readFileSync('2.png'),

    // Needs to be one of Rembrandt.THRESHOLD_PERCENT or Rembrandt.THRESHOLD_PIXELS
    thresholdType: Rembrandt.THRESHOLD_PERCENT,

    // The maximum threshold (0...1 for THRESHOLD_PERCENT, pixel count for THRESHOLD_PIXELS
    maxThreshold: 0.0001,

    // Maximum color delta (0...1):
    maxDelta: 0.01,

    // Maximum surrounding pixel offset
    maxOffset: 0,

    renderComposition: true, // Should Rembrandt render a composition image?
    compositionMaskColor: Rembrandt.Color.RED // Color of unmatched pixels
  })

  // Run the comparison
  rembrandt.compare()
    .then(function (result) {
      console.log('Passed:', result.passed)
      console.log('Pixel Difference:', result.differences, 'Percentage Difference', result.percentageDifference, '%')
      console.log('Composition image buffer:', result.compositionImage)
      fs.writeFile('3.png', result.compositionImage, (err) => {
        if (err) return console.error(err)
        console.log('file saved to 3.png')
      })
      // Note that `compositionImage` is an Image when Rembrandt.js is run in the browser environment
    })
    .catch((e) => {
      console.error(e)
    })

    await browser.close();
  })();