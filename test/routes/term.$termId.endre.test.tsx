import { createRoutesStub } from 'react-router';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createValidTerms } from '../test-data/term';
import Term from '~/routes/term.$termId';
import Endre from '~/routes/term.$termId.endre';

afterEach(cleanup);

describe('Tester innsending på Endre-siden', () => {
  test('Sender inn definisjon når Send inn-knappen trykkes på', async () => {
    const termId = 'cortex_sub';
    const newDefinition = 'Dette er en mer passende definisjon';

    const actionSpy = vi.fn(async ({ request }) => {
      const formData = await request.formData();
      return Object.fromEntries(formData);
    });

    const Stub = createRoutesStub([
      {
        path: `/term/${termId}`,
        Component: Term,
        loader() {
          return {
            terms: createValidTerms(),
            term: createValidTerms().find((term) => term._id === termId),
          };
        },
      },
      {
        path: `/term/${termId}/endre`,
        Component: Endre,
        action: actionSpy,
      },
    ]);

    render(<Stub initialEntries={[`/term/${termId}/endre`]} />);

    await userEvent.type(screen.getByLabelText('Legg til/endre definisjon'), newDefinition);
    await userEvent.click(screen.getByText('Send inn'));

    expect(actionSpy).toHaveBeenCalled();

    const formData = await actionSpy.mock.results[0].value;
    expect(formData).toEqual({
      definition: newDefinition,
    });
  });
});
