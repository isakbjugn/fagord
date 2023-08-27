import { useQuery } from '@tanstack/react-query';
import { fetchSuggestions } from '../../lib/fetch-ordbokene';
import { OrdbokeneResponse, Lookup } from '../../types/ordbokene';

const DictionaryName = {
  nb: "Bokmålsordboka",
  nn: "Nynorskordboka",
};

const useOrdbokene = (searchTerm: string, dialect: 'nb' | 'nn' ) => {
  const { data: lookup } = useQuery({
    queryKey: ['ordbokene', searchTerm, dialect],
    queryFn: () => fetchSuggestions(searchTerm, dialect),
    select: data => getLookupFromOrdbokene(data, searchTerm),
    enabled: searchTerm !== undefined && searchTerm !== '',
  });

  return lookup === undefined || searchTerm === undefined || searchTerm === ''
    ? ['', false]
    : [isTermValid(lookup), getValidationText(lookup, DictionaryName[dialect]), getSuggestion(lookup)] as const;
};

const getLookupFromOrdbokene = (lookup: OrdbokeneResponse, searchTerm: string): Lookup => {
  const exactMatches: string[] = lookup.a.exact ? lookup.a.exact.map(term => term[0]) : [];
  const exact = exactMatches.includes(searchTerm);
  const inflect = lookup.a.inflect ? lookup.a.inflect.map(term => term[0]) : [];
  const similar = lookup.a.similar ? lookup.a.similar.map(term => term[0]) : [];

  return { exact, inflect, similar };
};

const isTermValid = (lookup: Lookup): boolean =>
  lookup ? (lookup?.exact || lookup?.inflect.length > 0) : false;

const getValidationText = (lookup: Lookup, dictionaryName: string): string => {
  if (lookup.exact) {
    return `Finnes i ${dictionaryName}`;
  }
  else if (lookup.inflect) {
    return `Bøyning av ${lookup.inflect[0]} i ${dictionaryName}`;
  } else {
    return '';
  }
}

const getSuggestion = (lookup: Lookup): string => {
  if (lookup.similar.length > 0 && !lookup.exact && lookup.inflect.length == 0) {
    return lookup.similar[0];
  } else {
    return '';
  }
}

export default useOrdbokene;