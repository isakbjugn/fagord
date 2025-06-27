import { redirect } from 'react-router';

import type { Route } from './+types/_index';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  if (url.pathname === '/') {
    return redirect(`/hjem${url.search}`);
  }
  return null;
};
