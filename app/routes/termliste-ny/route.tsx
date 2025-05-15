import '~/styles/termliste-ny.module.css';
import { Suspense } from 'react';
import { Await, useRouteLoaderData } from '@remix-run/react';
import type { loader as rootLoader } from '~/root';
import Table from './table';
import { data } from '@remix-run/node';
import type { Subject } from '~/types/subject';
import { Loader } from '~/lib/components/loader';

export function loader() {
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
    .catch((error) => {
      return data(
        {
          success: false,
          subjects: [],
          message: 'Kunne ikke laste fagfelt',
        },
        { status: 500 },
      );
    });
}

export default function Termliste() {
  const { terms } = useRouteLoaderData<typeof rootLoader>('root');
  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={terms}>{(terms) => <Table terms={terms} />}</Await>
    </Suspense>
  );
}
