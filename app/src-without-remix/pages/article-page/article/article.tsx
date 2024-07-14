import { useParams } from '@remix-run/react';

import { ArticleContent } from './article-content/article-content';
import { InfoMessage } from '~/src-without-remix/components/info-message/info-message';
import { useArticles } from '~/src-without-remix/utils/use-articles.client';

export const Article = (): JSX.Element => {
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
