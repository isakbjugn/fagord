import { createRoutesStub } from 'react-router';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';

import { Header } from '~/lib/components/header';

afterEach(cleanup);

// Henter <svg>-elementet via det tilgjengelige navnet <title>Fagord</title>.
const hentLogo = () => screen.getByRole('img', { name: 'Fagord' });

describe('Header', () => {
  test('logoen er uten animasjonsklasse når ingenting laster', () => {
    const Stub = createRoutesStub([{ path: '/', Component: Header }]);
    render(<Stub initialEntries={['/']} />);

    // I ro skal className være tom (isLoading = false gir undefined).
    expect(hentLogo().getAttribute('class')).toBeFalsy();
  });

  test('logoen får animasjonsklasse mens en rute laster, og mister den igjen etterpå', async () => {
    let resolveNavigation!: (data: unknown) => void;

    const Stub = createRoutesStub([
      {
        path: '/',
        Component: Header,
      },
      {
        // Header vises fortsatt, men navigasjonen henger til vi resolver.
        path: '/termliste',
        Component: Header,
        loader() {
          return new Promise((resolve) => {
            resolveNavigation = resolve;
          });
        },
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    // I utgangspunktet: ingen klasse.
    expect(hentLogo().getAttribute('class')).toBeFalsy();

    // Klikk på den faste navlenken «Termliste». navigation.state blir 'loading'.
    await userEvent.click(screen.getByRole('link', { name: /Termliste/ }));

    // Mens ruten laster skal logoen ha fått en (modul-scopet) klasse.
    await waitFor(() => {
      expect(hentLogo().getAttribute('class')).toBeTruthy();
    });

    // Når navigasjonen fullføres, forsvinner klassen igjen.
    resolveNavigation({});
    await waitFor(() => {
      expect(hentLogo().getAttribute('class')).toBeFalsy();
    });
  });
});
