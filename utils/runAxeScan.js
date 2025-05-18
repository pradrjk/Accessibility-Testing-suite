const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const axeSource = require('axe-core').source;

async function runAccessibilityScan(page, context = 'Accessibility Test') {
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => await window.axe.run());

  const violations = results.violations;
  console.log(`\n[${context}] Found ${violations.length} accessibility issues.`);

  const outputDir = path.resolve(__dirname, '../axe-reports');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // Save raw JSON
  const jsonPath = path.join(outputDir, `axe-report-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(violations, null, 2));

  // Render HTML
  const templatePath = path.join(outputDir, 'templates', 'report.ejs');
  const html = ejs.render(fs.readFileSync(templatePath, 'utf-8'), {
    violations,
    context
  });

  const htmlPath = path.join(outputDir, `axe-report-${timestamp}.html`);
  fs.writeFileSync(htmlPath, html);

  console.log(`✅ JSON report: ${jsonPath}`);
  console.log(`✅ HTML report: ${htmlPath}\n`);
}
module.exports = runAccessibilityScan;
