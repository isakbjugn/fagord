import { Form, isRouteErrorResponse, Link, redirect, useLoaderData, useRouteError } from 'react-router';

import type { Route } from './+types/temasider.$slug_.slett';
import type { Article } from '~/types/article';
import { getSession } from '~/lib/session.server';

export const meta = ({ loaderData }: Route.MetaArgs) => [
  { title: loaderData ? `Slett ${loaderData.title} – Fagord` : 'Slett temaside – Fagord' },
];

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { slug } = params;
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const session = await getSession(request);
  const token = session.get('token');

  const response = await fetch(`${FAGORD_RUST_API_URL}/articles/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Response('Temasiden finnes ikke', { status: 404 });
  }

  const article = (await response.json()) as Article;

  // UX-vakt, ikke en sikkerhetsgrense: API-et regner ut eier/admin og speiler det i
  // `actions`. Mangler «delete», har brukeren ikke lov til å slette – da stopper vi før
  // bekreftelsen vises. Rust håndhever uansett det samme på selve DELETE-kallet.
  if (!article.actions.includes('delete')) {
    throw new Response('Du har ikke tilgang til å slette denne temasiden', { status: 403 });
  }

  return article;
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { slug } = params;
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const session = await getSession(request);
  const token = session.get('token');

  // Autorisasjonen (eier ELLER admin) håndheves i Rust; her sender vi bare med tokenet.
  const response = await fetch(`${FAGORD_RUST_API_URL}/articles/${slug}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Response('Klarte ikke å slette temasiden', { status: response.status });
  }

  return redirect('/temasider');
};

export default function SlettTemaside() {
  const article = useLoaderData<typeof loader>();

  return (
    <main className="container my-3">
      <div className="col-12 col-lg-10 mx-auto" style={{ color: 'white' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/temasider">Temasider</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/temasider/${article.slug}`}>{article.title}</Link>
            </li>
            <li className="breadcrumb-item active">Slett</li>
          </ol>
        </nav>

        <h1>Slett temaside</h1>
        <p>
          Er du sikker på at du vil slette «{article.title}»? Dette kan ikke angres.
        </p>

        <Form method="post" className="d-flex gap-2">
          <button className="btn btn-danger" type="submit">
            Ja, slett temasiden
          </button>
          <Link className="btn btn-outline-light" to={`/temasider/${article.slug}`}>
            Avbryt
          </Link>
        </Form>
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 403) {
    return (
      <div className="container my-3">
        <div className="col-12 col-lg-10 mx-auto" style={{ color: 'white' }}>
          <h1>Ingen tilgang</h1>
          <p>Du kan bare slette temasider du selv har skrevet. Ta kontakt hvis du mener dette er feil.</p>
          <Link to="/temasider">
            <button className="btn btn-outline-light">Tilbake til temasidene</button>
          </Link>
        </div>
      </div>
    );
  }

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="container my-3">
        <div className="col-12 col-lg-10 mx-auto" style={{ color: 'white' }}>
          <h1>Ops! Her var det ingenting!</h1>
          <p>Vi fant ikke temasiden du prøvde å slette. Er du sikker på at den finnes?</p>
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
        <p>Noe gikk feil mens vi slettet temasiden. Prøv igjen om litt.</p>
        <Link to="/temasider">
          <button className="btn btn-outline-light">Tilbake til temasidene</button>
        </Link>
      </div>
    </div>
  );
}
