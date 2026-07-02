// Sesjonshåndtering for Fagord-appen.
//
// `.server.ts`-suffikset garanterer at denne fila aldri havner i klient-bundelen –
// viktig fordi SESSION_SECRET aldri skal lekke til nettleseren.
//
// Den reelle sikkerhetsgrensen er Rust-API-et. Cookien her lagrer bare sesjonstokenet
// vi fikk fra /auth/verify, signert så det ikke kan forfalskes. På hvert skrivekall
// sender vi tokenet tilbake som `Authorization: Bearer <token>`, og Rust slår det opp.

import { createCookieSessionStorage } from 'react-router';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SECRET må være satt i produksjon.');
}

// Formen på det vi lagrer i cookien. Kun sesjonstokenet foreløpig; navn/e-post kommer
// når backend utvider /auth/verify-svaret.
type SesjonData = {
  token: string;
};

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SesjonData>({
  cookie: {
    name: '__session',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    secrets: [sessionSecret ?? 'session-secret-dev-only'],
  },
});

/** Leser og verifiserer sesjonen fra en innkommende request. */
export async function hentSesjon(request: Request) {
  return getSession(request.headers.get('Cookie'));
}

/** Sant hvis requesten har et sesjonstoken. Brukes til å vise «Logg inn» vs. navn i UI. */
export async function erInnlogget(request: Request): Promise<boolean> {
  const session = await hentSesjon(request);
  return session.has('token');
}

/**
 * Oppretter en sesjon: lagrer tokenet i cookien og returnerer en `Set-Cookie`-header.
 * `expiresAt` er ISO-strengen fra Rust; vi regner om til maxAge (sekunder fra nå).
 */
export async function opprettSesjon(request: Request, token: string, expiresAt: string): Promise<string> {
  const session = await hentSesjon(request);
  session.set('token', token);
  const maxAge = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
  return commitSession(session, { maxAge });
}

/** Sletter sesjonen. Returnerer en `Set-Cookie`-header som fjerner cookien i nettleseren. */
export async function loggUt(request: Request): Promise<string> {
  const session = await hentSesjon(request);
  return destroySession(session);
}
