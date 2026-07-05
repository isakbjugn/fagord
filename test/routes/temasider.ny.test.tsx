import { createRoutesStub } from 'react-router';
import NyTemaside, { action, ErrorBoundary, loader } from '~/routes/temasider.ny';
import * as session from '~/lib/session.server';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Tester redigeringsverktøy for ny temaside', () => {
  function renderSide() {
    const Stub = createRoutesStub([
      { path: '/temasider/ny', Component: NyTemaside },
      // Mål for breadcrumb-lenken tilbake til lista.
      { path: '/temasider', Component: () => <div>Temaside-lista</div> },
    ]);
    render(<Stub initialEntries={['/temasider/ny']} />);
  }

  test('Har en breadcrumb-lenke tilbake til temaside-lista', async () => {
    renderSide();
    const lenke = await screen.findByRole('link', { name: 'Temasider' });
    expect(lenke.getAttribute('href')).toBe('/temasider');
  });

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

  test('Viser feilsiden når brukeren ikke er innlogget', async () => {
    // Ekte loader + ErrorBoundary. Stubbens request har ingen sesjons-cookie,
    // så isLoggedIn er falsk og loaderen kaster 401 før skjemaet vises.
    const Stub = createRoutesStub([{ path: '/temasider/ny', Component: NyTemaside, ErrorBoundary, loader }]);
    render(<Stub initialEntries={['/temasider/ny']} />);

    await waitFor(() => screen.getByRole('heading', { name: /ikke innlogget/i }));
    expect(screen.queryByLabelText('Tittel')).toBeNull();
  });

  test('Loaderen slipper gjennom når brukeren er innlogget', async () => {
    // Vi tester loaderens forgrening, ikke cookie-mekanismen (den er dekket i
    // session.server). Derfor stubber vi isLoggedIn til å svare true.
    vi.spyOn(session, 'isLoggedIn').mockResolvedValue(true);
    const request = new Request('http://localhost/temasider/ny');

    const result = await loader({ request } as Parameters<typeof loader>[0]);
    expect(result).toBeNull();
  });

  test('Innsending kaller POST /articles og redirecter til den nye temasiden', async () => {
    // Ekte action med mocket fetch, så vi verifiserer selve POST-kroppen og redirecten.
    const fetchMock = vi.fn(
      async (_url: string, _init: RequestInit) => new Response(JSON.stringify({ slug: 'ny-side' }), { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const formData = new FormData();
    formData.set('tittel', 'Ny side');
    formData.set('innhold', '# Ny side');
    const request = new Request('http://localhost/temasider/ny', { method: 'POST', body: formData });

    // action-en bruker kun `request`; vi caster ved grensen siden createRoutesStub/typegen
    // ellers krever hele args-formen (params, url, pattern ...).
    const response = await action({ request } as Parameters<typeof action>[0]);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/articles$/);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ title: 'Ny side', content: '# Ny side' });

    // redirect() gir en Response med Location-header til den nye slug-en.
    expect(response.headers.get('Location')).toBe('/temasider/ny-side');
  });
});
