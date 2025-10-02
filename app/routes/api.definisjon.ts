import type { Route } from './+types/api.definisjon';

export async function clientAction({ request }: Route.ClientActionArgs): Promise<string | null> {
  const formData = await request.formData();
  const definitionApiUrl = 'https://rust-api.fagord.no/definitions';
  const { term } = Object.fromEntries(formData) as { term: string };
  const termWithDashes = term.replace(/\s+/g, '-');

  const res = await fetch(`${definitionApiUrl}/${termWithDashes}`);

  if (!res.ok) {
    return null;
  }

  return await res.text();
}
