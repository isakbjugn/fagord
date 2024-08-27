import style from '~/styles/_index.module.css';
import { Jumbotron } from '~/src/components/jumbotron/jumbotron';
import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <main className={style.home}>
      <Jumbotron>
        <h1 className="display-4">Velkommen til Fagord!</h1>
        <p className="lead">
          Fagord er din kilde til norske fagtermer! Innen fagfelt som IT, nanoteknologi og molekylærbiologi løper
          utviklingen langt raskere enn norske oversettelser kommer.
        </p>
        <p>Her finner du nye termer, og kan foreslå egne!</p>
        <Link className="btn btn-success btn-lg" to="/termliste" role="button">
          Til termliste!
        </Link>
      </Jumbotron>
    </main>
  );
}
