import { Form, redirect, useNavigation } from 'react-router';
import type { MetaFunction } from 'react-router';

import type { Route } from './+types/logg-ut';
import { getSession, isLoggedIn, logOut } from '~/lib/session.server';

export const meta: MetaFunction = () => [{ title: 'Logg ut – Fagord' }];

export const loader = async ({ request }: Route.LoaderArgs) => {
  if (!(await isLoggedIn(request))) {
    return redirect('/hjem');
  }
  return null;
};

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request);
  const token = session.get('token');

  if (token) {
    const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
    try {
      await fetch(`${FAGORD_RUST_API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
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
