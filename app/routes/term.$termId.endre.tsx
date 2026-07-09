import { Form, Link, redirect, useRouteLoaderData } from 'react-router';

import type { ChangeDefinition, Term } from '~/types/term';
import type { Route } from './+types/term.$termId.endre';

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const { termId } = params;
  const changeDefinition = Object.fromEntries(
    Object.entries(Object.fromEntries(formData)).filter(([_, v]) => v !== ''),
  ) as unknown as ChangeDefinition;

  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const termsApiUrl = `${FAGORD_RUST_API_URL}/terms/${termId}/definition`;

  const res = await fetch(termsApiUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(changeDefinition),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return redirect(`/term/${termId}`);
}

export default function Endre() {
  const termData = useRouteLoaderData<Term>('routes/term.$termId');

  if (!termData)
    return (
      <Link to="..">
        <button type="button" className="btn btn-outline-light">
          Lukk
        </button>
      </Link>
    );

  return (
    <Form method="post">
      <div className="row">
        <label className="form-label" htmlFor="definition">
          Legg til/endre definisjon
          <textarea
            name="definition"
            id="definition"
            rows={4}
            placeholder="Skriv inn definisjon"
            defaultValue={termData.definition}
            className="form-control"
            required
          />
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
