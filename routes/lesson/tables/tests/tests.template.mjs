// const { JSDOM } = require('jsdom');
// import JSDOMEnvironment from 'jest-environment-jsdom';
// const {TestEnvironment} = require('jest-environment-jsdom');

console.log(process.env);

test('adds 1 + 2 to equal 3', () => {
  expect((1 + 2)).toBe(3);
});


test('adds 1 + 2 to equal 4', () => {
  expect((1 + 2)).toBe(4);
});
