import { CssBaseline } from '@mui/material';
import type { ReactNode } from 'react';

export function MuiDocument({ children }: { children: ReactNode }) {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
