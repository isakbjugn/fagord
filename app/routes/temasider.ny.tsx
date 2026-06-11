import { useState } from 'react';
import { Link } from 'react-router';
import type { MetaFunction } from 'react-router';
import Markdown from 'react-markdown';

import style from '~/styles/temasider.module.css';

export const meta: MetaFunction = () => [{ title: 'Ny temaside – Fagord' }];

const EKSEMPEL = `# Skriv tittelen som overskrift

Skriv brødteksten her i **Markdown**. Du kan bruke *kursiv*,
lenker som [denne](/termliste) og punktlister:

- Første punkt
- Andre punkt

Husk: en tom linje gir et nytt avsnitt.`;

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
        <p>
          Skriv artikkelen i Markdown til venstre, og se den ferdige temasiden ta form til høyre mens du skriver.
          Ingenting lagres ennå – dette er for å bli kjent med formatet.
        </p>

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
      </div>
    </main>
  );
}
