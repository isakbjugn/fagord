import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from 'react-router';
import Markdown from 'react-markdown';

import type { Route } from './+types/temasider.$slug';
import style from '~/styles/temasider.module.css';
import type { Article } from '~/types/article';

export const meta = ({ loaderData }: Route.MetaArgs) => [
  { title: loaderData ? `${loaderData.title} – Fagord` : 'Temaside – Fagord' },
];

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { slug } = params;
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';

  const response = await fetch(`${FAGORD_RUST_API_URL}/articles/${slug}`);
  if (!response.ok) {
    throw new Response('Temasiden finnes ikke', { status: 404 });
  }

  return (await response.json()) as Article;
};

export function headers(_: Route.HeadersArgs) {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  };
}

export default function Temaside() {
  const article = useLoaderData<typeof loader>();

  return (
    <main className="container my-3">
      <div className="col-12 col-lg-10 mx-auto">
        <nav aria-label="breadcrumb" style={{ color: 'white' }}>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/temasider">Temasider</Link>
            </li>
            <li className="breadcrumb-item active">{article.title}</li>
          </ol>
        </nav>

        <article className={style.preview}>
          <p className="text-muted">
            av <span>{article.author}</span>
          </p>
          <Markdown>{article.content}</Markdown>
        </article>
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="container my-3">
        <div className="col-12 col-lg-10 mx-auto" style={{ color: 'white' }}>
          <h1>Ops! Her var det ingenting!</h1>
          <p>Vi fant ikke temasiden du lette etter. Er du sikker på at den finnes?</p>
          <Link to="/temasider">
            <button className="btn btn-outline-light">Tilbake til temasidene</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-3">
      <div className="col-12 col-lg-10 mx-auto" style={{ color: 'white' }}>
        <h1>Her gikk noe galt!</h1>
        <p>Noe gikk feil mens vi hentet temasiden.</p>
        <Link to="/temasider">
          <button className="btn btn-outline-light">Tilbake til temasidene</button>
        </Link>
      </div>
    </div>
  );
}
