import { createRoutesStub } from 'react-router';
import { Link } from 'react-router';
import Root from '~/root';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(cleanup);

describe('Root-layout', () => {
  test('Viser Loader mens en rute laster', async () => {
    let loaderCallCount = 0;
    let resolveNavigation!: (data: unknown) => void;

    function StartPage() {
      return <Link to="/slow">Gå til slow</Link>;
    }

    function SlowPage() {
      return <p>Slow-innhold</p>;
    }

    const Stub = createRoutesStub([
      {
        Component: Root,
        children: [
          {
            path: '/',
            Component: StartPage,
          },
          {
            path: '/slow',
            Component: SlowPage,
            loader() {
              loaderCallCount++;
              return new Promise((resolve) => {
                resolveNavigation = resolve;
              });
            },
          },
        ],
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    // Vent på at startsiden rendres
    await screen.findByText('Gå til slow');

    // Trigger navigasjon til en rute med treg loader
    await userEvent.click(screen.getByText('Gå til slow'));

    // Loader skal vises mens ruten laster
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeDefined();
    });

    // Fullfør navigasjonen
    resolveNavigation({});

    // Innholdet fra den nye ruten skal vises
    await screen.findByText('Slow-innhold');
  });
});
