import type { Term } from '~/types/term';
import Fuse from 'fuse.js/basic';
import type { Route } from './+types/api.termliste.søk.($term)';

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const { q } = Object.fromEntries(formData) as { q: string };
  const cachedTerms = localStorage.getItem('terms');

  if (q && cachedTerms) {
    const terms = JSON.parse(cachedTerms) as Term[];

    const fuse = new Fuse(terms, {
      keys: ['en', 'nb', 'nn'],
      threshold: 0.3, // Adjust the threshold for fuzzy matching,
      includeScore: false,
    });

    return {
      searchResult: fuse
        .search(q)
        .map((result) => result.item)
        .slice(0, 5),
    };
  }

  return {
    searchResult: [],
  };
}
