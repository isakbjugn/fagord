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
    const term = createValidTerms().find((term) => term.slug === termId)!;
    const newDefinition = 'Dette er en mer passende definisjon';

    const actionSpy = vi.fn(async ({ request }) => {
      const formData = await request.formData();
      return Object.fromEntries(formData);
    });

    const Stub = createRoutesStub([
      {
        path: `/term/${termId}`,
        id: 'routes/term.$termId',
        Component: Term,
        loader() {
          return term;
        },
        children: [
          {
            path: 'endre',
            Component: Endre,
            action: actionSpy,
          },
        ],
      },
    ]);

    render(<Stub initialEntries={[`/term/${termId}/endre`]} />);

    const definitionField = await screen.findByLabelText<HTMLTextAreaElement>('Legg til/endre definisjon');

    // Feltet skal være forhåndsutfylt med termens nåværende definisjon
    expect(definitionField.value).toBe(term.definition);

    await userEvent.clear(definitionField);
    await userEvent.type(definitionField, newDefinition);
    await userEvent.click(screen.getByText('Send inn'));

    expect(actionSpy).toHaveBeenCalled();

    const formData = await actionSpy.mock.results[0].value;
    expect(formData).toEqual({
      definition: newDefinition,
    });
  });
});
