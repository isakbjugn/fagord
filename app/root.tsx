import type { LinksFunction, MetaFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, useRouteError } from 'react-router';
import bootstrapStylesHref from 'bootstrap/dist/css/bootstrap.min.css?url';
import bootstrapScriptsHref from 'bootstrap/dist/js/bootstrap.bundle.min.js?url';

import { ErrorMessage } from '~/lib/components/error-message';
import { Footer } from '~/lib/components/footer';
import { Header } from '~/lib/components/header';
import { splashscreens } from '~/links/splashscreens';
import type { Term } from '~/types/term';
import type { Route } from './+types/root';

import appStylesHref from './app.css?url';

export const loader = () => {
  const termsUrl = 'https://api.fagord.no/termer/';
  const terms = fetch(termsUrl).then(async (res) => {
    if (!res.ok) {
      throw new Response('Klarte ikke å hente termer', { status: 500 });
    }
    return (await res.json()) as Term[];
  });

  return {
    terms,
  };
};

export const clientLoader = ({ serverLoader }: Route.ClientLoaderArgs) => {
  const cachedTerms = localStorage.getItem('terms');
  if (cachedTerms) {
    return {
      terms: JSON.parse(cachedTerms) as Term[],
    };
  }

  return (serverLoader() as Promise<{ terms: Promise<Term[]> }>).then((data) => {
    data.terms.then((terms) => {
      localStorage.setItem('terms', JSON.stringify(terms));
    });
    return data;
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
        <script src={bootstrapScriptsHref} />
      </body>
    </html>
  );
}
