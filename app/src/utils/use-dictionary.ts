import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { fetchTerms } from '../lib/fetch';
import type { Term } from '../types/term';

export const useDictionary = (): UseQueryResult<Term[]> => useQuery({ queryKey: ['dictionary'], queryFn: fetchTerms });
