import { Outlet, useParams } from '@remix-run/react';
import { Spinner } from '~/src-without-remix/components/spinner/spinner';
import { useArticles } from '~/src-without-remix/utils/use-articles.client';
import { InfoMessage } from '~/src-without-remix/components/info-message/info-message';
import { ArticleGrid } from '~/src-without-remix/components/article-grid/article-grid';

export const ArticlePage = (): JSX.Element => {
  const { isPending, isError } = useArticles();
  const { articleKey } = useParams();

  if (isPending) return <Spinner />;
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
