import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import type { ClientLoaderFunction, ClientLoaderFunctionArgs } from '@remix-run/react';
import { Links, Meta, Outlet, Scripts, useRouteError } from '@remix-run/react';
import bootstrapStylesHref from 'bootstrap/dist/css/bootstrap.min.css?url';

import { ErrorMessage } from '~/lib/components/error-message';
import { Footer } from '~/lib/components/footer';
import { Header } from '~/lib/components/header';
import { splashscreens } from '~/links/splashscreens';
import type { Term, TermsLoaderData } from '~/types/term';

import appStylesHref from './app.css?url';

export const loader: LoaderFunction = () => {
  const termsUrl = 'https://api.fagord.no/termer/';

  return fetch(termsUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}: Feil under henting av termer!`);
      }
      return {
        success: true,
        terms: res.json() as Promise<Term[]>,
        message: undefined,
      };
    })
    .catch(() => {
      return {
        success: false,
        terms: Promise.resolve([] as Term[]),
        message: 'Kunne ikke laste termer',
      };
    });
};

export const clientLoader: ClientLoaderFunction = ({ serverLoader }: ClientLoaderFunctionArgs) => {
  const cachedTerms = localStorage.getItem('terms');
  if (cachedTerms) {
    return Promise.resolve({
      success: true,
      terms: Promise.resolve(JSON.parse(cachedTerms) as Term[]),
      message: undefined,
    });
  }

  return (serverLoader() as Promise<TermsLoaderData>)
    .then((data) => {
      if (data.success) {
        data.terms.then((resolvedTerms) => {
          localStorage.setItem('terms', JSON.stringify(resolvedTerms));
        });
      }
      return data;
    })
    .catch(() => {
      return {
        success: false,
        terms: [],
        message: 'Kunne ikke laste termer',
      };
    });
};

clientLoader.hydrate = true;

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
      </body>
    </html>
  );
}
