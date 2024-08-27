import type { Term } from '~/types/term';

export function filterTerms(terms: Term[], q: string | null) {
  if (!q) return [];
  return terms
    .filter(
      (term: Term) =>
        term.en.toLowerCase().includes(q) || term.nb.toLowerCase().includes(q) || term.nn.toLowerCase().includes(q),
    )
    .slice(0, 5);
}
