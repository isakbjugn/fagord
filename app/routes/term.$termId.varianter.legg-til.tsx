import { redirect } from 'react-router';

import type { CreateVariant } from '~/types/term';
import type { Route } from './+types/term.$termId.varianter.legg-til';

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const { termId } = params;
  const submitVariant = Object.fromEntries(formData) as unknown as CreateVariant;
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const termsApiUrl = `${FAGORD_RUST_API_URL}/terms/${termId}/variants`;

  const res = await fetch(termsApiUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(submitVariant),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return redirect(`/term/${termId}`);
}
