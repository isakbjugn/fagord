import type { ReactElement } from 'react';

export function ClientOnly({
  children,
  fallback = null,
}: {
  children: () => ReactElement;
  fallback?: ReactElement | null;
}) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  return children();
}
