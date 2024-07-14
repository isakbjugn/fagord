import type { LoaderFunction} from '@vercel/remix';
import { redirect } from '@vercel/remix';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname === '/') {
    return redirect('/hjem');
  }
  return null;
};