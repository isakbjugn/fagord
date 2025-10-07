import type { Term } from '~/types/term';
import Fuse from 'fuse.js/basic';
import type { Route } from './+types/api.termliste.søk.($term)';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { q } = Object.fromEntries(formData) as { q: string };
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const termsApiUrl = `${FAGORD_RUST_API_URL}/terms`;
  const termsResponse = await fetch(termsApiUrl);

  if (!termsResponse.ok) {
    throw new Response('Klarte ikke å hente termer', { status: 500 });
  }
  const terms = (await termsResponse.json()) as Term[];

  return searchTerms(terms, q);
}

export async function clientAction({ request, serverAction }: Route.ClientActionArgs) {
  const cached = localStorage.getItem('terms');

  if (cached && cached.includes('cachedAt')) {
    const { terms, cachedAt } = JSON.parse(cached) as { terms: Term[]; cachedAt: Date };
    const maxAge = 1000 * 60 * 5; // 5 minutter
    const isCacheValid = new Date().getTime() - new Date(cachedAt).getTime() < maxAge;

    if (isCacheValid) {
      const formData = await request.formData();
      const { q } = Object.fromEntries(formData) as { q: string };
      return searchTerms(terms, q);
    }
  }

  const { terms, searchResult } = await serverAction();

  if (terms) {
    const cachedAt = new Date();
    localStorage.setItem(
      'terms',
      JSON.stringify({
        terms,
        cachedAt,
      }),
    );
  }

  return { terms, searchResult };
}

function searchTerms(terms: Term[], q?: string) {
  if (!q) {
    return { terms, searchResult: [] };
  }

  const fuse = new Fuse(terms, {
    keys: ['en', 'nb', 'nn'],
    threshold: 0.3,
    includeScore: false,
  });

  return {
    terms,
    searchResult: fuse
      .search(q)
      .map((r) => r.item)
      .slice(0, 5),
  };
}
