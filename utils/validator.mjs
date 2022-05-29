import { execFile } from 'node:child_process';

import vnu from 'vnu-jar';

const validator = (htmlFilePath, wrap = true) => new Promise((resolve) => {
  // Work with vnu.jar, for example get vnu.jar version
  execFile('java', ['-jar', `"${vnu}"`, `--html --format json ${htmlFilePath}`], { shell: true }, (error, stdout, stderr) => {

    if (error) {
      const {
        messages,
      } = JSON.parse(stderr);
      return resolve({
        isValid: false,
        error: messages.map(({
          lastLine,
          lastColumn,
          firstColumn,
          message,
          extract,
          hiliteStart,
          hiliteLength,
        }) => ({
          lastLine: (!wrap ? lastLine : lastLine - 6 ),
          lastColumn,
          firstColumn,
          message,
          extract,
          hiliteStart,
          hiliteLength,
        })),
      });
    }

    return resolve({
      isValid: true,
    });
  });
});

export default validator;