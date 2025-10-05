import type { Route } from './+types/api.termliste.finnes';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { term } = Object.fromEntries(formData) as { term: string };
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const termsUrl = `${FAGORD_RUST_API_URL}/term-stats/exists/${term}`;

  const termResponse = await fetch(termsUrl);
  if (!termResponse.ok) {
    return {
      exists: undefined,
    };
  }
  const { exists } = await termResponse.json();
  const validationText = exists ? 'Termen finnes allerede i termlista.' : undefined;

  return {
    exists,
    validationText,
  };
}
