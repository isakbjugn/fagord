import { useState } from "react"
import { Form, FormGroup, Input, Label } from "reactstrap"
import { Term } from "../../types/term"
import Loader from "../common/loader/loader"
import TermList from "./term-list/term-list"

interface DictionaryPageProps {
  dictionary: Term[];
}

type Filter = 'all' | 'translated' | 'incomplete';

const DictionaryPage = ({dictionary = []}: DictionaryPageProps)  => {
  const [filter, setFilter] = useState<Filter>('all');

  const applyFilter = () => {
    switch (filter) {
      case 'translated':
        return dictionary.filter(term => (term.nb || term.nn))
      case 'incomplete':
        return dictionary.filter(term => (!term.nb || !term.nn))
      default:
        return dictionary;
    };
  }

  if (dictionary.length === 0) return <Loader />;

  return (
    <div className="container-sm my-2">
      <div className="col-12 col-lg-10 mx-auto">
        <Form>
          <FormGroup check inline>
            <Input
              name="dictionaryView"
              type="radio"
              onChange={() => setFilter('all')}
              defaultChecked
            />
            <Label check>
              Alle
            </Label> 
          </FormGroup>
          <FormGroup check inline>
            <Input
              name="dictionaryView"
              type="radio"
              onChange={() => setFilter('translated')}
            />
            <Label check>
              Oversatt
            </Label> 
          </FormGroup>
          <FormGroup check inline>
            <Input
              name="dictionaryView"
              type="radio"
              onChange={() => setFilter('incomplete')}
            />
            <Label check>
              Trenger oversettelse
            </Label> 
          </FormGroup>
        </Form>
        <TermList dictionary={applyFilter()}></TermList>
      </div>
    </div>
  )
}

export default DictionaryPage;
