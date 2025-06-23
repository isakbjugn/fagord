import { data, LoaderFunction } from '@remix-run/node';
import { Subject } from '~/types/subject';

export const loader: LoaderFunction = async () => {
  const subjectsUrl = 'https://api.fagord.no/fagfelt/';

  const subjectsResponse = await fetch(subjectsUrl);
  if (!subjectsResponse.ok) {
    return data({ subjects: [] as Subject[], error: true, message: 'Last fagfelt på nytt' }, { status: 500 });
  }
  const subjects = (await subjectsResponse.json()) as Subject[];
  return data({ subjects, error: false, message: undefined }, { headers: { 'Cache-Control': 'max-age=3600' } });
};
