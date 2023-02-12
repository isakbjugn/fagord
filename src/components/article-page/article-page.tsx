import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchArticleHtml, fetchArticles } from '../../lib/fetch';
import Spinner from '../common/spinner/spinner';
import sanitizeHtml from 'sanitize-html';
import style from './article-page.module.css';

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

  const articleId = articles
    .filter((article) => article.documentKey === articleKey)
    .map((article) => article.documentId);

  const {
    isLoading: isLoadingHtml,
    isError: isHtmlError,
    data: articleHtml,
  } = useQuery({
    queryKey: ['article', articleId],
    queryFn: fetchArticleHtml,
  });

  if (isLoadingHtml) return <Spinner />;
  if (isHtmlError) return <p>Kunne ikke laste artikkel.</p>;

  const cleanHtml = sanitizeHtml(articleHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: false,
    transformTags: {
      img: sanitizeHtml.simpleTransform('img', {
        referrerpolicy: 'no-referrer',
      }),
    },
  });

  return (
    <div className="container-sm m-5">
      <div className="col-12 col-lg-8 mx-auto">
        <div
          className={style.article}
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      </div>
    </div>
  );
};
