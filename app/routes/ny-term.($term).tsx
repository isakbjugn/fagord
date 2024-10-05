import { Form, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';

export const loader: LoaderFunction = ({ params }: LoaderFunctionArgs) => {
  return json({ termFromUrl: params.term });
};

export default function NyTerm() {
  const { termFromUrl } = useLoaderData<typeof loader>();

  return (
    <Form method="post" action="legg-til">
      <h2>Legg til ny term</h2>
      <div>
        <label htmlFor="en">Engelsk term</label>
        <input name="en" defaultValue={termFromUrl} type="text" autoCapitalize="none" />

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
  );
}
