import style from './translation-filter.module.css';
import { Form, FormGroup, Input, Label } from 'reactstrap';
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
    <Form className={style.form}>
      {transFilters.map((filter) => (
        <FormGroup check inline key={filter.filter}>
          <Input
            name="dictionaryView"
            type="radio"
            onChange={() => {
              setTransFilter(filter.filter);
            }}
            defaultChecked={filter.defaultChecked}
          />
          <Label check>{filter.text}</Label>
        </FormGroup>
      ))}
    </Form>
  );
};
