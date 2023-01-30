import type { ReactNode } from 'react';
import styles from './jumbotron.module.css';

interface JumbotronProps {
  children: ReactNode;
}

const Jumbotron = ({ children }: JumbotronProps): JSX.Element => (
  <div className={'p-4 p-sm-5 rounded-lg m-3 m-sm-5 ' + styles.jumbotron}>
    {children}
  </div>
);

export default Jumbotron;
