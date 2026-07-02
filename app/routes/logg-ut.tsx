import { redirect } from 'react-router';

import type { Route } from './+types/logg-ut';
import { hentSesjon, loggUt } from '~/lib/session.server';

// Utlogging via loader – kjører på vanlig GET-navigasjon, så header-lenken (en NavLink)
// treffer den direkte. To ting må skje:
//   1. Rust invaliderer sesjonsraden (POST /auth/logout med Bearer-token), slik at
//      tokenet blir verdiløst selv om noen skulle ha kopiert det.
//   2. Vi sletter cookien lokalt og sender brukeren til /hjem.
//
// Merk: GET er egentlig ikke stedet for tilstandsendringer (prefetch/crawler kan treffe
// den). En <Form method="post"> mot en action er den strammere løsningen – verdt å bytte
// til hvis utilsiktet utlogging blir et problem.

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await hentSesjon(request);
  const token = session.get('token');

  // Be Rust invalidere sesjonen. Idempotent og «best effort»: feiler kallet (nettverk,
  // allerede utløpt), logger vi ut lokalt uansett – brukeren skal aldri bli sittende fast.
  if (token) {
    const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
    try {
      await fetch(`${FAGORD_RUST_API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignorer med vilje – den lokale utloggingen under er det som betyr noe for brukeren.
    }
  }

  const setCookieHeader = await loggUt(request);
  return redirect('/hjem', {
    headers: { 'Set-Cookie': setCookieHeader },
  });
};
