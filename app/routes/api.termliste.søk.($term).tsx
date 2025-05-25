import type { ClientActionFunctionArgs } from '@remix-run/react';

import type { Term } from '~/types/term';

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const { q } = Object.fromEntries(formData) as { q: string };
  const cachedTerms = localStorage.getItem('terms');

  if (q && cachedTerms) {
    const lowerCaseTerm = q.toLowerCase();
    const terms = JSON.parse(cachedTerms) as Term[];
    return {
      searchResult: terms
        .filter(
          (term: Term) =>
            term.en.toLowerCase().includes(lowerCaseTerm) ||
            term.nb.toLowerCase().includes(lowerCaseTerm) ||
            term.nn.toLowerCase().includes(lowerCaseTerm),
        )
        .slice(0, 5),
    };
  }

  return {
    searchResult: [],
  };
}
