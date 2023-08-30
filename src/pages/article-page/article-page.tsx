import { Outlet, useParams } from 'react-router-dom';

import { ArticleGrid } from '../../components/article-grid/article-grid';
import { InfoMessage } from '../../components/info-message/info-message';
import { Spinner } from '../../components/spinner/spinner';
import { useArticles } from '../../utils/use-articles';

export const ArticlePage = (): JSX.Element => {
  const { isLoading, isError } = useArticles();
  const { articleKey } = useParams();

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <InfoMessage>
        <p>Kunne ikke laste artikler.</p>
      </InfoMessage>
    );

  return (
    <>
      <Outlet />
      <ArticleGrid hiddenKey={articleKey} />
    </>
  );
};
