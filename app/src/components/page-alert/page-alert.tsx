import { Alert } from 'reactstrap';

export const PageAlert = () => {
  if (window.location.hostname !== 'www.test.fagord.no') return null;

  return (
    <section className="p-4">
      <Alert color="info">
        Dette er en testversjon av Fagord, hvor ny funksjonalitet testes ut. Gå til{' '}
        <a className="alert-link" href="https://www.fagord.no">
          www.fagord.no
        </a>{' '}
        for fullversjonen.
      </Alert>
    </section>
  );
};
