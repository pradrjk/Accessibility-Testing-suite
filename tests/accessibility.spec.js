const { test } = require('@playwright/test');
const runAccessibilityScan = require('../utils/runAxeScan');

test('Home page accessibility check', async ({ page }) => {
  await page.goto('https://nodejs.org/en'); // change to your real URL
  await runAccessibilityScan(page, 'Home Page');
});
