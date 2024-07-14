import type { ReactNode } from 'react';

interface InfoMessageProps {
  children: ReactNode;
}

export const InfoMessage = ({ children }: InfoMessageProps) => (
  <div className="container m-auto">
    <div className="col justify-content-center text-center mx-auto">
      <span className="fa fa-info-circle fa-2x" />
      {children}
    </div>
  </div>
);
