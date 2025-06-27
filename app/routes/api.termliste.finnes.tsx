import type { Term } from '~/types/term';
import type { Route } from './+types/api.termliste.finnes';

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const { term } = Object.fromEntries(formData) as { term: string };
  const cachedTerms = localStorage.getItem('terms');
  if (term && cachedTerms) {
    const terms = JSON.parse(cachedTerms) as Term[];
    return terms.find((cachedTerm) => cachedTerm.en === term) !== undefined;
  }
  return false;
}
