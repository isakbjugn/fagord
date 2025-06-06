import '~/routes/termliste/termliste.module.css';
import { Suspense } from 'react';
import { Await, useNavigate, useRouteLoaderData } from '@remix-run/react';
import type { loader as rootLoader } from '~/root';
import Table from './table';
import { data, LoaderFunction } from '@remix-run/node';
import type { Subject } from '~/types/subject';
import { Loader } from '~/lib/components/loader';
import { ErrorMessage } from '~/lib/components/error-message';

export const loader: LoaderFunction = () => {
  const subjectsUrl = 'https://api.fagord.no/fagfelt/';

  return fetch(subjectsUrl)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error('Kunne ikke hente fagfelt');
      }
      return data(
        { success: true, subjects: res.json() as Promise<Subject[]>, message: undefined },
        { headers: { 'Cache-Control': 'max-age=3600' } },
      );
    })
    .catch(() => {
      return data(
        {
          success: false,
          subjects: [] as Subject[],
          message: 'Kunne ikke laste fagfelt',
        },
        { status: 500 },
      );
    });
};

export default function Termliste() {
  const termsData = useRouteLoaderData<typeof rootLoader>('root');
  const navigate = useNavigate();
  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={termsData}>
        {(resolvedTermsData) =>
          resolvedTermsData.success ? (
            <Suspense fallback={<Loader />}>
              <Await resolve={resolvedTermsData.terms}>{(terms) => <Table terms={terms} />}</Await>
            </Suspense>
          ) : (
            <ErrorMessage>
              <p>Klarte ikke å laste termer</p>
              <button className="btn btn-outline-dark" onClick={() => navigate('/termliste')}>
                Last inn siden på nytt
              </button>
            </ErrorMessage>
          )
        }
      </Await>
    </Suspense>
  );
}
