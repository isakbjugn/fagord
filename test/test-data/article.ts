import { Article, ArticleSummary } from '~/types/article';

export function createValidArticleSummaries(): ArticleSummary[] {
  return [
    { slug: 'vin', title: 'Vin', author: 'Isak Kyrre Lichtwarck Bjugn', actions: ['edit'] },
    { slug: 'kompilator', title: 'Hva er en kompilator?', author: 'Ada L.', actions: [] },
  ];
}

export function createValidArticle(): Article {
  return {
    slug: 'vin',
    title: 'Vin',
    content:
      '# Vin\n\nVinfaget er en av de eldste håndtverkene mennesket har utviklet.\n\n## Rødvin\nEng. *red wine*\n\nRødvin lages på blå eller røde druer.',
    author: 'Isak Kyrre Lichtwarck Bjugn',
    updated_by: null,
    created_at: '2026-06-11T11:10:12.077262Z',
    updated_at: '2026-06-11T11:10:12.077262Z',
    actions: ['edit'],
  };
}

/** Som en gyldig artikkel, men uten «edit» – dvs. innlogget bruker mangler skrivetilgang. */
export function createArticleWithoutEditAccess(): Article {
  return { ...createValidArticle(), actions: [] };
}
