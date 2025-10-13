import { ReactNode, useEffect, useState } from 'react';

type ClientOnlyProps = {
  children: ReactNode | (() => ReactNode);
  fallback?: ReactNode;
};

/**
 * Renders `fallback` on the server and before hydration,
 * then renders `children` after the component has mounted.
 *
 * Example:
 *   <ClientOnly fallback={<SimpleInput />}>
 *     {() => <FancyCombobox />}
 *   </ClientOnly>
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{typeof children === 'function' ? children() : children}</>;
}
