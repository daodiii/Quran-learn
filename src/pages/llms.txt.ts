/**
 * /llms.txt: a plain-text map of the site for AI assistants and answer engines (llmstxt.org format).
 * Built from the content collections, so counts and links never go stale.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { metaDescription } from '../lib/seo';

const LEVELS = ['Foundation', 'Core grammar', 'Intermediate', 'Advanced', 'Applied study'];

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.href ?? 'https://www.quranic-grammar.com/').replace(/\/$/, '');
  const lessons = (await getCollection('lessons')).sort((a, b) => a.data.level - b.data.level || a.data.order - b.data.order);
  const surahs = (await getCollection('surahs')).sort((a, b) => a.id.localeCompare(b.id));
  const guides = await getCollection('resources');

  const out: string[] = [];
  out.push('# Quranic Grammar');
  out.push('');
  out.push(`> A free, structured course in Quranic Arabic grammar. ${lessons.length} short lessons in ${LEVELS.length} levels, from the alphabet to reading whole passages, ${surahs.length} surahs explained word by word, and ${guides.length} reference guides. No sign-up and no ads. Word data is from the Quranic Arabic Corpus; the English wording is the site's own, not a translation.`);
  out.push('');
  out.push('## Start here');
  out.push(`- [Learn](${base}/learn/): every lesson in the order it is taught`);
  out.push(`- [Surahs](${base}/surahs/): ${surahs.length} surahs, each verse explained word by word`);
  out.push(`- [Resources](${base}/resources/): reference guides and the word and verb finder`);
  out.push(`- [About](${base}/about/): why the site exists, sources and credits`);
  out.push('');
  LEVELS.forEach((name, i) => {
    const mine = lessons.filter((l) => l.data.level === i + 1);
    if (!mine.length) return;
    out.push(`## Level ${i + 1}: ${name}`);
    for (const l of mine) out.push(`- [${l.data.title}](${base}/learn/${l.id}/)${l.data.description ? `: ${metaDescription(l.data.description, 110)}` : ''}`);
    out.push('');
  });
  out.push('## Surahs');
  for (const s of surahs) out.push(`- [${s.data.name}](${base}/surahs/${s.id}/)`);
  out.push('');
  out.push('## Reference guides');
  for (const g of guides) out.push(`- [${g.data.title}](${base}/resources/${g.id}/)${g.data.description ? `: ${metaDescription(g.data.description, 110)}` : ''}`);
  out.push('');
  out.push('## Optional');
  out.push(`- [Privacy policy](${base}/privacy/)`);
  out.push(`- [Terms](${base}/terms/)`);
  out.push('');

  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
