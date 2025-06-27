import { useFetcher } from 'react-router';
import { useEffect } from 'react';
import { Subject } from '~/types/subject';

export function useSubjectsFetcher() {
  const fetcher = useFetcher<{ subjects: Subject[]; error: boolean; message: string | undefined }>();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === 'idle') {
      fetcher.load('/api/fagfelt');
    }
  }, [fetcher]);

  return fetcher;
}
