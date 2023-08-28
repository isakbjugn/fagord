import { useQuery } from '@tanstack/react-query';

import { fetchArticles } from '../../lib/fetch';

export const useArticles = () =>
  useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });
