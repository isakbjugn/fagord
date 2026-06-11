import { createRoutesStub } from 'react-router';
import Temasider from '~/routes/temasider';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { createValidArticleSummaries } from '../test-data/article';

afterEach(cleanup);

describe('Tester innhold på og navigasjon fra Temasider-listen', () => {
  function renderListe(summaries = createValidArticleSummaries()) {
    const Stub = createRoutesStub([
      {
        path: '/temasider',
        Component: Temasider,
        loader() {
          return summaries;
        },
      },
      // Mål for lenkene – så vi kan verifisere at hver temaside lenker riktig.
      { path: '/temasider/:slug', Component: () => <div>Temaside-visning</div> },
    ]);
    render(<Stub initialEntries={['/temasider']} />);
  }

  test('Listen viser tittelen til hver temaside', async () => {
    renderListe();
    await waitFor(() => {
      screen.getByText('Vin');
      screen.getByText('Hva er en kompilator?');
    });
  });

  test('Listen viser forfatteren til hver temaside', async () => {
    renderListe();
    await waitFor(() => {
      screen.getByText('Isak Kyrre Lichtwarck Bjugn');
      screen.getByText('Ada L.');
    });
  });

  test('Hver temaside lenker til sin egen slug', async () => {
    renderListe();
    const lenke = await screen.findByRole('link', { name: /Vin/ });
    expect(lenke.getAttribute('href')).toBe('/temasider/vin');
  });

  test('Tom liste viser en beskjed om at det ikke finnes temasider', async () => {
    renderListe([]);
    await waitFor(() => screen.getByText(/ingen temasider/i));
  });
});
