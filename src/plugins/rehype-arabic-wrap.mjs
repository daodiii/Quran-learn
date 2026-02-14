import { visit } from 'unist-util-visit';

// Matches Arabic characters including diacritics, spaces between Arabic words,
// and common Arabic Unicode blocks
const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+(?:\s+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)*/g;

export default function rehypeArabicWrap() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return;

      const text = node.value;
      if (!ARABIC_RE.test(text)) return;

      // Reset regex lastIndex after test()
      ARABIC_RE.lastIndex = 0;

      const nodes = [];
      let lastIndex = 0;
      let match;

      while ((match = ARABIC_RE.exec(text)) !== null) {
        // Add preceding non-Arabic text
        if (match.index > lastIndex) {
          nodes.push({ type: 'text', value: text.slice(lastIndex, match.index) });
        }

        // Wrap Arabic segment in <span class="ar">
        nodes.push({
          type: 'element',
          tagName: 'span',
          properties: { className: ['ar'] },
          children: [{ type: 'text', value: match[0] }],
        });

        lastIndex = match.index + match[0].length;
      }

      // Add trailing non-Arabic text
      if (lastIndex < text.length) {
        nodes.push({ type: 'text', value: text.slice(lastIndex) });
      }

      // Replace the original text node with our new nodes
      if (nodes.length > 0) {
        parent.children.splice(index, 1, ...nodes);
        return index + nodes.length;
      }
    });
  };
}
