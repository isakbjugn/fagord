import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import style from '~/src/pages/new-term-page/new-term-page.module.css';
import { Button } from 'reactstrap';

export const loader: LoaderFunction = ({ params }: LoaderFunctionArgs) => {
  return json({ termId: params.termId })
}

export default function NyTermOpprettet() {
  const { termId } = useLoaderData<typeof loader>();

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
  )
}
