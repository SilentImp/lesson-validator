import fs from 'node:fs';
import Rembrandt from 'rembrandt';
import convertTo from './convertTo.mjs';

const defaultOptions = {
  // The maximum threshold (0...1 for THRESHOLD_PERCENT, pixel count for THRESHOLD_PIXELS
  maxThreshold: 0.00001,

  // Maximum color delta (0...1):
  maxDelta: 0.001,

  // Maximum surrounding pixel offset
  maxOffset: 0,
};

const compareScreenShots = ({
  customerPath, 
  referencePath, 
  diffPath, 
  options = defaultOptions,
}) => (new Promise((resolve, reject) => {

  const rembrandt = new Rembrandt({
    // `imageA` and `imageB` can be either Strings (file path on node.js,
    // public url on Browsers) or Buffers
    imageA: customerPath('png'),
    imageB: referencePath('png'),

    // Needs to be one of Rembrandt.THRESHOLD_PERCENT or Rembrandt.THRESHOLD_PIXELS
    thresholdType: Rembrandt.THRESHOLD_PERCENT,

    renderComposition: true, // Should Rembrandt render a composition image?
    compositionMaskColor: Rembrandt.Color.RED, // Color of unmatched pixels

    ...options,
  });

  // Run the comparison
  rembrandt.compare()
    .then(function (result) {
      console.log('Passed:', result.passed);
      console.log('Pixel Difference:', result.differences, 'Percentage Difference', result.percentageDifference, '%');
      console.log('Composition image buffer:', result.compositionImage);

      fs.writeFile(diffPath('png'), result.compositionImage, (error) => {
        if (error) {
          console.error(error);
          return reject(error);
        }
        console.log('file saved to 3.png');

        convertTo(diffPath, 'png', ['avif', 'webp']);
      });

      resolve({
        passed: result.passed,
        differences: result.differences,
        percentageDifference: result.percentageDifference,
        customer: customerPath('webp').replace(/^public/ig, ''),
        reference: referencePath('webp').replace(/^public/ig, ''),
        diff: diffPath('webp').replace(/^public/ig, ''),
      });

    })
    .catch((error) => {
      console.error(error)
      reject(error);
    });
}));

export default compareScreenShots;