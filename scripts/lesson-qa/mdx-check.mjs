// Compile lesson MDX files on their own, to catch syntax errors without a full build.
// A full `npm run build` is still needed before a lesson is accepted (it also runs the components).
//
//   node scripts/lesson-qa/mdx-check.mjs src/content/lessons/level-2/02-subject-predicate.mdx
import { compile } from '@mdx-js/mdx';
import { readFile } from 'node:fs/promises';

let failed = 0;
for (const file of process.argv.slice(2)) {
  try {
    await compile(await readFile(file, 'utf8'));
    console.log(`ok ${file}`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${file}\n  ${e.message}`);
  }
}
process.exit(failed ? 1 : 0);
