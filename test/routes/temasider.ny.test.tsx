import { createRoutesStub } from 'react-router';
import NyTemaside from '~/routes/temasider.ny';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, test } from 'vitest';

afterEach(cleanup);

describe('Tester redigeringsverktøy for ny temaside', () => {
  function renderSide() {
    const Stub = createRoutesStub([{ path: '/temasider/ny', Component: NyTemaside }]);
    render(<Stub initialEntries={['/temasider/ny']} />);
  }

  test('Siden viser tittel-felt og innholds-felt', async () => {
    renderSide();
    await waitFor(() => {
      screen.getByLabelText('Tittel');
      screen.getByLabelText('Innhold (Markdown)');
    });
  });

  test('Tittel i forhåndsvisningen oppdateres når tittelfeltet fylles inn', async () => {
    renderSide();
    await userEvent.type(await screen.findByLabelText('Tittel'), 'Hva er en kompilator?');
    await waitFor(() => screen.getByRole('heading', { name: 'Hva er en kompilator?' }));
  });

  test('Markdown-innhold rendres i forhåndsvisningen', async () => {
    renderSide();
    const editor = await screen.findByLabelText('Innhold (Markdown)');
    await userEvent.clear(editor);
    await userEvent.type(editor, '**fet tekst**');
    await waitFor(() => screen.getByText('fet tekst'));
  });
});
