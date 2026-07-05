import { Link, useLoaderData, useNavigate } from 'react-router';
import type { MetaFunction } from 'react-router';

import type { Route } from './+types/temasider._index';
import { ErrorMessage } from '~/lib/components/error-message';
import type { ArticleSummary } from '~/types/article';
import { getSession } from '~/lib/session.server';
import PencilIcon from '~/lib/components/pencil.svg?react';

export const meta: MetaFunction = () => [{ title: 'Temasider – Fagord' }];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const session = await getSession(request);
  const token = session.get('token');

  const response = await fetch(`${FAGORD_RUST_API_URL}/articles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
              <li
                key={article.slug}
                className="list-group-item list-group-item-action position-relative d-flex align-items-center gap-3"
              >
                <div className="flex-grow-1">
                  <Link className="stretched-link" to={article.slug}>
                    {article.title}
                  </Link>
                  <div className="text-muted">
                    av <span>{article.author}</span>
                  </div>
                </div>
                {article.actions.includes('edit') && (
                  <Link
                    className="btn btn-outline-secondary btn-sm position-relative z-2 d-flex align-items-center"
                    to={`${article.slug}/endre`}
                    aria-label={`Rediger ${article.title}`}
                    title="Rediger temaside"
                  >
                    <PencilIcon aria-hidden="true" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3">
          <Link className="btn btn-outline-light" to="ny">
            Skriv ny temaside
          </Link>
        </div>
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
