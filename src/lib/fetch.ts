import { Variant } from "../types/term"

const baseApiUri = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

export const fetchTerms = async () => {
  const res = await fetch(baseApiUri + '/api/termer');
  const json = await res.json();

  if (res.ok) {
    return json;
  }
  throw Error(res.statusText);
}

export const fetchFields = async () => {
  const res = await fetch(baseApiUri + '/api/fagfelt');
  const json = await res.json();

  if (res.ok) {
    return json;
  }
  throw Error(res.statusText);
}

export const postTerm = async (term: any) => {
  const res = await fetch(baseApiUri + '/api/termer', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(term)
  })

  if (!res.ok) {
    throw Error(res.status + " " + res.statusText);
  }
  return await res.json();
}

interface UpdateTermArguments {
  termId: string;
  term: any;
}

export const updateTerm = async ({ termId, term }: UpdateTermArguments) => {
  const res = await fetch(baseApiUri + '/api/termer/' + termId, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(term)
  })
  const json = await res.json();
  if (res.ok) {
    return json;
  }
  throw Error(res.statusText);
}

export interface AddVariantArguments {
  termId: string;
  variant: Variant;
}

export const addVariant = async ({ termId, variant }: VoteForVariantArguments) => {
  const res = await fetch(baseApiUri + '/api/termer/' + termId + '/varianter', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(variant)
  })
  const json = await res.json();
  if (res.ok) {
    return json;
  }
  throw Error(res.statusText);
}

export interface VoteForVariantArguments {
  termId: string;
  variant: Variant;
}

export const voteForVariant = async ({ termId, variant }: VoteForVariantArguments) => {
  const res = await fetch(baseApiUri + '/api/termer/' + termId + '/varianter', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(variant)
  })
  const json = await res.json();
  if (res.ok) {
    return json;
  }
  throw Error(res.statusText);
}