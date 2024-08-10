import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { MuiProvider } from '~/mui/mui-provider';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <MuiProvider>
        <RemixBrowser />
      </MuiProvider>
    </StrictMode>
  );
});
