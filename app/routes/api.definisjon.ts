import type { Route } from './+types/api.definisjon';
import type { DictionaryDefinition } from '~/types/definition';

export async function action({ request }: Route.ActionArgs): Promise<DictionaryDefinition | null> {
  const formData = await request.formData();
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const definitionApiUrl = `${FAGORD_RUST_API_URL}/definitions`;
  const { term } = Object.fromEntries(formData) as { term: string };
  const termWithDashes = term.replace(/\s+/g, '-');

  const res = await fetch(`${definitionApiUrl}/${termWithDashes}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    return null;
  }

  return await res.json();
}
