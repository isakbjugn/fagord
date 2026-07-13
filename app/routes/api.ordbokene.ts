import { DictionaryName, getLookupFromOrdbokene, getSuggestion, getValidationText, isTermValid } from '~/lib/ordbokene';
import type { OrdbokeneResponse } from '~/types/ordbokene';
import type { Route } from './+types/api.ordbokene';

const DictionaryKey = {
  nb: 'bm',
  nn: 'nn',
};

export interface DictionaryResponse {
  isValid: boolean | undefined;
  validationText: string | undefined;
  suggestion: string | undefined;
}

export async function clientAction({ request }: Route.ClientActionArgs): Promise<DictionaryResponse> {
  const formData = await request.formData();
  const ordbokeneApiUrl = 'https://ord.uib.no/api/';
  const { term, dialect } = Object.fromEntries(formData) as { term: string; dialect: 'nb' | 'nn' };
  if (term === undefined || term === '') {
    return {
      isValid: undefined,
      validationText: undefined,
      suggestion: undefined,
    };
  }

  const queryString = `q=${term}&dict=${DictionaryKey[dialect]}&include=eis&dform=int`;
  const res = await fetch(`${ordbokeneApiUrl}suggest?${queryString}`);

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  const data = (await res.json()) as OrdbokeneResponse;
  const lookup = getLookupFromOrdbokene(data, term);
  if (lookup === undefined) {
    return {
      isValid: undefined,
      validationText: undefined,
      suggestion: undefined,
    };
  }

  return {
    isValid: isTermValid(lookup),
    validationText: getValidationText(lookup, DictionaryName[dialect]),
    suggestion: getSuggestion(lookup),
  };
}
