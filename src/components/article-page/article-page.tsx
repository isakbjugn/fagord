import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchArticleHtml } from '../../lib/fetch';
import Spinner from '../common/spinner/spinner';
import sanitizeHtml from 'sanitize-html';
import style from './article-page.module.css';

export const ArticlePage = (): JSX.Element => {
  const { articleId } = useParams();
  if (articleId === undefined) return <p>Artikkelen finnes ikke.</p>;

  const {
    isLoading,
    isError,
    data: articleHtml,
  } = useQuery({
    queryKey: ['article', articleId],
    queryFn: fetchArticleHtml,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <p>Kunne ikke laste artikkel.</p>;

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
