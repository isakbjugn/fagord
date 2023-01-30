import { fetchTerms } from '../../lib/fetch';
import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Term } from '../../types/term';

const useDictionary = (): UseQueryResult<Term[]> =>
  useQuery({ queryKey: ['dictionary'], queryFn: fetchTerms });

export default useDictionary;
