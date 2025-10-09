export interface Term {
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

export interface ChangeDefinition {
  definition: string;
}

export interface CreateVariant {
  term: string;
  dialect: 'nb' | 'nn';
}
