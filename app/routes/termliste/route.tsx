import '~/routes/termliste/termliste.module.css';
import { Suspense } from 'react';
import { Await, data, useLoaderData, useNavigate } from '@remix-run/react';
import Table from './table';
import { Loader } from '~/lib/components/loader';
import { ErrorMessage } from '~/lib/components/error-message';
import { LoaderFunction } from '@remix-run/node';
import { Term } from '~/types/term';

export const loader: LoaderFunction = () => {
  const termsUrl = 'https://api.fagord.no/termer/';
  const terms = fetch(termsUrl).then(async (res) => {
    if (!res.ok) {
      throw new Response('Klarte ikke å hente termer', { status: 500 });
    }
    return (await res.json()) as Term[];
  });

  return data({
    terms,
  });
};

export default function Termliste() {
  const { terms } = useLoaderData<typeof loader>();
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
