import type { Subject } from '../types/subject';
import type { Term, Variant } from '../types/term';

const baseApiUri =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

export const articleUrl = baseApiUri + '/api/artikler/';

export const fetchTerms = async (): Promise<Term[]> => {
  const res = await fetch(baseApiUri + '/api/termer');

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export const fetchFields = async (): Promise<Subject[]> => {
  const res = await fetch(baseApiUri + '/api/fagfelt');

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export const fetchArticles = async (): Promise<any[]> => {
  const res = await fetch(baseApiUri + '/api/artikler');

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export const fetchArticleHtml = async ({ queryKey }: any): Promise<string> => {
  const [_, articleId] = queryKey;
  const res = await fetch(baseApiUri + '/api/artikler/' + articleId);

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }

  const innerHtml = await res.text();
  return innerHtml;
};

export const postTerm = async (term: any): Promise<Term> => {
  const res = await fetch(baseApiUri + '/api/termer', {
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
  term: any;
}

export const updateTerm = async ({
  termId,
  term,
}: UpdateTermArguments): Promise<Term> => {
  const res = await fetch(baseApiUri + '/api/termer/' + termId, {
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
  variant: Variant;
}

export const addVariant = async ({
  termId,
  variant,
}: VoteForVariantArguments): Promise<Variant> => {
  const res = await fetch(baseApiUri + '/api/termer/' + termId + '/varianter', {
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

export const voteForVariant = async ({
  termId,
  variant,
}: VoteForVariantArguments): Promise<Variant> => {
  const res = await fetch(baseApiUri + '/api/termer/' + termId + '/varianter', {
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
