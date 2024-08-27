import { defer } from '@remix-run/node';
import type { LinksFunction, LoaderFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts } from '@remix-run/react';
import { ThemeProvider } from '@mui/material';
import { splashscreens } from '~/links/splashscreens';
import fagordTheme from '~/theme/theme';

import bootstrapStylesHref from 'bootstrap/dist/css/bootstrap.min.css?url';
import appStylesHref from './app.css?url';
import { Footer } from '~/src/components/footer/footer';
import { Header } from '~/src/components/header/header';
import type { Term } from '~/types/term';

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const termsUrl = 'https://api.fagord.no/termer/';
  const q = new URL(request.url).searchParams.get('q');
  return defer({
    terms: fetch(termsUrl)
      .then((res) => res.json())
      .then((data) => data.sort((a: Term, b: Term) => a.en.localeCompare(b.en))),
    q,
  });
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
