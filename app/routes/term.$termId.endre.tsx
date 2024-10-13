import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, type ClientActionFunctionArgs, Link } from '@remix-run/react';
import { Button, Label, Row } from 'reactstrap';
import type { SubmitTerm } from '~/types/term';

interface UpdateTermArguments {
  termId: string;
  term: SubmitTerm;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { termId, term } = Object.fromEntries(formData) as unknown as UpdateTermArguments;
  const termsApiUrl = `https://www.api.fagord.no/termer/${termId}`;

  const res = await fetch(termsApiUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(term),
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
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
