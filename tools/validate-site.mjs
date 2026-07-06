import { readFileSync, existsSync } from 'node:fs';

const htmlPath = 'index.html';
const errors = [];
if (!existsSync(htmlPath)) errors.push('Missing index.html');
const html = existsSync(htmlPath) ? readFileSync(htmlPath, 'utf8') : '';

const required = [
  ['<meta charset="utf-8"', 'UTF-8 charset meta'],
  ['<meta name="viewport"', 'responsive viewport meta'],
  ['Skunkworks Academy Badge Hub', 'page title/brand'],
  ['https://www.ibm.com/training/badge/node-red-basics-to-bots', 'priority IBM Node-RED badge link'],
  ['id="badgeSearch"', 'badge search input'],
  ['id="categoryFilter"', 'category filter'],
  ['id="badgeCount"', 'progress range tracker'],
  ['id="plannerGrid"', '12-week planner container'],
  ['id="evidenceForm"', 'evidence form'],
  ['aria-live="polite"', 'accessible evidence result status'],
  ['window.SkunkworksBadgeHub', 'public smoke-test hook'],
  ['rel="noopener"', 'safe external-link handling'],
  ['@media(max-width:920px)', 'responsive mobile navigation styles']
];

for (const [needle, description] of required) {
  if (!html.includes(needle)) errors.push(`Missing ${description}`);
}

const externalLinks = [...html.matchAll(/<a\s+[^>]*href="(https?:\/\/[^\"]+)"[^>]*>/g)];
for (const match of externalLinks) {
  const tag = match[0];
  if (tag.includes('target="_blank"') && !tag.includes('rel="noopener"')) {
    errors.push(`External target=_blank link missing rel=noopener: ${match[1]}`);
  }
}

const duplicateManagedShell = (html.match(/Skunkworks Academy global shell: managed/g) || []).length;
if (duplicateManagedShell > 1) errors.push('Duplicate managed shell block detected');

if (errors.length) {
  console.error('Badge Hub validation failed.');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Badge Hub validation passed with ${required.length} required checks and ${externalLinks.length} external link checks.`);
