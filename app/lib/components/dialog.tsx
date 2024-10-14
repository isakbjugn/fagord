import '../../styles/dialog.css';

import type { ForwardedRef, ReactElement } from 'react';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export const Dialog = forwardRef(function Dialog(
  { children }: { children: ReactElement },
  forwardedRef: ForwardedRef<HTMLDialogElement>,
) {
  const ref = useRef<HTMLDialogElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLDialogElement);

  return (
    <dialog ref={ref}>
      {children}
      <button autoFocus onClick={() => ref?.current?.close()}>
        Lukk
      </button>
    </dialog>
  );
});
