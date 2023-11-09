import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { Article } from '../../types/article';
import { useArticles } from '../../utils/use-articles';
import { Spinner } from '../spinner/spinner';
import style from './article-grid.module.css';

export const ArticleGrid = ({ hiddenKey }: { hiddenKey?: string }): JSX.Element => {
  const { isPending, isError, data: articles } = useArticles();

  if (isPending) return <Spinner />;
  if (isError) return <></>;

  return (
    <div className={style.grid}>
      {articles
        .filter((article: Article) => article.key !== hiddenKey)
        .map((article: Article) => (
          <Card className={style.article} key={article.key} sx={{ backgroundColor: '#29648a' }}>
            <CardActionArea component={Link} to={'/artikler/' + article.key} className={style['action-area']}>
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
