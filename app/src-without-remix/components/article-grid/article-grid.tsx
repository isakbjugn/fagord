import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from '@remix-run/react';

import style from './article-grid.module.css';
import { useArticles } from '~/src-without-remix/utils/use-articles.client';
import type { Article } from '~/types/article';
import { Spinner } from '~/src-without-remix/components/spinner/spinner';

export const ArticleGrid = ({ hiddenKey }: { hiddenKey?: string }): JSX.Element => {
  const { isPending, isError, data: articles } = useArticles();

  if (isPending) return <Spinner />;
  if (isError) return <></>;

  return (
    <div className={style.grid}>
      {articles
        .filter((article: Article) => article.documentKey !== hiddenKey)
        .map((article: Article) => (
          <Card className={style.article} key={article.documentKey} sx={{ backgroundColor: '#29648a' }}>
            <CardActionArea component={Link} to={'/artikler/' + article.documentKey} className={style['action-area']}>
              <CardMedia
                component="img"
                height="140"
                image={article.imageUrl || 'https://picsum.photos/300/200'}
                referrerPolicy="no-referrer"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" color="white">
                  {article.title}
                </Typography>
                <Typography variant="body2" color="white">
                  {article.subtitle}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
    </div>
  );
};
