import { Link, useLoaderData, useNavigate } from 'react-router';
import type { MetaFunction } from 'react-router';

import type { Route } from './+types/temasider._index';
import { ErrorMessage } from '~/lib/components/error-message';
import type { ArticleSummary } from '~/types/article';

export const meta: MetaFunction = () => [{ title: 'Temasider – Fagord' }];

export const loader = async () => {
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';

  const response = await fetch(`${FAGORD_RUST_API_URL}/articles`);
  if (!response.ok) {
    throw new Response('Klarte ikke å hente temasider', { status: 500 });
  }

  return (await response.json()) as ArticleSummary[];
};

export function headers(_: Route.HeadersArgs) {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  };
}

export default function Temasider() {
  const articles = useLoaderData<typeof loader>();

  return (
    <main className="container my-3">
      <div className="col-12 col-lg-10 mx-auto" style={{ color: 'white' }}>
        <h1>Temasider</h1>
        <p>Lengre artikler som forklarer et fagfelt eller et begrep nærmere.</p>

        {articles.length === 0 ? (
          <p>
            <em>Ingen temasider er publisert ennå.</em>
          </p>
        ) : (
          <ul className="list-group">
            {articles.map((article) => (
              <li key={article.slug} className="list-group-item">
                <Link to={article.slug}>{article.title}</Link>
                <div className="text-muted">
                  av <span>{article.author}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  const navigate = useNavigate();
  return (
    <ErrorMessage>
      <p>Klarte ikke å hente temasider!</p>
      <button className="btn btn-outline-dark" onClick={() => navigate('/temasider')}>
        Last inn siden på nytt
      </button>
    </ErrorMessage>
  );
}
