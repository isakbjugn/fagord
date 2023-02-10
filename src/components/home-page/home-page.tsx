import { Link } from 'react-router-dom';
import Jumbotron from '../common/jumbotron/jumbotron';
import { Articles } from './articles/articles';

const Home = (): JSX.Element => {
  const showArticles = process.env.NODE_ENV === 'development';

  return (
    <div>
      <Jumbotron>
        <h1 className="display-4">Velkommen til Fagord!</h1>
        <p className="lead">
          Fagord er din kilde til norske fagtermer! Innen fagfelt som IT,
          nanoteknologi og molekylærbiologi løper utviklingen langt raskere enn
          norske oversettelser kommer.
        </p>
        <p>Her finner du nye termer, og kan foreslå egne!</p>
        <Link className="btn btn-success btn-lg" to="/termliste" role="button">
          Til termliste!
        </Link>
      </Jumbotron>
      {showArticles && <Articles />}
    </div>
  );
};

export default Home;
