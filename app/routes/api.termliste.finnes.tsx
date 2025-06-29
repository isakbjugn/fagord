import type { Term } from '~/types/term';
import type { Route } from './+types/api.termliste.finnes';

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const { term } = Object.fromEntries(formData) as { term: string };
  const cachedTerms = localStorage.getItem('terms');
  if (term && cachedTerms) {
    const terms = JSON.parse(cachedTerms) as Term[];
    const exists = terms.find((cachedTerm) => cachedTerm.en === term) !== undefined;
    const validationText = exists ? 'Termen finnes allerede i termlista.' : undefined;

    return {
      exists,
      validationText,
    };
  }

  return {
    exists: false,
  };
}
