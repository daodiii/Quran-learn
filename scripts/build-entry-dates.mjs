// Writes src/data/entry-dates.json: first and last git commit date for every lesson file.
// Vercel clones shallow and `git fetch --unshallow` does not work there, so getEntryDates
// (src/lib/getEntryDates.ts) falls back to this committed file when the clone is shallow.
// It runs at the start of every build. With full history (a local build) it refreshes the file:
// commit the change when it shows up in `git status`. With a shallow clone it leaves the file alone.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const OUT = 'src/data/entry-dates.json';

if (git('rev-parse', '--is-shallow-repository') === 'true') {
  console.log('[entry-dates] shallow clone, keeping committed', OUT);
  process.exit(0);
}

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : e.name.endsWith('.mdx') ? [join(dir, e.name).replaceAll(String.fromCharCode(92), '/')] : [],
  );
}

const result = {};
for (const f of files('src/content/lessons').sort()) {
  const first = git('log', '--diff-filter=A', '--follow', '--format=%aI', '--', f).split('\n').filter(Boolean).pop();
  const last = git('log', '-1', '--format=%aI', '--', f);
  if (first && last) result[f] = { published: first, modified: last };
}

const next = JSON.stringify(result, null, 2) + '\n';
const prev = existsSync(OUT) ? readFileSync(OUT, 'utf8').split(String.fromCharCode(13)).join('') : '';
if (next !== prev) {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, next);
  console.log(`[entry-dates] wrote ${Object.keys(result).length} entries to ${OUT}`);
} else {
  console.log('[entry-dates] up to date');
}
