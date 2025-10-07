import style from './translation-filter.module.css';
import { TransFilter, TransFilterType } from '~/types/filters';

const transFilters: TransFilter[] = [
  {
    text: 'Alle',
    filter: 'all',
    defaultChecked: true,
  },
  {
    text: 'Oversatt',
    filter: 'translated',
    defaultChecked: false,
  },
  {
    text: 'Ufullstendig',
    filter: 'incomplete',
    defaultChecked: false,
  },
];

type Props = {
  setTransFilter: (filter: TransFilterType) => void;
};

export const TranslationFilter = ({ setTransFilter }: Props) => {
  return (
    <div className={style.form}>
      {transFilters.map((filter) => (
        <div className="form-check form-check-inline" key={filter.filter}>
          <input
            className="form-check-input"
            name="dictionaryView"
            type="radio"
            onChange={() => {
              setTransFilter(filter.filter);
            }}
            defaultChecked={filter.defaultChecked}
          />
          <label className="form-check-label">{filter.text}</label>
        </div>
      ))}
    </div>
  );
};
