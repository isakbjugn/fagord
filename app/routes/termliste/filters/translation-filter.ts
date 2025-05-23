import { FilterFn } from '@tanstack/react-table';
import type { Term } from '~/types/term';

export const translationFilter: FilterFn<Term> = (row, columnId, filterValue) => {
  if (filterValue === 'translated') {
    return row.original.nb !== '' && row.original.nn !== '';
  } else if (filterValue === 'incomplete') {
    return row.original.nb === '' || row.original.nn === '';
  }
  return true;
};
