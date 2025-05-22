import { FilterFn } from '@tanstack/react-table';
import type { Term } from '~/types/term';
import { AllSubjects } from '~/types/subject';

export const filterSubjects: FilterFn<Term> = (row, columnId, filterValue) => {
  const subject = row.getValue(columnId);
  if (filterValue === AllSubjects.field) return true;
  return subject === filterValue;
};
