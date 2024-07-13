import { Subject } from "~/types/subject";
import { SubmitTerm, SubmitVariant, Term, Variant } from '~/types/term';

const baseApiUri = 'https://www.api.fagord.no';

const termsUrl = baseApiUri + '/termer/';
const fieldsUrl = baseApiUri + '/fagfelt/';

export const fetchTerms = async (): Promise<Term[]> => {
  const res = await fetch(termsUrl);

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export const fetchFields = async (): Promise<Subject[]> => {
  const res = await fetch(fieldsUrl);

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export const postTerm = async (term: SubmitTerm): Promise<Term> => {
  const res = await fetch(termsUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(term),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

interface UpdateTermArguments {
  termId: string;
  term: SubmitTerm;
}

export const updateTerm = async ({ termId, term }: UpdateTermArguments): Promise<Term> => {
  const res = await fetch(termsUrl + termId, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(term),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export interface AddVariantArguments {
  termId: string;
  variant: SubmitVariant;
}

export const addVariant = async ({ termId, variant }: AddVariantArguments): Promise<Variant> => {
  const res = await fetch(termsUrl + termId + '/varianter', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(variant),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export interface VoteForVariantArguments {
  termId: string;
  variant: Variant;
}

export const voteForVariant = async ({ termId, variant }: VoteForVariantArguments): Promise<Variant> => {
  const res = await fetch(termsUrl + termId + '/varianter', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(variant),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};
