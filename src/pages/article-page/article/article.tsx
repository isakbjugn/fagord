import { useParams } from 'react-router-dom';

import { InfoMessage } from '../../../components/info-message/info-message';
import { useArticles } from '../../../utils/use-articles';
import style from './article.module.css';
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

  return (
    <article className={style.article}>
      <h1>{article.title}</h1>
      <p>
        <big>{article.subtitle}</big>
      </p>
      <figure className={style.image}>
        <img src={article.imageUrl} alt="alt-bildetekst" referrerPolicy="no-referrer" />
        <figcaption>{article.subtitle}</figcaption>
      </figure>
      <ArticleContent articleId={article.id} />
    </article>
  );
};
