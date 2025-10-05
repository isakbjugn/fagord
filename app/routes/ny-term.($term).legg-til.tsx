import { redirect } from 'react-router';

import type { Term } from '~/types/term';
import type { Route } from './+types/ny-term.($term).legg-til';

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const createTerm = Object.fromEntries(Object.entries(Object.fromEntries(formData)).filter(([_, v]) => v !== ''));

  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const termsApiUrl = `${FAGORD_RUST_API_URL}/terms`;
  const newTerm: Term = await fetch(termsApiUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(createTerm),
  }).then((res) => {
    if (!res.ok) {
      throw Error(res.status.toString() + ' ' + res.statusText);
    }
    return res.json();
  });
  return redirect(`/ny-term/${newTerm.slug}/opprettet`);
};
