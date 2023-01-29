interface InfoMessageProps {
  children: React.ReactNode;
}

const InfoMessage = ({ children }: InfoMessageProps) => (
  <div className="container m-auto">
    <div className="col justify-content-center text-center mx-auto">
      <span className="fa fa-info-circle fa-2x" />
      {children}
    </div>
  </div>
);

export default InfoMessage;
