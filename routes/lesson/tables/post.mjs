import {runCLI} from '@jest/core';
import path from 'node:path';

import fs from 'node:fs';
import { unlinkSync } from 'node:fs';
import { nanoid } from 'nanoid';

// import validator from '../../utils/validator.mjs';
// import compareScreenShots from '../../utils/compareScreenShots.mjs';
// import screenShotCode from '../../utils/screenShotCode.mjs';
import codeToFile from '../../../utils/codeToFile.mjs';


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

  const envFilePath = path.resolve(process.cwd(), tmpDir, `${hash}-env.json`);
  await codeToFile(`{"htmlFilePath": "${htmlFilePath}"}`, envFilePath, false);

  console.log(import.meta.url);
  const testsPath = path.resolve(import.meta.url.replace('file:', ''), '../tests');
  console.log(testsPath);

  if (process.env.x === undefined) {
    process.env.x = [ htmlFilePath ];
  } else {
    process.env.x = [ ...process.env.x, htmlFilePath ];
  }

  const projects = [testsPath];
  const options = {
    automock: false,
    coveragePathIgnorePatterns: ['/node_modules/'],
    detectOpenHandles: true,
    // modulePathIgnorePatterns: ['/test/fixtures/', '<rootDir>/build/'],
    reporters: [
     'default',
    ],
    // setupFiles: ['./build-system/babel-plugins/testSetupFile.js'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules/'],
    testRegex: `${testsPath}/tests.mjs$`,
    transformIgnorePatterns: ['/node_modules/'],
    // testEnvironmentOptions: JSON.stringify({
    //   htmlFilePath
    // }),
    // env: envFilePath,
  };

  const results = await runCLI(
    options,
    projects
  );

  const  {
    results: {
      numFailedTests,
      success,
      testResults, 
    }
  } = results;

  

  const response = {
    success,
    numFailedTests,
    testResults: testResults.map(({
      numFailingTests,
      numPassingTests,
      numPendingTests,
      skipped,
      testResults,
    }) => ({
      numFailingTests,
      numPassingTests,
      numPendingTests,
      skipped,
      testResults: testResults.map(({
        fullName,
        status,
        title,
        ancestorTitles,
        failureDetails,
      }) => ({
        fullName,
        status,
        title,
        ancestorTitles,
        failureDetails,
      }))
    }))
  };

  reply.send(response);
};