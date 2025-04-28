import type { ActionFunctionArgs } from '@remix-run/node';
import type { ClientActionFunctionArgs } from '@remix-run/react';
import { Form, Link, redirect } from '@remix-run/react';
import { Button, Label, Row } from 'reactstrap';

import type { SubmitTerm } from '~/types/term';

export async function action({ request, params }: ActionFunctionArgs) {
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

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  localStorage.removeItem('terms');
  await serverAction();
}

export default function Endre() {
  return (
    <Form method="post">
      <Row>
        <Label>
          <input name="definition" placeholder="Skriv inn definisjon" className="form-control" required={true} />
        </Label>
      </Row>
      <Button color="success">Send inn</Button>
      <Link to="..">
        <Button type="button" outline color="light">
          Lukk
        </Button>
      </Link>
    </Form>
  );
}
