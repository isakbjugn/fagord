import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

startTransition(() => {
  const emotionCache = createCache({ key: 'css' });
  hydrateRoot(
    document,
    <StrictMode>
      <CacheProvider value={emotionCache}>
        <RemixBrowser />
      </CacheProvider>
    </StrictMode>,
  );
});
