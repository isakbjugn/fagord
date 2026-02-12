import { useLoaderData, useNavigate } from 'react-router';
import Table from '~/lib/termliste/table';
import { ErrorMessage } from '~/lib/components/error-message';
import { Term } from '~/types/term';
import { Route } from './+types/termliste';
import { Subject } from '~/types/subject';

export async function loader({ request }: Route.LoaderArgs) {
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const url = new URL(request.url);
  const q = url.searchParams.get('q');

  const termsResponse = await fetch(
    `${FAGORD_RUST_API_URL}/terms${q ? `?q=${encodeURIComponent(q)}` : ''}`,
  );
  if (!termsResponse.ok) {
    throw new Response('Klarte ikke å hente termer', { status: 500 });
  }
  const terms: Term[] = await termsResponse.json();

  const subjectsResponse = await fetch(`${FAGORD_RUST_API_URL}/fields`);
  if (!subjectsResponse.ok) {
    throw new Response('Klarte ikke å hente fagfelt', { status: 500 });
  }
  const subjects: Subject[] = await subjectsResponse.json();

  return { terms, subjects };
}

export function headers(_: Route.HeadersArgs) {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  };
}

export default function Termliste() {
  const { terms, subjects } = useLoaderData<typeof loader>();
  return <Table terms={terms} subjects={subjects} />;
}

export function ErrorBoundary() {
  const navigate = useNavigate();
  return (
    <ErrorMessage>
      <p>Klarte ikke å hente termliste!</p>
      <button className="btn btn-outline-dark" onClick={() => navigate('/termliste')}>
        Last inn siden på nytt
      </button>
    </ErrorMessage>
  );
}
