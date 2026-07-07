import styles from '~/styles/dialog.module.css';

import type { ReactElement, Ref } from 'react';
import { useImperativeHandle, useRef } from 'react';

export function Dialog({ children, ref }: { children: ReactElement; ref?: Ref<HTMLDialogElement> }) {
  const internalRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => internalRef.current as HTMLDialogElement);

  return (
    <dialog ref={internalRef} className={styles.dialog}>
      {children}
      <button className={styles.closeButton} onClick={() => internalRef?.current?.close()}>
        Lukk
      </button>
    </dialog>
  );
}
