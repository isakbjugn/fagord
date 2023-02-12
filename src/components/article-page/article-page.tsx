import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchArticles } from '../../lib/fetch';
import Spinner from '../common/spinner/spinner';
import { Article } from './article/article';

export const ArticlePage = (): JSX.Element => {
  const { articleKey } = useParams();
  if (articleKey === undefined) return <p>Artikkelen finnes ikke.</p>;

  const {
    isLoading: isLoadingArticles,
    isError: isErrorArticles,
    data: articles,
  } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles });

  if (isLoadingArticles) return <Spinner />;
  if (isErrorArticles) return <p>Kunne ikke laste artikler.</p>;

  if (!articles.some((article) => article.documentKey === articleKey)) {
    return <p>Artikkelen finnes ikke.</p>;
  }

  const articleId: string = articles
    .filter((article) => article.documentKey === articleKey)
    .map((article) => article.documentId)[0];

  return <Article articleId={articleId} />;
};
