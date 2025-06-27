import { data } from 'react-router';
import { Subject } from '~/types/subject';

export async function loader() {
  const subjectsUrl = 'https://api.fagord.no/fagfelt/';

  const subjectsResponse = await fetch(subjectsUrl);
  if (!subjectsResponse.ok) {
    return data({ subjects: [] as Subject[], error: true, message: 'Last fagfelt på nytt' }, { status: 500 });
  }
  const subjects = (await subjectsResponse.json()) as Subject[];
  return data({ subjects, error: false, message: undefined }, { headers: { 'Cache-Control': 'max-age=3600' } });
}
