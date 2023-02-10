import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardGroup, CardSubtitle, CardTitle } from 'reactstrap';
import { fetchArticles } from '../../../lib/fetch';
import Spinner from '../../common/spinner/spinner';

export const Articles = (): JSX.Element => {
  const {
    isLoading,
    isError,
    data: articles,
  } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles });

  if (isLoading) return <Spinner />;
  if (isError) return <></>;

  return (
    <div className="p-4 p-sm-5 rounded-lg m-3 m-sm-5 ">
      <CardGroup>
        {articles.map((article: any) => (
          <Link to={'/artikkel/' + article.documentId} key={article.documentId}>
            <Card
              style={{
                width: '18rem',
              }}
            >
              {article.imageUrl !== '' ? (
                <img
                  alt="Sample"
                  src={article.imageUrl}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img alt="Sample" src="https://picsum.photos/300/200" />
              )}
              <CardBody>
                <CardTitle style={{ color: '#000000' }} tag="h5">
                  {article.title}
                </CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                  {article.subtitle}
                </CardSubtitle>
              </CardBody>
            </Card>
          </Link>
        ))}
      </CardGroup>
    </div>
  );
};
