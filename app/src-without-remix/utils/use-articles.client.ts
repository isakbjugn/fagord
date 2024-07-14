import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '~/src-without-remix/lib/fetch.client';

export const useArticles = () =>
  useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });
