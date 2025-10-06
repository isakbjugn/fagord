import '~/routes/termliste/termliste.module.css';
import { Suspense } from 'react';
import { Await, useLoaderData, useNavigate } from 'react-router';
import Table from './table';
import { Loader } from '~/lib/components/loader';
import { ErrorMessage } from '~/lib/components/error-message';
import { Term } from '~/types/term';
import type { Route } from './+types/route';

export async function loader() {
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const termsApiUrl = `${FAGORD_RUST_API_URL}/terms`;
  const termsResponse = await fetch(termsApiUrl);

  if (!termsResponse.ok) {
    throw new Response('Klarte ikke å hente termer', { status: 500 });
  }
  return (await termsResponse.json()) as Term[];
}

export function headers(_: Route.HeadersArgs) {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  };
}

export default function Termliste() {
  const terms = useLoaderData<typeof loader>();
  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={terms}>{(resolvedTerms) => <Table terms={resolvedTerms} />}</Await>
    </Suspense>
  );
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
