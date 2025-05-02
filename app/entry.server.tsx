import { PassThrough } from 'node:stream';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import type { EntryContext } from '@remix-run/node';
import { createReadableStreamFromReadable } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';

import { EMOTION_CACHE_KEY } from '~/lib/constants';

export const streamTimeout = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const prohibitOutOfOrderStreaming = isbot(request.headers.get('user-agent')) || remixContext.isSpaMode;

  return prohibitOutOfOrderStreaming
    ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext)
    : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext);
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const emotionCache = createCache({ key: EMOTION_CACHE_KEY });

    const { pipe, abort } = renderToPipeableStream(
      <CacheProvider value={emotionCache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const emotionServer = createEmotionServer(emotionCache);
          const bodyWithStyles = emotionServer.renderStylesToNodeStream();
          body.pipe(bodyWithStyles);

          const stream = createReadableStreamFromReadable(bodyWithStyles);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const emotionCache = createCache({ key: EMOTION_CACHE_KEY });

    const { pipe, abort } = renderToPipeableStream(
      <CacheProvider value={emotionCache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const emotionServer = createEmotionServer(emotionCache);
          const bodyWithStyles = emotionServer.renderStylesToNodeStream();
          body.pipe(bodyWithStyles);
          const stream = createReadableStreamFromReadable(bodyWithStyles);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}
