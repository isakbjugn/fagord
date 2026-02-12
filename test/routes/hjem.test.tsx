import { createRoutesStub } from 'react-router';
import Hjem from '~/routes/hjem';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, test } from 'vitest';

afterEach(cleanup);

describe('Tester innhold på og navigasjon fra Hjem-siden', () => {
  test('Hjem-side viser navigasjonsknapp til termside', async () => {
    const Stub = createRoutesStub([
      {
        path: '/hjem',
        Component: Hjem,
      },
    ]);

    render(<Stub initialEntries={['/hjem']} />);

    await waitFor(() => screen.findByText('Til termliste!'));
  });

  test('Kan navigere fra /hjem til /termliste', async () => {
    function TermlistePage() {
      return <h1>Termliste</h1>;
    }
    const Stub = createRoutesStub([
      {
        path: '/hjem',
        Component: Hjem,
      },
      {
        path: '/termliste',
        Component: TermlistePage,
      },
    ]);

    render(<Stub initialEntries={['/hjem']} />);

    await userEvent.click(screen.getByText('Til termliste!'));
    await waitFor(() => screen.findByText('Termliste'));
  });
});
