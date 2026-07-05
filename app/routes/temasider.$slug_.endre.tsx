import { useState } from 'react';
import { Form, isRouteErrorResponse, Link, redirect, useLoaderData, useRouteError } from 'react-router';
import Markdown from 'react-markdown';

import type { Route } from './+types/temasider.$slug_.endre';
import style from '~/styles/temasider.module.css';
import type { Article } from '~/types/article';
import { getSession } from '~/lib/session.server';

export const meta = ({ loaderData }: Route.MetaArgs) => [
  { title: loaderData ? `Endre ${loaderData.title} – Fagord` : 'Endre temaside – Fagord' },
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
  // `actions`. Mangler «edit», har brukeren ikke lov til å lagre – da stopper vi før
  // skjemaet vises, i stedet for å la dem redigere forgjeves. Rust håndhever uansett
  // det samme på selve PATCH-kallet.
  if (!article.actions.includes('edit')) {
    throw new Response('Du har ikke tilgang til å redigere denne temasiden', { status: 403 });
  }

  return article;
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { slug } = params;
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const session = await getSession(request);
  const token = session.get('token');

  const formData = await request.formData();
  const tittel = formData.get('tittel');
  const innhold = formData.get('innhold');

  // Autorisasjonen (eier ELLER admin) håndheves i Rust; her sender vi bare med tokenet.
  const response = await fetch(`${FAGORD_RUST_API_URL}/articles/${slug}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: tittel, content: innhold }),
  });

  if (!response.ok) {
    throw new Response('Klarte ikke å lagre endringene', { status: response.status });
  }

  return redirect(`/temasider/${slug}`);
};

export default function EndreTemaside() {
  const article = useLoaderData<typeof loader>();
  const [tittel, setTittel] = useState(article.title);
  const [innhold, setInnhold] = useState(article.content);

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
            <li className="breadcrumb-item active">Endre</li>
          </ol>
        </nav>

        <h1>Endre temaside</h1>
        <p>Rediger artikkelen i Markdown til venstre, og se den ferdige temasiden ta form til høyre mens du skriver.</p>

        <Form method="post">
          <div className="mb-3">
            <label className="form-label" htmlFor="tittel">
              Tittel
            </label>
            <input
              id="tittel"
              name="tittel"
              className="form-control"
              type="text"
              value={tittel}
              onChange={(event) => setTittel(event.target.value)}
              placeholder="F.eks. Hva er en kompilator?"
            />
          </div>

          <div className="row">
            <div className="col-12 col-lg-6 mb-3">
              <label className="form-label" htmlFor="innhold">
                Innhold (Markdown)
              </label>
              <div className={style.scrollBackground}>
                <textarea
                  id="innhold"
                  name="innhold"
                  className={`form-control ${style.editor}`}
                  value={innhold}
                  onChange={(event) => setInnhold(event.target.value)}
                />
              </div>
              <p className={style.hint}>💡 Tom linje gir nytt avsnitt. Ett enkelt linjeskift slår teksten sammen.</p>
            </div>

            <div className="col-12 col-lg-6 mb-3">
              <div className="form-label">Forhåndsvisning</div>
              <article className={style.preview}>
                {tittel && <h2>{tittel}</h2>}
                <Markdown>{innhold}</Markdown>
              </article>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-success" type="submit">
              Lagre endringer
            </button>
            <Link className="btn btn-outline-light" to={`/temasider/${article.slug}`}>
              Avbryt
            </Link>
          </div>
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
          <p>Du kan bare endre temasider du selv har skrevet. Ta kontakt hvis du mener dette er feil.</p>
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
          <p>Vi fant ikke temasiden du prøvde å endre. Er du sikker på at den finnes?</p>
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
        <p>Noe gikk feil mens vi lagret endringene. Prøv igjen om litt.</p>
        <Link to="/temasider">
          <button className="btn btn-outline-light">Tilbake til temasidene</button>
        </Link>
      </div>
    </div>
  );
}
