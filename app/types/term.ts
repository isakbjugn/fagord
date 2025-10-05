export interface Term {
  _id: string;
  slug: string;
  en: string;
  nb: string;
  nn: string;
  variants: Variant[];
  definition: string;
  field: string;
  subfield: string;
  pos: string;
  reference: string;
}

export interface Variant {
  id: number;
  text: string;
  dialect: 'nb' | 'nn';
  votes: number;
}

export type Language = Pick<Term, 'en' | 'nb' | 'nn'>;

export type SubmitTerm = Partial<Term>;

export interface SubmitVariant {
  term: string;
  dialect: 'nb' | 'nn';
}
