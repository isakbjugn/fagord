import { Link } from 'react-router';

import type { Route } from './+types/ny-term.$termId.opprettet';
import style from '~/styles/ny-term.module.css';

export default function NyTermOpprettet({ params }: Route.ComponentProps) {
  const termId = params.termId as string;

  return (
    <section className={style.success}>
      <h2>Du har opprettet en term!</h2>
      <p>Takk for ditt bidrag til Fagord. Termen og dens oversettelse er nå lagt til i en voksende termbase.</p>
      <span className={style.buttons}>
        <Link to={`/term/${termId}`}>
          <button className="btn btn-outline-light">Gå til term</button>
        </Link>
        <Link to="/ny-term">
          <button className="btn btn-outline-light">Opprett ny term</button>
        </Link>
      </span>
    </section>
  );
}
