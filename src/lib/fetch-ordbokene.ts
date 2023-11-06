import { OrdbokeneResponse } from '../types/ordbokene';

const ordbokeneApiUrl = 'https://ord.uib.no/api/';

const DictionaryKey = {
  nb: 'bm',
  nn: 'nn',
};

export const fetchSuggestions = async (term: string, dialect: 'nb' | 'nn'): Promise<OrdbokeneResponse> => {
  const queryString = `q=${term}&dict=${DictionaryKey[dialect]}&include=eis&dform=int`;
  const res = await fetch(`${ordbokeneApiUrl}suggest?${queryString}`);

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};
