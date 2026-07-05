import { Form, redirect, useNavigation } from 'react-router';
import type { MetaFunction } from 'react-router';

import type { Route } from './+types/logg-ut';
import { getSession, isLoggedIn, logOut } from '~/lib/session.server';

export const meta: MetaFunction = () => [{ title: 'Logg ut – Fagord' }];

// Utlogging er en tilstandsendring, og hører derfor hjemme i en `action` (POST), ikke i
// en `loader` (GET). GET-navigasjon utløses av prefetch, crawlere og nettleserens
// spekulative henting – da risikerte vi å logge folk ut ved et uhell. Nå er flyten:
//   1. Header-lenken navigerer hit (GET) → loaderen viser en bekreftelsesside.
//   2. Brukeren trykker «Logg ut» → <Form method="post"> treffer actionen, som gjør
//      den faktiske utloggingen.

// GET: er brukeren i det hele tatt innlogget? Hvis ikke har bekreftelsessiden ingen
// hensikt, og vi sender dem rett til /hjem.
export const loader = async ({ request }: Route.LoaderArgs) => {
  if (!(await isLoggedIn(request))) {
    return redirect('/hjem');
  }
  return null;
};

// POST: selve utloggingen. To ting må skje:
//   1. Rust invaliderer sesjonsraden (POST /auth/logout med Bearer-token), slik at
//      tokenet blir verdiløst selv om noen skulle ha kopiert det.
//   2. Vi sletter cookien lokalt og sender brukeren til /hjem.
export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request);
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

  const setCookieHeader = await logOut(request);
  return redirect('/hjem', {
    headers: { 'Set-Cookie': setCookieHeader },
  });
};

export default function LoggUt() {
  const navigation = useNavigation();
  const sender = navigation.state === 'submitting';

  return (
    <main className="container my-3">
      <div className="col-12 col-lg-6 mx-auto" style={{ color: 'white' }}>
        <h1>Logg ut</h1>
        <p>Er du sikker på at du vil logge ut?</p>
        <Form method="post">
          <button className="btn btn-light" disabled={sender}>
            {sender && <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />}
            Logg ut
          </button>
        </Form>
      </div>
    </main>
  );
}
