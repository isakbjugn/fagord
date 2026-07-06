import { Form, Link, useLoaderData, useNavigate, useNavigation, useRouteLoaderData } from 'react-router';
import type { MetaFunction } from 'react-router';

import type { Route } from './+types/temasider._index';
import { ErrorMessage } from '~/lib/components/error-message';
import type { ArticleSummary } from '~/types/article';
import { getSession } from '~/lib/session.server';

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

export const action = async ({ request }: Route.ActionArgs) => {
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const session = await getSession(request);
  const token = session.get('token');

  const formData = await request.formData();
  const slug = formData.get('slug');

  // Autorisasjonen (eier ELLER admin) håndheves i Rust; her sender vi bare med tokenet.
  const response = await fetch(`${FAGORD_RUST_API_URL}/articles/${slug}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Response('Klarte ikke å slette temasiden', { status: response.status });
  }

  // Ingen redirect: vi er allerede på listesiden, og React Router laster loaderen
  // på nytt etter en vellykket action – så den slettede raden forsvinner av seg selv.
  return null;
};

export function headers(_: Route.HeadersArgs) {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  };
}

export default function Temasider() {
  const articles = useLoaderData<typeof loader>();
  // Samme mønster som header.tsx: les innloggingsstatus fra root-loaderen. Vi trenger den
  // bare for å vise/skjule «Skriv ny»-knappen (ren UX – selve opprettelsen håndheves i Rust).
  const rootData = useRouteLoaderData<{ isLoggedIn: boolean }>('root');
  const isLoggedIn = rootData?.isLoggedIn ?? false;

  // Mens en sletting pågår vet vi hvilken rad det gjelder via slug-feltet i skjemaet.
  // Det bruker vi til å deaktivere akkurat den knappen og gi en «Sletter …»-tilstand.
  const navigation = useNavigation();
  const slugSomSlettes =
    navigation.state !== 'idle' ? navigation.formData?.get('slug')?.toString() : undefined;

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
                    <span className="fa fa-pencil" />
                  </Link>
                )}
                {article.actions.includes('delete') && (
                  <Form
                    method="post"
                    className="position-relative z-2"
                    onSubmit={(event) => {
                      if (!confirm(`Vil du slette «${article.title}»? Dette kan ikke angres.`)) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="slug" value={article.slug} />
                    <button
                      className="btn btn-outline-danger btn-sm d-flex align-items-center"
                      type="submit"
                      disabled={slugSomSlettes === article.slug}
                      aria-label={`Slett ${article.title}`}
                      title="Slett temaside"
                    >
                      <span className="fa fa-trash" />
                    </button>
                  </Form>
                )}
              </li>
            ))}
          </ul>
        )}

        {isLoggedIn && (
          <div className="mt-3">
            <Link className="btn btn-outline-light" to="ny">
              Skriv ny temaside
            </Link>
          </div>
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
