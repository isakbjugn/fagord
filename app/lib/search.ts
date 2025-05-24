import type { Term } from '~/types/term';

export function filterTerms(terms: Term[], q: string | null) {
  if (!q) return [];
  const lowerCaseQ = q.toLowerCase();
  return terms
    .filter(
      (term: Term) =>
        term.en.toLowerCase().includes(lowerCaseQ) ||
        term.nb.toLowerCase().includes(lowerCaseQ) ||
        term.nn.toLowerCase().includes(lowerCaseQ),
    )
    .slice(0, 5);
}
