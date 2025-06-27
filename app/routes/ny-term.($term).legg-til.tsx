import { redirect } from 'react-router';

import type { Term } from '~/types/term';
import type { Route } from './+types/ny-term.($term).legg-til';

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const termsUrl = 'https://api.fagord.no/termer/';
  const newTerm: Term = await fetch(termsUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
  }).then((res) => {
    if (!res.ok) {
      throw Error(res.status.toString() + ' ' + res.statusText);
    }
    return res.json();
  });
  return redirect(`/ny-term/${newTerm._id}/opprettet`);
};

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  localStorage.removeItem('terms');
  await serverAction();
}
