import { useQuery } from '@tanstack/react-query';
import sanitizeHtml from 'sanitize-html';

import { InfoMessage } from '../../../../components/info-message/info-message';
import { Spinner } from '../../../../components/spinner/spinner';
import { fetchArticleHtml } from '../../../../lib/fetch';
import style from './article-content.module.css';

export const ArticleContent = ({ articleId }: { articleId: string }) => {
  const {
    isPending: isPendingHtml,
    isError: isHtmlError,
    data: articleHtml,
  } = useQuery({
    queryKey: ['article', articleId],
    queryFn: fetchArticleHtml,
  });

  if (isPendingHtml) return <Spinner />;
  if (isHtmlError)
    return (
      <InfoMessage>
        <p>Kunne ikke laste artikkel.</p>
      </InfoMessage>
    );

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
        <div className={style.article} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
      </div>
    </div>
  );
};
