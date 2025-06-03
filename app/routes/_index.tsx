import type { LoaderFunction } from 'react-router';
import { redirect } from 'react-router';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname === '/') {
    return redirect(`/hjem${url.search}`);
  }
  return null;
};
