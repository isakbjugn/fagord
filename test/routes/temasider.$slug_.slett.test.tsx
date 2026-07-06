import { createRoutesStub } from 'react-router';
import SlettTemaside, { ErrorBoundary, loader } from '~/routes/temasider.$slug_.slett';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createArticleWithDeleteAccess, createValidArticle } from '../test-data/article';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Kjører den EKTE loaderen (ikke en stub som bare kaster), så det er vår actions-sjekk
// som faktisk testes. `fetch` mockes til å svare med en artikkel – tilgangen avgjøres
// av om svaret inneholder «delete» i actions.
function renderMedArtikkel(article: ReturnType<typeof createValidArticle>) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(article), { status: 200 })),
  );

  const Stub = createRoutesStub([
    {
      path: '/temasider/:slug/slett',
      Component: SlettTemaside,
      ErrorBoundary,
      // createRoutesStub kjenner ikke rutens param-form, så vi caster ved grensen.
      loader: (args) => loader(args as Parameters<typeof loader>[0]),
    },
  ]);
  render(<Stub initialEntries={[`/temasider/${article.slug}/slett`]} />);
}

describe('Tester tilgangsstyring på slett-siden for temasider', () => {
  test('Viser feilsiden når brukeren mangler «delete»-tilgang', async () => {
    // Har «edit», men ikke «delete» – bekrefter at vakten sjekker nettopp «delete».
    renderMedArtikkel(createValidArticle());

    await waitFor(() => screen.getByRole('heading', { name: /ingen tilgang/i }));
    // Bekreftelsen skal aldri rendres for en bruker uten tilgang.
    expect(screen.queryByRole('button', { name: /slett temasiden/i })).toBeNull();
  });

  test('Viser bekreftelsen når brukeren har «delete»-tilgang', async () => {
    renderMedArtikkel(createArticleWithDeleteAccess());

    await waitFor(() => screen.getByRole('button', { name: /slett temasiden/i }));
    expect(screen.queryByRole('heading', { name: /ingen tilgang/i })).toBeNull();
  });
});
