// Vercel clones the repo shallow, so `git log` sees one commit and every lesson gets the same
// published/modified date (src/lib/getEntryDates.ts reads git history). Fetch the full history
// before the build. If the fetch fails (no network, no remote), say so and carry on: the build
// still works, it only loses real dates.
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

try {
  if (git('rev-parse', '--is-shallow-repository') !== 'true') {
    console.log('[unshallow] full history already present');
  } else {
    git('fetch', '--unshallow', '--quiet');
    console.log('[unshallow] fetched full history:', git('rev-list', '--count', 'HEAD'), 'commits');
  }
} catch (err) {
  console.warn('[unshallow] could not read or fetch full git history; page dates may be the same for every page.');
  console.warn(String(err.stderr || err.message || err).split('\n')[0]);
}
