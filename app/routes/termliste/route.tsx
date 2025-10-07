import '~/routes/termliste/termliste.module.css';
import { Suspense } from 'react';
import { Await, data, useLoaderData, useNavigate } from 'react-router';
import Table from './table';
import { Loader } from '~/lib/components/loader';
import { ErrorMessage } from '~/lib/components/error-message';
import { Term } from '~/types/term';
import type { Route } from './+types/route';
import { Subject } from '~/types/subject';

export async function loader() {
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const termsResponse = fetch(`${FAGORD_RUST_API_URL}/terms`).then((res) => {
    if (!res.ok) {
      throw new Response('Klarte ikke å hente termer', { status: 500 });
    }
    return res.json() as Promise<Term[]>;
  });
  const fieldsResponse = fetch(`${FAGORD_RUST_API_URL}/fields`).then((res) => {
    if (!res.ok) {
      throw data('Klarte ikke å hente fagfelt', { status: 500 });
    }
    return res.json() as Promise<Subject[]>;
  });

  return {
    terms: termsResponse,
    fields: fieldsResponse,
  };
}

export function headers(_: Route.HeadersArgs) {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  };
}

export default function Termliste() {
  const { terms, fields } = useLoaderData<typeof loader>();
  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={terms}>{(resolvedTerms) => <Table terms={resolvedTerms} fields={fields} />}</Await>
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
