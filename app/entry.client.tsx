import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { EMOTION_CACHE_KEY } from '~/lib/constants';

startTransition(() => {
  const emotionCache = createCache({ key: EMOTION_CACHE_KEY });
  hydrateRoot(
    document,
    <StrictMode>
      <CacheProvider value={emotionCache}>
        <RemixBrowser />
      </CacheProvider>
    </StrictMode>,
  );
});
