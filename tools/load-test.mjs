import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const iterations = Number(process.env.LOAD_ITERATIONS || 1000);
const durations = [];
let totalBytes = 0;

for (let i = 0; i < iterations; i++) {
  const start = performance.now();
  const html = readFileSync('index.html', 'utf8');
  const cards = (html.match(/class="tile badge-card"/g) || []).length;
  const links = (html.match(/href="https?:\/\//g) || []).length;
  if (cards < 9) throw new Error(`Expected at least 9 badge cards, found ${cards}`);
  if (links < 15) throw new Error(`Expected at least 15 links, found ${links}`);
  totalBytes += Buffer.byteLength(html);
  durations.push(performance.now() - start);
}

durations.sort((a, b) => a - b);
const pick = p => durations[Math.min(durations.length - 1, Math.floor((p / 100) * durations.length))];
const avg = durations.reduce((a, b) => a + b, 0) / durations.length;

console.log(JSON.stringify({
  test: 'static-page-load-test',
  iterations,
  totalMBRead: Number((totalBytes / 1024 / 1024).toFixed(2)),
  avgMs: Number(avg.toFixed(4)),
  p50Ms: Number(pick(50).toFixed(4)),
  p95Ms: Number(pick(95).toFixed(4)),
  p99Ms: Number(pick(99).toFixed(4))
}, null, 2));

if (pick(95) > 20) {
  console.error('Load test failed: p95 static read/render simulation exceeded 20ms.');
  process.exit(1);
}
