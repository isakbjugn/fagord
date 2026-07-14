import type { Term } from '~/types/term';
import type { Route } from './+types/api.termliste.søk';

export async function loader({ url }: Route.LoaderArgs) {
  if (!url.searchParams.get('q')) return [];

  const apiBase = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const rustApiUrl = new URL('/terms', apiBase);
  rustApiUrl.search = url.search;
  rustApiUrl.searchParams.set('limit', '5');
  const response = await fetch(rustApiUrl);

  if (!response.ok) {
    throw new Response('Klarte ikke å søke etter termer', { status: 500 });
  }

  return (await response.json()) as Term[];
}

export function headers(_: Route.HeadersArgs) {
  return {
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
  };
}

// Rydder opp gammel localStorage-cache fra tidligere implementasjon
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('terms');
  }
  return serverLoader();
}
