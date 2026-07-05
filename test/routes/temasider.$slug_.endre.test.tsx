import { createRoutesStub } from 'react-router';
import EndreTemaside, { ErrorBoundary, loader } from '~/routes/temasider.$slug_.endre';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createArticleWithoutEditAccess, createValidArticle } from '../test-data/article';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Kjører den EKTE loaderen (ikke en stub som bare kaster), så det er vår actions-sjekk
// som faktisk testes. `fetch` mockes til å svare med en artikkel – tilgangen avgjøres
// av om svaret inneholder «edit» i actions.
function renderMedArtikkel(article: ReturnType<typeof createValidArticle>) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(article), { status: 200 })),
  );

  const Stub = createRoutesStub([
    {
      path: '/temasider/:slug/endre',
      Component: EndreTemaside,
      ErrorBoundary,
      // createRoutesStub kjenner ikke rutens param-form, så vi caster ved grensen.
      loader: (args) => loader(args as Parameters<typeof loader>[0]),
    },
  ]);
  render(<Stub initialEntries={[`/temasider/${article.slug}/endre`]} />);
}

describe('Tester tilgangsstyring på endre-siden for temasider', () => {
  test('Viser feilsiden når brukeren mangler «edit»-tilgang', async () => {
    renderMedArtikkel(createArticleWithoutEditAccess());

    await waitFor(() => screen.getByRole('heading', { name: /ingen tilgang/i }));
    // Skjemaet skal aldri rendres for en bruker uten tilgang.
    expect(screen.queryByRole('button', { name: /lagre endringer/i })).toBeNull();
  });

  test('Viser redigeringsskjemaet når brukeren har «edit»-tilgang', async () => {
    renderMedArtikkel(createValidArticle());

    await waitFor(() => screen.getByRole('button', { name: /lagre endringer/i }));
    expect(screen.queryByRole('heading', { name: /ingen tilgang/i })).toBeNull();
  });
});
