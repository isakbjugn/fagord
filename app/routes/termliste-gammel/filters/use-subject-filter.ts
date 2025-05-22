import { useState } from 'react';
import type { Term } from '~/types/term';
import { AllSubjects } from '~/types/subject';

export const useSubjectFilter = () => {
  const [subjectFilter, setSubjectFilter] = useState<string | null>(AllSubjects.field);

  const applySubjectFilter = (terms: Term[]): Term[] => {
    if (subjectFilter === null) return terms;
    if (subjectFilter === AllSubjects.field) return terms;
    return terms.filter((term) => term.field === subjectFilter);
  };

  return [setSubjectFilter, applySubjectFilter] as const;
};
