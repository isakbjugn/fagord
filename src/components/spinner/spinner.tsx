import { Spinner as ReactstrapSpinner } from 'reactstrap';

import style from './spinner.module.css';

export const Spinner = () => (
  <div className={style.spinner}>
    <ReactstrapSpinner color="light" />
  </div>
);
