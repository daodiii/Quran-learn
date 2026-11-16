/**
 * JSON-LD for an index page that lists other pages: a CollectionPage with an ItemList.
 * Used by /surahs/, /resources/ and /hadith/. Every item URL is absolute and matches the sitemap.
 */
const ORIGIN = 'https://www.quranic-grammar.com';

export interface CollectionItem {
  name: string;
  /** Site-relative path with a trailing slash, e.g. /surahs/001-al-fatiha/ */
  path: string;
}

export function collectionPageSchema(opts: { name: string; description: string; path: string; items: CollectionItem[] }): string {
  const url = `${ORIGIN}${opts.path}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'Quranic Grammar', url: `${ORIGIN}/` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: `${ORIGIN}${item.path}`,
      })),
    },
  };
  // Escape "</" so a title can never close the script tag.
  return JSON.stringify(data).replace(/<\//g, '<\\/');
}
