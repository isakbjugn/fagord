import { createRoutesStub, useSearchParams } from 'react-router';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import Root from '~/root';
import { createValidTerms } from '../test-data/term';

afterEach(cleanup);

describe('Tester søkefunksjonalitet', () => {
  test('Viser søkeresultater når API-et returnerer treff', async () => {
    const searchResults = createValidTerms().slice(0, 2);

    const Stub = createRoutesStub([
      {
        path: '/',
        Component: Root,
        children: [
          {
            index: true,
            Component: () => <div>Testside</div>,
          },
        ],
      },
      {
        path: '/api/termliste/søk',
        loader() {
          return searchResults;
        },
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    const searchInput = screen.getByPlaceholderText('Søk etter term');
    await userEvent.type(searchInput, 'cortex');

    await waitFor(() => screen.findByText('cortex'));
    await waitFor(() => screen.findByText('hjernebark'));
  });

  test('Viser "Opprett ny term" når søket ikke gir treff', async () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: Root,
        children: [
          {
            index: true,
            Component: () => <div>Testside</div>,
          },
        ],
      },
      {
        path: '/api/termliste/søk',
        loader() {
          return [];
        },
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    const searchInput = screen.getByPlaceholderText('Søk etter term');
    await userEvent.type(searchInput, 'ukjentterm');

    await waitFor(() => screen.findByText('Opprett ny term'));
  });

  test('Søkeresultat lenker til riktig termside', async () => {
    const searchResults = createValidTerms().slice(0, 1);

    const Stub = createRoutesStub([
      {
        path: '/',
        Component: Root,
        children: [
          {
            index: true,
            Component: () => <div>Testside</div>,
          },
        ],
      },
      {
        path: '/api/termliste/søk',
        loader() {
          return searchResults;
        },
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    const searchInput = screen.getByPlaceholderText('Søk etter term');
    await userEvent.type(searchInput, 'cortex');

    await waitFor(() => screen.findByText('cortex'));

    // Verifiser at lenken peker til riktig sted
    const resultLink = screen.getByRole('link', { name: /cortex/i, hidden: true });
    expect(resultLink.getAttribute('href')).toBe('/term/cortex_sub');
  });

  test('"Opprett ny term"-knappen lenker til riktig side', async () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: Root,
        children: [
          {
            index: true,
            Component: () => <div>Testside</div>,
          },
        ],
      },
      {
        path: '/api/termliste/søk',
        loader() {
          return [];
        },
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    const searchInput = screen.getByPlaceholderText('Søk etter term');
    await userEvent.type(searchInput, 'nyterm');

    await waitFor(() => screen.findByText('Opprett ny term'));

    // Verifiser at lenken peker til riktig sted
    const createLink = screen.getByRole('link', { name: /Opprett ny term/i, hidden: true });
    expect(createLink.getAttribute('href')).toBe('/ny-term/nyterm');
  });

  test('Navigerer til termliste med søkeparameter når brukeren trykker Enter', async () => {
    function TermlistePage() {
      const [searchParams] = useSearchParams();
      return <div>Termliste: q={searchParams.get('q')}</div>;
    }

    const Stub = createRoutesStub([
      {
        path: '/',
        Component: Root,
        children: [
          {
            index: true,
            Component: () => <div>Testside</div>,
          },
          {
            path: 'termliste',
            Component: TermlistePage,
          },
        ],
      },
      {
        path: '/api/termliste/søk',
        loader() {
          return [];
        },
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    const searchInput = screen.getByPlaceholderText('Søk etter term');
    await userEvent.type(searchInput, 'testsøk{Enter}');

    await waitFor(() => screen.findByText('Termliste: q=testsøk'));
  });
});
