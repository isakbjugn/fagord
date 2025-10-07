import { FilterFn } from '@tanstack/react-table';
import type { Term } from '~/types/term';
import { AllSubjects } from '~/types/subject';

export const subjectFilter: FilterFn<Term> = (row, columnId, filterValue) => {
  const subject = row.getValue(columnId);
  if (filterValue === AllSubjects.name) return true;
  return subject === filterValue;
};

export const translationFilter: FilterFn<Term> = (row, columnId, filterValue) => {
  if (filterValue === 'translated') {
    return row.original.nb !== null && row.original.nn !== null;
  } else if (filterValue === 'incomplete') {
    return row.original.nb === null || row.original.nn === null;
  }
  return true;
};
