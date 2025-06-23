import '~/routes/termliste/termliste.module.css';
import { Suspense } from 'react';
import { Await, useNavigate, useRouteLoaderData } from '@remix-run/react';
import type { loader as rootLoader } from '~/root';
import Table from './table';
import { Loader } from '~/lib/components/loader';
import { ErrorMessage } from '~/lib/components/error-message';

export default function Termliste() {
  const { termsData } = useRouteLoaderData<typeof rootLoader>('root');
  const navigate = useNavigate();
  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={termsData}>
        {(resolvedTermsData) =>
          resolvedTermsData.success ? (
            <Table terms={resolvedTermsData.terms} />
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
