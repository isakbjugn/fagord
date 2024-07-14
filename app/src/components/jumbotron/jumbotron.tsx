import type { ReactNode } from 'react';

import style from './jumbotron.module.css';

interface JumbotronProps {
  children: ReactNode;
}

export const Jumbotron = ({ children }: JumbotronProps) => (
  <section className={'p-4 p-sm-5 rounded-lg m-3 m-sm-5 ' + style.jumbotron}>{children}</section>
);
