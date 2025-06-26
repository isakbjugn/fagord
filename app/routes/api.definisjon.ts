import type { ClientActionFunctionArgs } from '@remix-run/react';

export async function clientAction({ request }: ClientActionFunctionArgs): Promise<string | null> {
  const formData = await request.formData();
  const definitionApiUrl = 'https://rust-api.fagord.no';
  const { term } = Object.fromEntries(formData) as { term: string };

  const res = await fetch(`${definitionApiUrl}/${term}`);

  if (!res.ok) {
    return null;
  }

  return await res.text();
}
