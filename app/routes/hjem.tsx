import { Link } from 'react-router';

import { Jumbotron } from '~/lib/components/jumbotron';

export default function Hjem() {
  return (
    <section style={{ maxWidth: '1024px', margin: 'auto' }}>
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
    </section>
  );
}
