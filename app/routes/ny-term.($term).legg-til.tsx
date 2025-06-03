import type { ActionFunction, ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import type { ClientActionFunctionArgs } from 'react-router';

import type { Term } from '~/types/term';

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
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

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  localStorage.removeItem('terms');
  await serverAction();
}
