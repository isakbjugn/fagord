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

  if (q && terms) {
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
