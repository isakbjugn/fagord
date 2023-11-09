import { useParams } from 'react-router-dom';

import { InfoMessage } from '../../../components/info-message/info-message';
import { useArticles } from '../../../utils/use-articles';
import { ArticleContent } from './article-content/article-content';

export const Article = (): JSX.Element => {
  const { articleKey } = useParams();
  const { data: articles } = useArticles();
  if (articles === undefined) return <></>;

  if (!articles.some((article) => article.key === articleKey)) {
    return (
      <InfoMessage>
        <p>Artikkelen finnes ikke.</p>
      </InfoMessage>
    );
  }

  const article = articles.filter((article) => article.key === articleKey)[0];

  return <ArticleContent articleId={article.id} />;
};
