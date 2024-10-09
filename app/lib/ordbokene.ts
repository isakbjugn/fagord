import type { Lookup, OrdbokeneResponse } from '~/types/ordbokene';

export const DictionaryName = {
  nb: 'Bokmålsordboka',
  nn: 'Nynorskordboka',
};

export const getLookupFromOrdbokene = (lookup: OrdbokeneResponse, searchTerm: string): Lookup => {
  const exactMatches: string[] = lookup.a.exact ? lookup.a.exact.map((term) => term[0]) : [];
  const exact = exactMatches.includes(searchTerm);
  const inflect = lookup.a.inflect ? lookup.a.inflect.map((term) => term[0]) : [];
  const similar = lookup.a.similar ? lookup.a.similar.map((term) => term[0]) : [];

  return { exact, inflect, similar };
};

export const isTermValid = (lookup: Lookup): boolean => (lookup ? lookup?.exact || lookup?.inflect.length > 0 : false);

export const getValidationText = (lookup: Lookup, dictionaryName: string): string => {
  if (lookup.exact) {
    return `Finnes i ${dictionaryName}`;
  } else if (lookup.inflect) {
    return `Bøyning av ${lookup.inflect[0]} i ${dictionaryName}`;
  } else {
    return '';
  }
};

export const getSuggestion = (lookup: Lookup): string => {
  if (lookup.similar.length > 0 && !lookup.exact && lookup.inflect.length == 0) {
    return lookup.similar[0];
  } else {
    return '';
  }
};
