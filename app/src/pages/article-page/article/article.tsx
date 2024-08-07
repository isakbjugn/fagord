import { useParams } from '@remix-run/react';

import { InfoMessage } from '../../../components/info-message/info-message';
import { useArticles } from '../../../utils/use-articles';
import { ArticleContent } from './article-content/article-content';

export const Article = () => {
  const { articleKey } = useParams();
  const { data: articles } = useArticles();
  if (articles === undefined) return <></>;

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

  return <ArticleContent articleId={articleId} />;
};
