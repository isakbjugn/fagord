import { Spinner as ReactstrapSpinner } from 'reactstrap';

import style from './spinner.module.css';

export const Spinner = (): JSX.Element => (
  <div className={style.spinner}>
    <ReactstrapSpinner color="light" />
  </div>
);
