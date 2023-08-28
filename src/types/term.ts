export interface Term {
  _id: string;
  en: string;
  nb: string;
  nn: string;
  variants: Variant[];
  definition: string;
  field: string;
  subfield: string;
  pos: string;
}

export interface Variant {
  term: string;
  dialect: 'nb' | 'nn';
  votes?: number;
}

export type Language = Pick<Term, 'en' | 'nb' | 'nn'>;

export type SubmitTerm = Partial<Term>;

export type SubmitVariant = Partial<Variant>;

export type VariantVote = Variant & {
  count: number;
  value: string;
};
