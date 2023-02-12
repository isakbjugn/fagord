import { useQuery } from '@tanstack/react-query';
import { fetchArticleHtml } from '../../../lib/fetch';
import Spinner from '../../common/spinner/spinner';
import sanitizeHtml from 'sanitize-html';
import style from './article.module.css';

export const Article = ({ articleId }: { articleId: string }): JSX.Element => {
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