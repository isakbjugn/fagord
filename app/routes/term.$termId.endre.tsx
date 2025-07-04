import { Form, Link, redirect } from 'react-router';

import type { SubmitTerm } from '~/types/term';
import type { Route } from './+types/term.$termId.endre';

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const { termId } = params;
  const submitTerm = Object.fromEntries(formData) as unknown as SubmitTerm;
  const termsApiUrl = `https://www.api.fagord.no/termer/${termId}`;

  const res = await fetch(termsApiUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(submitTerm),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  const responseBody = await res.json();
  return redirect(`/term/${responseBody._id}`);
}

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  localStorage.removeItem('terms');
  await serverAction();
}

export default function Endre() {
  return (
    <Form method="post">
      <div className="row">
        <label className="form-label" htmlFor="definition">
          Legg til/endre definisjon
          <input name="definition" placeholder="Skriv inn definisjon" className="form-control" required={true} />
        </label>
      </div>
      <span className="d-flex gap-2">
        <button className="btn btn-success">Send inn</button>
        <Link to="..">
          <button type="button" className="btn btn-outline-light">
            Lukk
          </button>
        </Link>
      </span>
    </Form>
  );
}
