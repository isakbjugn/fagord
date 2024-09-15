import type { ActionFunction, ActionFunctionArgs } from '@remix-run/node';

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const termsUrl = 'https://api.fagord.no/termer/';
  await fetch(termsUrl, { method: 'POST', body: JSON.stringify(Object.fromEntries(formData)) });
}
