import { useQuery } from '@tanstack/react-query';
import { fetchSuggestions } from '../../lib/fetch-ordbokene';
import { OrdbokeneResponse, Lookup } from '../../types/ordbokene';

const useOrdbokene = (searchTerm: string, dialect: 'nb' | 'nn' ) => {
  const { data: suggestion } = useQuery({
    queryKey: ['ordbokene', searchTerm, dialect],
    queryFn: () => fetchSuggestions(searchTerm, dialect),
    select: data => getTermsFromSuggestion(data, searchTerm),
    enabled: searchTerm !== undefined && searchTerm !== '',
  });

  return suggestion === undefined || searchTerm === undefined || searchTerm === ''
    ? ['', false]
    : [getValidationText(suggestion, dialect), isTermValid(suggestion)] as const;
};

const getTermsFromSuggestion = (suggestion: OrdbokeneResponse, searchTerm: string): Lookup => {
  const exactMatches: string[] = suggestion.a.exact ? suggestion.a.exact.map(term => term[0]) : [];
  const exact = exactMatches.includes(searchTerm);
  const inflect = suggestion.a.inflect ? suggestion.a.inflect.map(term => term[0]) : [];

  return { exact, inflect };
};

const isTermValid = (suggestion: Lookup): boolean =>
  suggestion ? (suggestion?.exact || suggestion?.inflect.length > 0) : false;

const getValidationText = (suggestion: Lookup, dialect: 'nb' | 'nn'): string => {
  if (suggestion?.exact) {
    return 'Finnes i ' + (dialect === 'nb' ? 'Bokmålsordboka' : 'Nynorsordboka');
  }
  else if (suggestion?.inflect) {
    return 'Bøyning av ' + suggestion.inflect[0] + ' i ' + (dialect === 'nb' ? 'Bokmålsordboka' : 'Nynorsordboka');
  } else {
    return '';
  }
}

export default useOrdbokene;