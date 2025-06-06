import { type ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';

import type { SubmitVariant } from '~/types/term';

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { termId } = params;
  const submitVariant = Object.fromEntries(formData) as unknown as SubmitVariant;
  const termsApiUrl = `https://www.api.fagord.no/termer/${termId}/varianter`;

  const res = await fetch(termsApiUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(submitVariant),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  localStorage.removeItem('terms');
  return serverAction();
}
