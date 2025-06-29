import { createRoutesStub } from 'react-router';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Endre from '~/routes/term.$termId.endre';
import NyTerm from '~/routes/ny-term.($term)';

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
      },
      {
        path: '/ny-term/legg-til',
        Component: Endre,
        action: actionSpy,
      },
    ]);

    render(<Stub initialEntries={['/ny-term']} />);

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
      },
      {
        path: `/ny-term/:term/legg-til`,
        Component: Endre,
        action: actionSpy,
      },
    ]);

    render(<Stub initialEntries={[`/ny-term/${termFromUrl}`]} />);

    await userEvent.click(screen.getByText('Legg til term'));

    expect(actionSpy).toHaveBeenCalled();

    const formData = await actionSpy.mock.results[0].value;
    expect(formData).toHaveProperty('en', termFromUrl);
  });
});
