import { Link } from 'react-router';
import { Button } from 'reactstrap';

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
          <Button outline color="light">
            Gå til term
          </Button>
        </Link>
        <Link to="/ny-term">
          <Button outline color="light">
            Opprett ny term
          </Button>
        </Link>
      </span>
    </section>
  );
}
