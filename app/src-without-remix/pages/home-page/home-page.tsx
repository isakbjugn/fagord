import { Jumbotron } from '~/src-without-remix/components/jumbotron/jumbotron';
import style from './home-page.module.css';
import { Link } from '@remix-run/react';
import { featureToggles } from '~/src-without-remix/utils/feature-toggles.client';
import { ArticleGrid } from '~/src-without-remix/components/article-grid/article-grid';

export const HomePage = (): JSX.Element => (
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
    {featureToggles('articles') && <ArticleGrid />}
  </main>
);
