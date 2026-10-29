"""Check every verse example in a stepped lesson against the Corpus (Tanzil) text, diacritics included.
usage: check_lesson.py <corpus> <lesson.mdx>
Sentence/Parse blocks: the words in order must appear in the cited verse. Exercise questions: every
Arabic run followed by '(<Surah> s:v' must appear in that verse.
"""
import re, sys, unicodedata
BW = {"'": 'ء', '>': 'أ', '<': 'إ', '&': 'ؤ', '}': 'ئ', '|': 'آ', 'A': 'ا', 'b': 'ب', 'p': 'ة', 't': 'ت', 'v': 'ث', 'j': 'ج', 'H': 'ح', 'x': 'خ',
      'd': 'د', '*': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س', '$': 'ش', 'S': 'ص', 'D': 'ض', 'T': 'ط', 'Z': 'ظ', 'E': 'ع', 'g': 'غ', 'f': 'ف', 'q': 'ق',
      'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن', 'h': 'ه', 'w': 'و', 'y': 'ي', 'Y': 'ى', '{': 'ٱ', '`': 'ٰ', 'F': 'ً', 'N': 'ٌ', 'K': 'ٍ',
      'a': 'َ', 'u': 'ُ', 'i': 'ِ', '~': 'ّ', 'o': 'ْ', '_': 'ـ', '^': 'ٓ', '#': 'ٔ', ':': 'ۜ', '@': '۟', '"': '۠', '[': 'ۢ', ';': 'ۣ', ',': 'ۥ', '.': 'ۦ', '!': 'ۨ', '-': '۪', '+': '۫', '%': '۬', ']': 'ۭ'}
N = lambda s: unicodedata.normalize('NFC', s)
corpus, lesson = sys.argv[1], sys.argv[2]
words = {}
for line in open(corpus, encoding='utf8'):
    m = re.match(r'^\((\d+):(\d+):(\d+):(\d+)\)\t([^\t]*)\t', line)
    if m:
        words.setdefault(f'{m[1]}:{m[2]}', {}).setdefault(int(m[3]), []).append(''.join(BW.get(c, c) for c in m[5]))
verse = {v: N(' '.join(''.join(ws[w]) for w in sorted(ws))) for v, ws in words.items()}

src = open(lesson, encoding='utf8').read()
ok = bad = skipped = 0
for block in re.findall(r'<(?:Sentence|Parse)\b.*?/>', src, flags=re.S):
    ref = re.search(r'reference="([^"]*)"', block)
    ref = ref.group(1) if ref else ''
    rm = re.search(r'(\d+):(\d+)', ref)
    body = block
    if block.startswith('<Parse'):
        body = re.search(r'words=\{\[(.*?)\]\}', block, flags=re.S).group(1)
    ars = [N(a) for a in re.findall(r"ar: '([^']*)'", body)]
    if not rm:
        skipped += 1
        print(f'SKIP (not a verse): {ref} :: {" ".join(ars)}')
        continue
    v = f'{rm[1]}:{rm[2]}'
    phrase = ' '.join(ars)
    if phrase in verse[v]:
        ok += 1
    else:
        bad += 1
        print(f'MISMATCH {ref}\n  lesson: {phrase}\n  verse:  {verse[v]}')
for q in re.findall(r'<Exercise[^>]*q="([^"]*)"', src):
    for m in re.finditer(r'([؀-ۿݐ-ݿࢠ-ࣿ ]+?)\s*\((?:[A-Za-zʿʾ\'-]+ )+(\d+):(\d+)', q):
        phrase, v = N(m.group(1).strip()), f'{m.group(2)}:{m.group(3)}'
        if phrase in verse[v]:
            ok += 1
        else:
            bad += 1
            print(f'MISMATCH exercise {v}\n  lesson: {phrase}\n  verse:  {verse[v]}')
print(f'match={ok} mismatch={bad} not-a-verse={skipped}')
