export type SubjectsLoaderData = {
  success: boolean;
  subjects: Promise<Subject[]>;
  message: string | undefined;
};

export interface Subject {
  field: string;
  subfields: string[];
}

export const AllSubjects: Subject = { field: 'Alle fagfelt', subfields: [] };
