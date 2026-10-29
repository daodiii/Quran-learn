"""Print the verse ledger table from the stepped lessons: which verses each lesson uses as a main example
(a Sentence or Parse with a verse reference) and which only in Exercise questions. Flags verses used as a
main example in more than two lessons.
usage: python -I -X utf8 scripts/lesson-qa/ledger.py src/content/lessons [L2.01 L2.03 ...]
With lesson ids, only those lessons are counted (the accepted ones).
"""
import re, sys, pathlib
from collections import defaultdict

main, ex = defaultdict(set), defaultdict(set)
for p in sorted(pathlib.Path(sys.argv[1]).rglob('*.mdx')):
    src = p.read_text(encoding='utf8')
    if not re.search(r'^template:\s*steps', src, flags=re.M):
        continue
    lid = 'L%s.%s' % (p.parent.name.split('-')[-1], p.name[:2])
    if sys.argv[2:] and lid not in sys.argv[2:]:
        continue
    for block in re.findall(r'<(?:Sentence|Parse)\b.*?/>', src, flags=re.S):
        m = re.search(r'reference="[^"]*?(\d+):(\d+)', block)
        if m:
            main[f'{m[1]}:{m[2]}'].add(lid)
    for q in re.findall(r'<Exercise\b[^>]*\bq="([^"]*)"', src):
        for m in re.finditer(r'\((?:[^()]*?\s)?(\d+):(\d+)', q):
            ex[f'{m[1]}:{m[2]}'].add(lid)

# Whole-surah lessons that may be a third main use (documented in verse-ledger.md): verse -> lesson.
EXCEPTIONS = {'1:1': 'L5.02', '1:5': 'L5.02', '1:6': 'L5.02'}

key = lambda v: tuple(int(x) for x in v.split(':'))
print('| Verse | Main example in | Exercise in |\n|---|---|---|')
over = []
exc = []
for v in sorted(set(main) | set(ex), key=key):
    print(f"| {v} | {', '.join(sorted(main[v]))} | {', '.join(sorted(ex[v] - main[v]))} |")
    if len(main[v]) > 2:
        if EXCEPTIONS.get(v) and main[v] - {EXCEPTIONS[v]} and len(main[v] - {EXCEPTIONS[v]}) <= 2:
            exc.append(f"{v}: {', '.join(sorted(main[v]))} (exception for {EXCEPTIONS[v]})")
        else:
            over.append(f"{v}: {', '.join(sorted(main[v]))}")
print(f'\nverses={len(set(main) | set(ex))} main={sum(1 for v in main if main[v])} over-limit={len(over)} documented-exceptions={len(exc)}')
for e in exc:
    print('EXCEPTION', e)
for o in over:
    print('OVER', o)
