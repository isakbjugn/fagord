import type { ClientActionFunctionArgs } from '@remix-run/react';

import type { Term } from '~/types/term';

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const { term } = Object.fromEntries(formData) as { term: string };
  const cachedTerms = localStorage.getItem('terms');
  if (term && cachedTerms) {
    const terms = JSON.parse(cachedTerms) as Term[];
    return terms.find((cachedTerm) => cachedTerm.en === term) !== undefined;
  }
  return false;
}
