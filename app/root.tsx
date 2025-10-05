import type { LinksFunction, MetaFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, useRouteError } from 'react-router';
import bootstrapStylesHref from 'bootstrap/dist/css/bootstrap.min.css?url';
import bootstrapScriptsHref from 'bootstrap/dist/js/bootstrap.bundle.min.js?url';

import { ErrorMessage } from '~/lib/components/error-message';
import { Footer } from '~/lib/components/footer';
import { Header } from '~/lib/components/header';
import { splashscreens } from '~/links/splashscreens';

import appStylesHref from './app.css?url';

export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);

  return (
    <html lang="nb">
      <head>
        <title>Ops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorMessage>Ops! Her var det noe som gikk galt!</ErrorMessage>
      </body>
    </html>
  );
}

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
  { name: 'viewport', content: 'width=device-width; initial-scale=1; viewport-fit=cover' },
  { name: 'mobile-web-app-capable', content: 'yes' },
  { name: 'apple-mobile-web-app-capable', content: 'yes' },
  { name: 'apple-mobile-web-app-title', content: 'Fagord' },
  { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  { name: 'theme-color', content: '#29648a' },
];

export default function Root() {
  return (
    <html lang="nb">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width; initial-scale=1; viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <Meta />
        <Links />
        <script src="https://kit.fontawesome.com/aff1df517b.js" crossOrigin="anonymous"></script>
      </head>
      <body>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        <Scripts />
        <script src={bootstrapScriptsHref} />
      </body>
    </html>
  );
}
