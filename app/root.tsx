import { defer } from '@remix-run/node';
import type { LinksFunction, LoaderFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, useRouteError } from '@remix-run/react';
import type { ClientLoaderFunctionArgs } from '@remix-run/react';
import { ThemeProvider } from '@mui/material';
import { splashscreens } from '~/links/splashscreens';
import fagordTheme from '~/theme/theme';

import bootstrapStylesHref from 'bootstrap/dist/css/bootstrap.min.css?url';
import appStylesHref from './app.css?url';
import { Footer } from '~/lib/components/footer';
import { Header } from '~/lib/components/header';
import type { Term } from '~/types/term';
import { filterTerms } from '~/lib/search';
import { ErrorMessage } from '~/lib/components/error-message';

interface ServerData {
  terms: Promise<Term[]>;
  q: string;
  searchResult: Promise<Term[]>;
}

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const termsUrl = 'https://api.fagord.no/termer/';
  const terms = fetch(termsUrl).then((res) => {
    if (res.ok) return res.json();
    else throw new Error(`${res.status} ${res.statusText}: Feil under henting av termer!`);
  });
  const q = new URL(request.url).searchParams.get('q');
  const searchResult = terms.then((terms) => filterTerms(terms, q));

  return defer({
    terms: terms.then((data) => data.sort((a: Term, b: Term) => a.en.localeCompare(b.en))),
    q: q,
    searchResult: searchResult,
  });
};

let isInitialRequest = true;

export async function clientLoader({ request, serverLoader }: ClientLoaderFunctionArgs) {
  const q = new URL(request.url).searchParams.get('q');

  if (isInitialRequest) {
    isInitialRequest = false;
    const serverData = (await serverLoader()) as ServerData;
    const resolvedTerms = await serverData.terms;
    localStorage.setItem('terms', JSON.stringify(resolvedTerms));
    return serverData;
  }

  const cachedTerms = localStorage.getItem('terms');
  if (cachedTerms) {
    const terms = JSON.parse(cachedTerms) as Term[];

    return {
      terms: terms.sort((a: Term, b: Term) => a.en.localeCompare(b.en)),
      q: q,
      searchResult: filterTerms(terms, q),
    };
  }

  const serverData = (await serverLoader()) as ServerData;
  const resolvedTerms = await serverData.terms;
  localStorage.setItem('terms', JSON.stringify(resolvedTerms));
  return serverData;
}

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
        <ThemeProvider theme={fagordTheme}>
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
