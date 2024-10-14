import type { QueryFunctionContext } from '@tanstack/react-query';

import type { Article } from '~/types/article';
import type { Term } from '~/types/term';

const baseApiUri = 'https://www.api.fagord.no';

const termsUrl = baseApiUri + '/termer/';
const articlesUrl = baseApiUri + '/artikler/';

export const fetchTerms = async (): Promise<Term[]> => {
  const res = await fetch(termsUrl);

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export const fetchArticles = async (): Promise<Article[]> => {
  const res = await fetch(articlesUrl);

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};

export const fetchArticleHtml = async ({ queryKey }: QueryFunctionContext): Promise<string> => {
  const [_, articleId] = queryKey;
  const res = await fetch(articlesUrl + articleId);

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }

  const innerHtml = await res.text();
  return innerHtml;
};
