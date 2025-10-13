export interface Subject {
  name: string;
  subfields: Subject[];
}

export const AllSubjects: Subject = { name: 'Alle fagfelt', subfields: [] };
