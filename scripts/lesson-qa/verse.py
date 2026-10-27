"""Print verse text (and optionally per-word Corpus tags) from the Corpus v0.4 file.
usage: python -I -X utf8 verse.py <corpus.txt> [-t] 112:1 2:2 ...
"""
import re, sys
BW = {"'": 'ء', '>': 'أ', '<': 'إ', '&': 'ؤ', '}': 'ئ', '|': 'آ', 'A': 'ا', 'b': 'ب', 'p': 'ة', 't': 'ت', 'v': 'ث', 'j': 'ج', 'H': 'ح', 'x': 'خ',
      'd': 'د', '*': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س', '$': 'ش', 'S': 'ص', 'D': 'ض', 'T': 'ط', 'Z': 'ظ', 'E': 'ع', 'g': 'غ', 'f': 'ف', 'q': 'ق',
      'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن', 'h': 'ه', 'w': 'و', 'y': 'ي', 'Y': 'ى', '{': 'ٱ', '`': 'ٰ', 'F': 'ً', 'N': 'ٌ', 'K': 'ٍ',
      'a': 'َ', 'u': 'ُ', 'i': 'ِ', '~': 'ّ', 'o': 'ْ', '_': 'ـ', '^': 'ٓ', '#': 'ٔ', ':': 'ۜ', '@': '۟', '"': '۠', '[': 'ۢ', ';': 'ۣ', ',': 'ۥ', '.': 'ۦ', '!': 'ۨ', '-': '۪', '+': '۫', '%': '۬', ']': 'ۭ'}
ar = lambda s: ''.join(BW.get(c, c) for c in s)
path, args = sys.argv[1], sys.argv[2:]
tags = '-t' in args
want = {a for a in args if a != '-t'}
words = {}
for line in open(path, encoding='utf8'):
    m = re.match(r'^\((\d+):(\d+):(\d+):(\d+)\)\t([^\t]*)\t([^\t]*)\t(.*)$', line.rstrip('\n'))
    if not m or f'{m[1]}:{m[2]}' not in want:
        continue
    k = (f'{m[1]}:{m[2]}', int(m[3]))
    words.setdefault(k, []).append((ar(m[5]), m[6], m[7]))
for v in sorted(want, key=lambda x: tuple(map(int, x.split(':')))):
    ws = sorted((w, segs) for (vv, w), segs in words.items() if vv == v)
    print(v, ' '.join(''.join(s[0] for s in segs) for _, segs in ws) or '(not found)')
    if tags:
        for w, segs in ws:
            print('   ', w, ''.join(s[0] for s in segs), ' | '.join(f'{s[1]}:{s[2]}' for s in segs))
