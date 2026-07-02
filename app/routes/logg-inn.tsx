import { data, Form, redirect, useActionData, useNavigation } from 'react-router';
import type { MetaFunction } from 'react-router';

import type { Route } from './+types/logg-inn';
import { createSession } from '~/lib/session.server';

export const meta: MetaFunction = () => [{ title: 'Logg inn – Fagord' }];

// Innlogging skjer i to steg i samme rute:
//   1. «magic»  – be om en engangskode (sendes til e-posten, logges i dev).
//   2. «verify» – tast inn koden; ved suksess settes sesjons-cookien.
// Vi skiller stegene med et skjult `intent`-felt framfor to egne ruter. Da følger
// e-posten fra steg 1 naturlig med inn i steg 2 (skjult felt), uten mellomlagring.

type ActionData = { steg: 'epost' | 'kode'; epost?: string; feil?: string };

export const action = async ({ request }: Route.ActionArgs) => {
  const skjema = await request.formData();
  const intent = skjema.get('intent');
  const epost = String(skjema.get('epost') ?? '').trim();

  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';

  if (intent === 'magic') {
    if (!epost) {
      return data<ActionData>({ steg: 'epost', feil: 'Skriv inn e-postadressen din.' }, { status: 400 });
    }

    // API-et svarer alltid 202 – også for ukjente e-poster – så vi kan ikke og
    // skal ikke røpe om adressen finnes. Vi går videre til kode-steget uansett.
    await fetch(`${FAGORD_RUST_API_URL}/auth/magic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: epost }),
    });

    return data<ActionData>({ steg: 'kode', epost });
  }

  if (intent === 'verify') {
    const kode = String(skjema.get('kode') ?? '').trim();
    if (!kode) {
      return data<ActionData>({ steg: 'kode', epost, feil: 'Skriv inn koden fra e-posten.' }, { status: 400 });
    }

    const respons = await fetch(`${FAGORD_RUST_API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: epost, code: kode }),
    });

    // Alle feil (ukjent e-post, feil/utløpt kode, for mange forsøk) svarer 401.
    // Vi speiler det med én felles melding – API-et røper med vilje ikke mer.
    if (!respons.ok) {
      return data<ActionData>(
        { steg: 'kode', epost, feil: 'Koden var ugyldig eller utløpt. Prøv igjen.' },
        { status: 401 },
      );
    }

    const { session_token, expires_at } = (await respons.json()) as { session_token: string; expires_at: string };
    const setCookieHeader = await createSession(request, session_token, expires_at);

    return redirect('/temasider', {
      headers: { 'Set-Cookie': setCookieHeader },
    });
  }

  return data<ActionData>({ steg: 'epost', feil: 'Ukjent handling.' }, { status: 400 });
};

export default function LoggInn() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const sender = navigation.state === 'submitting';

  const isOnVerifyStep = actionData?.steg === 'kode';

  return (
    <main className="container my-3">
      <div className="col-12 col-lg-6 mx-auto" style={{ color: 'white' }}>
        <h1>Logg inn</h1>

        {isOnVerifyStep ? (
          <>
            <p>
              Vi har sendt en engangskode til <strong>{actionData.epost}</strong>. Skriv den inn her for å logge inn.
            </p>
            <Form method="post">
              <input type="hidden" name="intent" value="verify" />
              <input type="hidden" name="epost" value={actionData.epost} />

              <div className="mb-3">
                <label className="form-label" htmlFor="kode">
                  Engangskode
                </label>
                <input
                  id="kode"
                  name="kode"
                  className={`form-control${actionData?.feil ? ' is-invalid' : ''}`}
                  type="text"
                  autoComplete="one-time-code"
                  autoFocus
                  required
                />
                {actionData?.feil && <div className="invalid-feedback">{actionData.feil}</div>}
              </div>

              <button className="btn btn-light" disabled={sender}>
                {sender && <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />}
                Logg inn
              </button>
            </Form>
          </>
        ) : (
          <>
            <p>Skriv inn e-postadressen din, så sender vi deg en engangskode du taster inn her.</p>
            <Form method="post">
              <input type="hidden" name="intent" value="magic" />

              <div className="mb-3">
                <label className="form-label" htmlFor="epost">
                  E-post
                </label>
                <input
                  id="epost"
                  name="epost"
                  className={`form-control${actionData?.feil ? ' is-invalid' : ''}`}
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                />
                {actionData?.feil && <div className="invalid-feedback">{actionData.feil}</div>}
              </div>

              <button className="btn btn-light" disabled={sender}>
                {sender && <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />}
                Send meg en kode
              </button>
            </Form>
          </>
        )}
      </div>
    </main>
  );
}
