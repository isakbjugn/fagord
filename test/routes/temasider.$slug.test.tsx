import { createRoutesStub } from 'react-router';
import Temaside, { ErrorBoundary } from '~/routes/temasider.$slug';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, test } from 'vitest';
import { createValidArticle } from '../test-data/article';

afterEach(cleanup);

describe('Tester visning av én temaside', () => {
  function renderSide(article = createValidArticle()) {
    const Stub = createRoutesStub([
      {
        path: '/temasider/:slug',
        Component: Temaside,
        loader() {
          return article;
        },
      },
    ]);
    render(<Stub initialEntries={[`/temasider/${article.slug}`]} />);
  }

  test('Viser tittelen til temasiden', async () => {
    renderSide();
    await waitFor(() => screen.getByRole('heading', { name: 'Vin', level: 1 }));
  });

  test('Viser forfatteren til temasiden', async () => {
    renderSide();
    await waitFor(() => screen.getByText(/Isak Kyrre Lichtwarck Bjugn/));
  });

  test('Rendrer Markdown-innholdet som HTML', async () => {
    renderSide();
    // «## Rødvin» skal bli en overskrift, ikke rå tekst med skigard.
    await waitFor(() => screen.getByRole('heading', { name: 'Rødvin' }));
  });

  test('Har en lenke tilbake til temaside-listen', async () => {
    renderSide();
    const lenke = await screen.findByRole('link', { name: /Temasider/ });
    expect(lenke.getAttribute('href')).toBe('/temasider');
  });
});

describe('Tester feilhåndtering for temaside som ikke finnes', () => {
  test('ErrorBoundary viser en 404-melding ved manglende temaside', async () => {
    const Stub = createRoutesStub([
      {
        path: '/temasider/:slug',
        Component: Temaside,
        ErrorBoundary,
        loader() {
          throw new Response('Temasiden finnes ikke', { status: 404 });
        },
      },
    ]);
    render(<Stub initialEntries={['/temasider/finnes-ikke']} />);

    await waitFor(() => screen.getByText(/fant ikke/i));
  });
});
