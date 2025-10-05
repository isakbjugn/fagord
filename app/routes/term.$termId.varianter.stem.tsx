import type { Route } from './+types/term.$termId.varianter.stem';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { variantId } = Object.fromEntries(formData) as unknown as { variantId: number };
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const termsApiUrl = `${FAGORD_RUST_API_URL}/variants/${variantId}`;

  const res = await fetch(termsApiUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
}
