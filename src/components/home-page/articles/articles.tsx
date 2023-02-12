import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../../../lib/fetch';
import Spinner from '../../common/spinner/spinner';
import style from './articles.module.css';

export const Articles = (): JSX.Element => {
  const {
    isLoading,
    isError,
    data: articles,
  } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles });

  if (isLoading) return <Spinner />;
  if (isError) return <></>;

  return (
    <div className={style.grid}>
      {articles.map((article: any) => (
        <Card
          className={style.article}
          key={article.documentKey}
          sx={{ backgroundColor: '#29648a' }}
        >
          <CardActionArea
            component={Link}
            to={'/artikkel/' + article.documentKey}
            className={style['action-area']}
          >
            <CardMedia
              component="img"
              height="140"
              image={article.imageUrl || 'https://picsum.photos/300/200'}
              referrerPolicy="no-referrer"
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                color="white"
              >
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
