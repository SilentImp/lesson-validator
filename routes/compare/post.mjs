import fs from 'node:fs';
import path from 'node:path';
import { unlinkSync } from 'node:fs';
import { nanoid } from 'nanoid';

import validator from '../../utils/validator.mjs';
import compareScreenShots from '../../utils/compareScreenShots.mjs';
import screenShotCode from '../../utils/screenShotCode.mjs';
import codeToFile from '../../utils/codeToFile.mjs';

export default async (request, reply) => {

  const hash = nanoid();
  const tmpDir = './tmp/';
  const {
    snippet1,
    snippet2,
  } = request.body;

  fs.mkdirSync(`public/${hash}`, parseInt('0755',8));

  const customerCode = snippet1.value ?? snippet1;
  const customerPath = (type) => `public/${hash}/customer.${type}`;
  const referenceCode = snippet2.value ?? snippet2;
  const referencePath = (type) => `public/${hash}/reference.${type}`;
  const diffPath = (type) => `public/${hash}/diff.${type}`;

  const htmlFilePath = path.resolve(process.cwd(), tmpDir, `${hash}.html`);
  await codeToFile(customerCode, htmlFilePath);

  const validatorResponse = await validator(htmlFilePath);
  
  unlinkSync(htmlFilePath);

  await screenShotCode({
    customerCode,
    customerPath,
    referenceCode,
    referencePath,
  });

  const visualComparison = await compareScreenShots({
    customerPath, 
    referencePath, 
    diffPath,
  });

  reply.send({ 
    visual: visualComparison,
    validator: validatorResponse,
  });
};