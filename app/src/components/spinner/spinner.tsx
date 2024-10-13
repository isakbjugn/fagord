import { Spinner as ReactstrapSpinner } from 'reactstrap';

import style from './spinner.module.css';

interface Props {
  color?: 'blue' | 'light';
}

export const Spinner = ({ color = 'light' }: Props) => (
  <div className={style.spinner}>
    {color === 'blue' ? <ReactstrapSpinner className={style.blue} /> : <ReactstrapSpinner color="light" />}
  </div>
);
