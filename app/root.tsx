import { json } from '@vercel/remix';
import type { LinksFunction, LoaderFunction, MetaFunction } from '@vercel/remix';
import { Links, Meta, Outlet, Scripts, useRouteLoaderData } from '@remix-run/react';
import { ThemeProvider } from '@mui/material';
import { splashscreens } from '~/links/splashscreens';
import fagordTheme from '~/theme/theme';

import bootstrapStylesHref from 'bootstrap/dist/css/bootstrap.min.css?url';
import appStylesHref from './app.css?url';
import { Footer } from '~/src/components/footer/footer';
import type { Term } from '~/types/term';
import { Header } from '~/src/components/header/header';

export const loader: LoaderFunction = async () => {
  const termsUrl = 'https://api.fagord.no/termer/';
  const termResponse = await fetch(termsUrl);
  const terms: Term[] = await termResponse.json();
  return json({ terms: terms });
};

export const useRootLoaderData = () => {
  return useRouteLoaderData<typeof loader>('root');
};

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: bootstrapStylesHref },
  { rel: 'stylesheet', href: appStylesHref },
  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'icon', href: '/fagord-favicon.ico' },
  { rel: 'apple-touch-icon', href: '/fagord-icon260.png' },
  ...splashscreens,
];

export const meta: MetaFunction = () => [
  { title: 'Fagord' },
  { name: 'description', content: 'Fagord er din kilde til norske fagtermer.' },
];

export default function Root() {
  return (
    <html lang="nb">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <Meta />
        <Links />
        {typeof document === 'undefined' ? '__STYLES__' : null}
        <script src="https://kit.fontawesome.com/aff1df517b.js" crossOrigin="anonymous"></script>
      </head>
      <body>
        <ThemeProvider theme={fagordTheme}>
          <Header />
          <Outlet />
          <Footer />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
