import '~/routes/termliste/termliste.module.css';
import { Suspense } from 'react';
import { Await, useLoaderData, useNavigate } from 'react-router';
import Table from './table';
import { Loader } from '~/lib/components/loader';
import { ErrorMessage } from '~/lib/components/error-message';
import { Term } from '~/types/term';
import { Route } from './+types/route';

export const loader = () => {
  const termsUrl = 'https://api.fagord.no/termer/';
  const terms = fetch(termsUrl).then(async (res) => {
    if (!res.ok) {
      throw new Response('Klarte ikke å hente termer', { status: 500 });
    }
    return (await res.json()) as Term[];
  });

  return {
    terms,
  };
};

export const clientLoader = ({ serverLoader }: Route.ClientLoaderArgs) => {
  const cachedTerms = localStorage.getItem('terms');
  if (cachedTerms) {
    return {
      terms: JSON.parse(cachedTerms) as Term[],
    };
  }

  return (serverLoader() as Promise<{ terms: Promise<Term[]> }>).then((data) => {
    data.terms.then((terms) => {
      localStorage.setItem('terms', JSON.stringify(terms));
    });
    return data;
  });
};

clientLoader.hydrate = true;

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
