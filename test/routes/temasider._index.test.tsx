import { createRoutesStub, Outlet } from 'react-router';
import Temasider from '~/routes/temasider._index';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { createValidArticleSummaries } from '../test-data/article';

afterEach(cleanup);

describe('Tester innhold på og navigasjon fra Temasider-listen', () => {
  // Komponenten leser innloggingsstatus fra root-loaderen (useRouteLoaderData('root')),
  // så vi speiler root som en foreldrerute med id 'root'. Default: innlogget, så
  // «Skriv ny»-knappen finnes i de fleste testene.
  function renderListe(summaries = createValidArticleSummaries(), isLoggedIn = true) {
    const Stub = createRoutesStub([
      {
        id: 'root',
        Component: Outlet,
        loader: () => ({ isLoggedIn }),
        children: [
          {
            path: '/temasider',
            Component: Temasider,
            loader() {
              return summaries;
            },
          },
          // Mål for «ny»-inngangen – mer spesifikk path først, så den vinner over :slug.
          { path: '/temasider/ny', Component: () => <div>Ny temaside-editor</div> },
          // Mål for lenkene – så vi kan verifisere at hver temaside lenker riktig.
          { path: '/temasider/:slug', Component: () => <div>Temaside-visning</div> },
          // Mål for rediger- og slett-inngangene per rad.
          { path: '/temasider/:slug/endre', Component: () => <div>Endre-editor</div> },
          { path: '/temasider/:slug/slett', Component: () => <div>Slett-bekreftelse</div> },
        ],
      },
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
    const lenke = await screen.findByRole('link', { name: 'Vin' });
    expect(lenke.getAttribute('href')).toBe('/temasider/vin');
  });

  test('Tittellenken strekkes over hele kortet (stretched-link)', async () => {
    renderListe();
    const lenke = await screen.findByRole('link', { name: 'Vin' });
    expect(lenke.classList.contains('stretched-link')).toBe(true);
  });

  test('Viser redigeringslenke når temasiden har «edit»-handling', async () => {
    renderListe();
    const lenke = await screen.findByRole('link', { name: /rediger vin/i });
    expect(lenke.getAttribute('href')).toBe('/temasider/vin/endre');
  });

  test('Viser ikke redigeringslenke uten «edit»-handling', async () => {
    renderListe();
    await screen.findByRole('link', { name: 'Hva er en kompilator?' });
    expect(screen.queryByRole('link', { name: /rediger hva er en kompilator/i })).toBeNull();
  });

  test('Viser slettelenke når temasiden har «delete»-handling', async () => {
    renderListe();
    const lenke = await screen.findByRole('link', { name: /slett vin/i });
    expect(lenke.getAttribute('href')).toBe('/temasider/vin/slett');
  });

  test('Viser ikke slettelenke uten «delete»-handling', async () => {
    renderListe();
    await screen.findByRole('link', { name: 'Hva er en kompilator?' });
    expect(screen.queryByRole('link', { name: /slett hva er en kompilator/i })).toBeNull();
  });

  test('Tom liste viser en beskjed om at det ikke finnes temasider', async () => {
    renderListe([]);
    await waitFor(() => screen.getByText(/ingen temasider/i));
  });

  test('Innlogget bruker har en inngang som lenker til editoren for ny temaside', async () => {
    renderListe();
    const lenke = await screen.findByRole('link', { name: /ny temaside/i });
    expect(lenke.getAttribute('href')).toBe('/temasider/ny');
  });

  test('Inngangen til ny temaside vises også når lista er tom', async () => {
    renderListe([]);
    const lenke = await screen.findByRole('link', { name: /ny temaside/i });
    expect(lenke.getAttribute('href')).toBe('/temasider/ny');
  });

  test('Utlogget bruker ser ikke inngangen til ny temaside', async () => {
    renderListe(createValidArticleSummaries(), false);
    // Vent til lista er rendret, så vi vet komponenten faktisk har lastet.
    await screen.findByText('Vin');
    expect(screen.queryByRole('link', { name: /ny temaside/i })).toBeNull();
  });
});
