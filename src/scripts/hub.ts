// @ts-nocheck
/* Resources hub: the search box hides the cards that do not match, and any group left empty. "/" jumps to the box. */
const q = document.getElementById('hub-q');
const none = document.getElementById('hub-none');
if (q) {
  q.addEventListener('input', () => {
    const v = q.value.trim().toLowerCase();
    let total = 0;
    document.querySelectorAll('.grp').forEach((g) => {
      let n = 0;
      g.querySelectorAll('.card').forEach((c) => {
        const hit = !v || `${c.textContent} ${c.dataset.k || ''}`.toLowerCase().includes(v);
        c.hidden = !hit;
        if (hit) n++;
      });
      g.hidden = n === 0;
      total += n;
    });
    none.hidden = total !== 0;
  });
  addEventListener('keydown', (e) => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); }
  });
}
