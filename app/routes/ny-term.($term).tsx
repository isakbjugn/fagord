import { Form, useLoaderData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { ActionFunction, ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import type { Term } from '~/types/term';

export const loader: LoaderFunction = ({ params }: LoaderFunctionArgs) => {
  return json({ termFromUrl: params.term })
}

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const termsUrl = 'https://api.fagord.no/termer/';
  const newTerm: Term = await fetch(termsUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData))
  })
    .then(res => {
      if (!res.ok) {
        throw Error(res.status.toString() + ' ' + res.statusText);
      }
      return res.json();
    });
  return redirect(`/ny-term/${newTerm._id}/opprettet`);
}

export default function NyTerm() {
  const { termFromUrl } = useLoaderData<typeof loader>();

  return (
    <Form method="post">
      <h2>Legg til ny term</h2>
      <div>

        <label htmlFor="en">Engelsk term</label>
        <input
          name="en"
          defaultValue={termFromUrl}
          type="text"
          autoCapitalize="none"
        />

        <label htmlFor="pos">Ordklasse</label>
        <select name="pos">
          <option>substantiv</option>
          <option>verb</option>
          <option>adjektiv</option>
          <option>pronomen</option>
          <option>determinativ</option>
          <option>preposisjon</option>
          <option>adverb</option>
          <option>subjunksjon</option>
          <option>konjunksjon</option>
          <option>interjeksjon</option>
        </select>
      </div>
      <button>Legg til</button>
    </Form>
  )
}
