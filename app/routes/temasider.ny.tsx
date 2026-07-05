import { useState } from 'react';
import { Form, isRouteErrorResponse, Link, redirect, useRouteError } from 'react-router';
import type { MetaFunction } from 'react-router';
import Markdown from 'react-markdown';

import type { Route } from './+types/temasider.ny';
import style from '~/styles/temasider.module.css';
import type { Article } from '~/types/article';
import { getSession } from '~/lib/session.server';

export const meta: MetaFunction = () => [{ title: 'Ny temaside – Fagord' }];

const EKSEMPEL = `# Skriv tittelen som overskrift

Skriv brødteksten her i **Markdown**. Du kan bruke *kursiv*,
lenker som [denne](/termliste) og punktlister:

- Første punkt
- Andre punkt

Husk: en tom linje gir et nytt avsnitt.`;

export const action = async ({ request }: Route.ActionArgs) => {
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const session = await getSession(request);
  const token = session.get('token');

  const formData = await request.formData();
  const tittel = formData.get('tittel');
  const innhold = formData.get('innhold');

  // Håndhevingen (må være innlogget) ligger i Rust; her sender vi bare med tokenet.
  const response = await fetch(`${FAGORD_RUST_API_URL}/articles`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: tittel, content: innhold }),
  });

  if (!response.ok) {
    throw new Response('Klarte ikke å opprette temasiden', { status: response.status });
  }

  // API-et svarer med den opprettede artikkelen; slug-en bruker vi til å gå rett dit.
  const article = (await response.json()) as Article;
  return redirect(`/temasider/${article.slug}`);
};

export default function NyTemaside() {
  const [tittel, setTittel] = useState('');
  const [innhold, setInnhold] = useState(EKSEMPEL);

  return (
    <main className="container my-3">
      <div className="col-12 col-lg-10 mx-auto" style={{ color: 'white' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/temasider">Temasider</Link>
            </li>
            <li className="breadcrumb-item active">Ny temaside</li>
          </ol>
        </nav>

        <h1>Ny temaside</h1>
        <p>Skriv artikkelen i Markdown til venstre, og se den ferdige temasiden ta form til høyre mens du skriver.</p>

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
              Opprett temaside
            </button>
            <Link className="btn btn-outline-light" to="/temasider">
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

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div className="container my-3">
        <div className="col-12 col-lg-10 mx-auto" style={{ color: 'white' }}>
          <h1>Ikke innlogget</h1>
          <p>Du må være innlogget for å opprette en temaside. Logg inn og prøv igjen.</p>
          <Link to="/logg-inn">
            <button className="btn btn-outline-light">Til innlogging</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-3">
      <div className="col-12 col-lg-10 mx-auto" style={{ color: 'white' }}>
        <h1>Her gikk noe galt!</h1>
        <p>Noe gikk feil mens vi opprettet temasiden. Prøv igjen om litt.</p>
        <Link to="/temasider">
          <button className="btn btn-outline-light">Tilbake til temasidene</button>
        </Link>
      </div>
    </div>
  );
}
