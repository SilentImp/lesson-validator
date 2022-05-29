import { writeFile } from 'node:fs';
import htmlWrapper from './htmlWrapper.mjs';

const createFile = (code, filePath, wrap = true) => new Promise((resolve, reject) => {
  const source = wrap ? htmlWrapper(code) : code;
  writeFile(filePath, source, (error) => {
    if (error) {
      console.error(error);
      return reject();
    }
    console.log(`File saved to ${filePath}`);
    resolve();
  });
});

export default createFile;