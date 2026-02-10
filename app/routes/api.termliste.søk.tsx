import type { Term } from '~/types/term';
import type { Route } from './+types/api.termliste.søk';

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);

  if (!searchParams.get('q')) return [];

  searchParams.set('limit', '5');
  const apiBase = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const url = new URL('/terms', apiBase);
  url.search = searchParams.toString();
  const response = await fetch(url);

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
