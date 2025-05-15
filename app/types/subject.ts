export type SubjectsLoaderData = Promise<{
  success: boolean;
  subjects: Promise<Subject[]>;
  message: string | undefined;
}>;

export interface Subject {
  field: string;
  subfields: string[];
}
