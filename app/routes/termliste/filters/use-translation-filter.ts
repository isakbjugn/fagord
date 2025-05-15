import { useState } from 'react';
import { TransFilterType } from '~/types/filters';
import type { Term } from '~/types/term';

export const useTranslationFilter = () => {
  const [transFilter, setTransFilter] = useState<TransFilterType>('all');

  const applyTransFilter = (terms: Term[]): Term[] => {
    switch (transFilter) {
      case 'translated':
        return terms.filter((term) => term.nb !== '' || term.nn !== '');
      case 'incomplete':
        return terms.filter((term) => term.nb === '' || term.nn === '');
      default:
        return terms;
    }
  };

  return [setTransFilter, applyTransFilter] as const;
};
