import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchArticles } from '../../lib/fetch';
import InfoMessage from '../common/info-message/info-message';
import Spinner from '../common/spinner/spinner';
import { Article } from './article/article';

export const ArticlePage = (): JSX.Element => {
  const { articleKey } = useParams();

  const {
    isLoading: isLoadingArticles,
    isError: isErrorArticles,
    data: articles,
  } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles });

  if (isLoadingArticles) return <Spinner />;
  if (isErrorArticles)
    return (
      <InfoMessage>
        <p>Kunne ikke laste artikler.</p>
      </InfoMessage>
    );

  if (!articles.some((article) => article.documentKey === articleKey)) {
    return (
      <InfoMessage>
        <p>Artikkelen finnes ikke.</p>
      </InfoMessage>
    );
  }

  const articleId: string = articles
    .filter((article) => article.documentKey === articleKey)
    .map((article) => article.documentId)[0];

  return <Article articleId={articleId} />;
};
