import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const required = [
  'class="nav-toggle"',
  "classList.toggle('open')",
  "badgeSearch?.addEventListener('input',applyFilters)",
  "categoryFilter?.addEventListener('change',applyFilters)",
  "localStorage.setItem('skwBadgeCount'",
  'plannerGrid input',
  'skw-${id}',
  'Use a public Credly, IBM Training or GitHub evidence URL'
];

const missing = required.filter((item) => !html.includes(item));
for (const item of required) console.log(`${missing.includes(item) ? 'FAIL' : 'PASS'} ${item}`);
if (missing.length) throw new Error(`Smoke test failed. Missing: ${missing.join(', ')}`);
console.log(`Smoke test passed: ${required.length} checks.`);
