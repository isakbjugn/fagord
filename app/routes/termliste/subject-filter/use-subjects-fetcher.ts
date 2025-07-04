import { useFetcher } from 'react-router';
import { loader } from '~/routes/api.fagfelt';
import { useEffect } from 'react';

export function useSubjectsFetcher() {
  const fetcher = useFetcher<typeof loader>();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === 'idle') {
      fetcher.load('/api/fagfelt');
    }
  }, [fetcher]);

  return fetcher;
}
