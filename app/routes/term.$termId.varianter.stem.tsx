import type { SubmitVariant } from '~/types/term';
import type { Route } from './+types/term.$termId.varianter.stem';

export async function action({ request, params }: Route.ActionArgs) {
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

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  localStorage.removeItem('terms');
  return serverAction();
}
