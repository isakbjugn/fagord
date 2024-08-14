import { Suspense } from 'react';

import { Spinner } from '../spinner/spinner';
import type { loader } from '~/root';
import { SearchBarClientOnly } from '~/src/components/search-bar/search-bar';
import { Await, useRouteLoaderData } from '@remix-run/react';

export const Search = () => {
  const { terms } = useRouteLoaderData<typeof loader>('root');

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={terms}>{(terms) => <SearchBarClientOnly terms={terms} />}</Await>
    </Suspense>
  );
};
