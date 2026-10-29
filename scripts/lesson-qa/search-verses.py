"""Find verses whose bare letters contain a phrase. usage: search.py <corpus> <phrase> [max]"""
import re, sys, unicodedata
sys.path.insert(0, __file__.rsplit('\\', 1)[0])
BW = {"'": 'ء', '>': 'أ', '<': 'إ', '&': 'ؤ', '}': 'ئ', '|': 'آ', 'A': 'ا', 'b': 'ب', 'p': 'ة', 't': 'ت', 'v': 'ث', 'j': 'ج', 'H': 'ح', 'x': 'خ',
      'd': 'د', '*': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س', '$': 'ش', 'S': 'ص', 'D': 'ض', 'T': 'ط', 'Z': 'ظ', 'E': 'ع', 'g': 'غ', 'f': 'ف', 'q': 'ق',
      'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن', 'h': 'ه', 'w': 'و', 'y': 'ي', 'Y': 'ى', '{': 'ٱ', '`': 'ٰ', 'F': 'ً', 'N': 'ٌ', 'K': 'ٍ',
      'a': 'َ', 'u': 'ُ', 'i': 'ِ', '~': 'ّ', 'o': 'ْ', '_': 'ـ', '^': 'ٓ', '#': 'ٔ', ':': 'ۜ', '@': '۟', '"': '۠', '[': 'ۢ', ';': 'ۣ', ',': 'ۥ', '.': 'ۦ', '!': 'ۨ', '-': '۪', '+': '۫', '%': '۬', ']': 'ۭ'}
def bare(s):
    s = re.sub(r'[ً-ٰٟۖ-ۭـ]', '', s)
    return s.replace('ٱ', 'ا').replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا').replace('ى', 'ي')
path, phrase = sys.argv[1], bare(sys.argv[2])
mx = int(sys.argv[3]) if len(sys.argv) > 3 else 30
words = {}
for line in open(path, encoding='utf8'):
    m = re.match(r'^\((\d+):(\d+):(\d+):(\d+)\)\t([^\t]*)\t', line)
    if not m: continue
    v = (int(m[1]), int(m[2]))
    words.setdefault(v, {}).setdefault(int(m[3]), []).append(''.join(BW.get(c, c) for c in m[5]))
hits = 0
for v in sorted(words):
    text = ' '.join(''.join(words[v][w]) for w in sorted(words[v]))
    if phrase in bare(text):
        hits += 1
        if hits <= mx: print(f'{v[0]}:{v[1]}', text)
print('hits:', hits)
