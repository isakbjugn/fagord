import { createRoutesStub } from 'react-router';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Endre from '~/routes/term.$termId.endre';
import NyTerm from '~/routes/ny-term.($term)';
import { createValidSubjects } from '../test-data/subjects';

afterEach(cleanup);

describe('Tester innsending på Ny term-siden', () => {
  test('Sender inn engelsk term når Legg til term-knappen trykkes på', async () => {
    const newTerm = 'novelty';

    const actionSpy = vi.fn(async ({ request }) => {
      const formData = await request.formData();
      return Object.fromEntries(formData);
    });

    const Stub = createRoutesStub([
      {
        path: '/ny-term',
        Component: NyTerm,
        loader: () => ({
          subjects: createValidSubjects(),
        }),
      },
      {
        path: '/ny-term/legg-til',
        Component: Endre,
        action: actionSpy,
      },
    ]);

    render(<Stub initialEntries={['/ny-term']} />);

    await waitFor(() => screen.findByText('Engelsk term'));
    await userEvent.type(screen.getByLabelText('Engelsk term'), newTerm);
    await userEvent.click(screen.getByText('Legg til term'));

    expect(actionSpy).toHaveBeenCalled();

    const formData = await actionSpy.mock.results[0].value;
    expect(formData).toHaveProperty('en', newTerm);
  });

  test('Bruker term i URL som default-verdi for engelsk term', async () => {
    const termFromUrl = 'innovation';

    const actionSpy = vi.fn(async ({ request }) => {
      const formData = await request.formData();
      return Object.fromEntries(formData);
    });

    const Stub = createRoutesStub([
      {
        path: `/ny-term/:term`,
        Component: NyTerm,
        loader: () => ({
          subjects: createValidSubjects(),
        }),
      },
      {
        path: `/ny-term/:term/legg-til`,
        Component: Endre,
        action: actionSpy,
      },
    ]);

    render(<Stub initialEntries={[`/ny-term/${termFromUrl}`]} />);

    await waitFor(() => screen.findByText('Legg til term'));
    await userEvent.click(screen.getByText('Legg til term'));

    expect(actionSpy).toHaveBeenCalled();

    const formData = await actionSpy.mock.results[0].value;
    expect(formData).toHaveProperty('en', termFromUrl);
  });

  test('Dagens oppførsel: Viser IKKE definisjon ved sidelast selv om term er i URL', async () => {
    const termFromUrl = 'letter';
    const definition = '<p>a written message</p>';

    const Stub = createRoutesStub([
      {
        path: `/ny-term/:term`,
        Component: NyTerm,
        loader: () => ({
          subjects: createValidSubjects(),
        }),
      },
      {
        path: '/api/definisjon',
        action: () => definition,
      },
    ]);

    render(<Stub initialEntries={[`/ny-term/${termFromUrl}`]} />);

    await waitFor(() => screen.findByText('Engelsk term'));
    expect(screen.queryByText('Definisjon')).toBeNull();
  });

  test('Ønsket oppførsel: Viser definisjon ved sidelast når loader returnerer den', async () => {
    const termFromUrl = 'letter';
    const definition = '<p>a written message</p>';

    const Stub = createRoutesStub([
      {
        path: `/ny-term/:term`,
        Component: NyTerm,
        loader: () => ({
          subjects: createValidSubjects(),
          definition,
        }),
      },
    ]);

    render(<Stub initialEntries={[`/ny-term/${termFromUrl}`]} />);

    await waitFor(() => screen.findByText('Engelsk term'));
    expect(screen.getByText('Definisjon')).toBeDefined();
    expect(screen.getByText('a written message')).toBeDefined();
  });

  test('Viser definisjon etter at brukeren skriver inn en engelsk term', async () => {
    const definition = '<p>a written message</p>';

    const Stub = createRoutesStub([
      {
        path: '/ny-term',
        Component: NyTerm,
        loader: () => ({
          subjects: createValidSubjects(),
          definition: null,
        }),
      },
      {
        path: '/api/definisjon',
        action: () => definition,
      },
      {
        path: '/api/termliste/finnes',
        action: () => ({ exists: false, validationText: undefined }),
      },
    ]);

    render(<Stub initialEntries={['/ny-term']} />);

    await waitFor(() => screen.findByText('Engelsk term'));
    expect(screen.queryByText('Definisjon')).toBeNull();

    await userEvent.type(screen.getByLabelText('Engelsk term'), 'letter');
    await waitFor(() => screen.findByText('Definisjon'));
    expect(screen.getByText('a written message')).toBeDefined();
  });

  test('Viser valideringstekst når term allerede finnes', async () => {
    const existingTerm = 'existence';
    const validationText = 'Termen finnes allerede i termlista.';

    const Stub = createRoutesStub([
      {
        path: '/ny-term',
        Component: NyTerm,
        loader: () => ({
          subjects: createValidSubjects(),
        }),
      },
      {
        path: '/api/termliste/finnes',
        action() {
          return {
            exists: true,
            validationText,
          };
        },
      },
    ]);

    render(<Stub initialEntries={['/ny-term']} />);

    await waitFor(() => screen.findByText('Engelsk term'));
    await userEvent.type(screen.getByLabelText('Engelsk term'), existingTerm);
    await waitFor(() => screen.findByText(validationText));
  });
});
