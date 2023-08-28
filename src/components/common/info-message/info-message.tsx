interface InfoMessageProps {
  children: React.ReactNode;
}

export const InfoMessage = ({ children }: InfoMessageProps): JSX.Element => (
  <div className="container m-auto">
    <div className="col justify-content-center text-center mx-auto">
      <span className="fa fa-info-circle fa-2x" />
      {children}
    </div>
  </div>
);
