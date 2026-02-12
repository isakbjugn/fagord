import { createRoutesStub } from 'react-router';
import Termliste from '~/routes/termliste._index';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, test } from 'vitest';
import { createValidTerms } from '../test-data/term';

afterEach(cleanup);

describe('Tester innhold på og navigasjon fra Termliste-siden', () => {
  test('Termlisten inneholder engelske termer og norske oversettelser', async () => {
    const Stub = createRoutesStub([
      {
        path: '/termliste',
        Component: Termliste,
        loader() {
          return {
            terms: createValidTerms(),
            subjects: [],
          };
        },
      },
    ]);

    render(<Stub initialEntries={['/termliste']} />);

    await waitFor(() => screen.findByText('cortex'));
    await waitFor(() => screen.findByText('hjernebark'));
    await waitFor(() => screen.findByText('hjernebork'));
  });
});
