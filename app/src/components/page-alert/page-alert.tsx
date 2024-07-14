import { Alert } from 'reactstrap';

import { TEST_ENV } from '../../utils/feature-toggles.client';

export const PageAlert = () => {
  if (TEST_ENV)
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

  return null;
};
