import { useForm } from 'react-hook-form';
import { Button, Form, Label, Row } from 'reactstrap';
import style from './new-term-page.module.css';
import { pickBy } from 'lodash';
import { postTerm } from '../../lib/fetch';
import { useEffect, useMemo, useState } from 'react';
import type { Term } from '../../types/term';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../common/modal/modal';
import useToggle from '../utils/use-toggle';
import useDictionary from '../utils/use-dictionary';
import { createId } from '../utils/create-id';
import { fetchSuggestions } from '../../lib/fetch-ordbokene';
import type { OrdbokeneResponse, Lookup } from '../../types/ordbokene';

const NewTermPage = (): JSX.Element => {
  const { term } = useParams();
  const queryClient = useQueryClient();
  const { register, watch, reset, handleSubmit } = useForm();
  const [result, setResult] = useState<Term | null>();
  const [isErrorModalOpen, toggleErrorModal] = useToggle(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dictionaryQuery = useDictionary();
  const { mutate, isLoading } = useMutation({
    mutationFn: postTerm,
    onSuccess: async (data) => {
      setResult(data);
      await queryClient.invalidateQueries(['dictionary']);
      reset();
    },
    onError: (error: Error) => {
      switch (error.message.split(' ')[0]) {
        case '403': {
          setErrorMessage('Kan ikke publisere formler.');
          break;
        }
        case '418': {
          setErrorMessage('Kan ikke publisere skript.');
          break;
        }
        default:
          setErrorMessage('Det skjedde en feil under posting av term');
      }
      toggleErrorModal();
    },
  });
  const [NBSuggestion, setNBSuggestion] = useState<Lookup>({exact: false, inflect: []});
  const [NNSuggestion, setNNSuggestion] = useState<Lookup>({exact: false, inflect: []});

  const watchField = watch('field', '');
  const watchEn = watch('en', term !== '' ? term : '');
  const watchNb = watch('nb', term !== '' ? term : '');
  const watchNn = watch('nn', term !== '' ? term : '');
  const watchPos = watch('pos', 'substantiv');
  const onSubmit = (input: any): void => {
    const cleanInput = watchField !== '' ? input : { ...input, subfield: '' };
    mutate(pickBy(cleanInput, (value: string) => value.length > 0));
  };

  const existsInTermbase = useMemo((): boolean => {
    if (watchEn === '') return false;
    if (dictionaryQuery.isLoading || dictionaryQuery.isError) return false;
    const id = createId(watchEn, watchPos);
    return dictionaryQuery.data.find((term: any) => term._id === id) !== undefined;
  }, [dictionaryQuery, watchEn, watchPos]);

  useEffect(() => {
    if (watchNb) {
      fetchSuggestions(watchNb, 'bm')
      .then((suggestion: OrdbokeneResponse) => {
        setNBSuggestion(getTermsFromSuggestion(suggestion, watchNb))
      })
      .catch(error => {
        console.error('API-kall til Bokmålsordboka feilet: ', error)
      })
    } else {
      setNBSuggestion({exact: false, inflect: []});
    }
  }, [watchNb])

  useEffect(() => {
    if (watchNn) {
      fetchSuggestions(watchNn, 'nn')
      .then((suggestion: OrdbokeneResponse) => {
        setNNSuggestion(getTermsFromSuggestion(suggestion, watchNn))
      })
      .catch(error => {
        console.error('API-kall til Nynorskordboka feilet: ', error)
      })
    } else {
      setNNSuggestion({exact: false, inflect: []});
    }
  }, [watchNn])

  const getTermsFromSuggestion = (suggestion: OrdbokeneResponse, searchTerm: string): Lookup => {
    const exactMatches: string[] = suggestion.a.exact ? suggestion.a.exact.map(term => term[0]) : [];
    const exact = exactMatches.includes(searchTerm);
    const inflect = suggestion.a.inflect ? suggestion.a.inflect.map(term => term[0]) : [];
  
    return { exact, inflect };
  };

  if (result !== undefined && result !== null)
    return (
      <section className={style.success}>
        <h2>Du har opprettet en term!</h2>
        <p>
          Takk for ditt bidrag til Fagord. Termen og dens oversettelse er nå
          lagt til i en voksende termbase.
        </p>
        <span className={style.buttons}>
          <Link to={'../term/' + result._id}>
            <Button outline color="light">
              Gå til term
            </Button>
          </Link>
          <Button
            outline
            color="light"
            onClick={() => {
              setResult(null);
            }}
          >
            Opprett ny term
          </Button>
        </span>
      </section>
    );

  const showSuggestion = (suggestion: Lookup): boolean =>
    suggestion.exact || suggestion.inflect.length > 0;

  const viewSuggestion = (suggestion: Lookup | undefined, dialect: 'nb' | 'nn'): string => {
    if (suggestion?.exact) {
      return 'Finnes i ' + (dialect === 'nb' ? 'Bokmålsordboka' : 'Nynorskordboka');
    }
    else if (suggestion?.inflect) {
      return 'Bøyning av ' + suggestion.inflect[0] + ' i ' + (dialect === 'nb' ? 'Bokmålsordboka' : 'Nynorskordboka');
    } else {
      return ';'
    }
  }

  return (
    <main className={style.form}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Legg til ny term</h2>
        <Row>
          <Label>
            Engelsk term
            <input
              defaultValue={term !== null ? term : undefined}
              type="text"
              className={'form-control' + (existsInTermbase ? ' is-invalid' : '')}
              autoCapitalize="none"
              {...register('en', { required: true })}
            />
            <div className="invalid-feedback">
              Kombinasjonen av term og ordklasse finnes fra før.
            </div>
          </Label>
        </Row>
        <Label>Norske termer</Label>
        <Row className="mb-4">
          <div className="col-sm-6">
            <Label>
              Bokmål
              <input
                className={'form-control' + (showSuggestion(NBSuggestion) ? ' is-valid' : '')}
                type="text"
                autoCapitalize="none"
                {...register('nb')}
              />
              <div className="valid-feedback">
                {viewSuggestion(NBSuggestion, 'nb')}
              </div>
            </Label>
          </div>
          <div className="col-sm-6">
            <Label>
              Nynorsk
              <input
                className={'form-control' + (showSuggestion(NNSuggestion) ? ' is-valid' : '')}
                type="text"
                autoCapitalize="none"
                {...register('nn')}
              />
              <div className="valid-feedback">
                {viewSuggestion(NNSuggestion, 'nn')}
              </div>
            </Label>
          </div>
        </Row>
        <Row>
          <div className="col-sm-6">
            <Label>
              Fagfelt
              <input
                className="form-control"
                type="text"
                {...register('field')}
              />
            </Label>
          </div>
          {watchField !== null && (
            <div className="col-sm-6">
              <Label>
                Underfelt
                <input
                  className="form-control"
                  type="text"
                  {...register('subfield')}
                />
              </Label>
            </div>
          )}
        </Row>
        <Row>
          <div className="col-sm-6 col-md-12">
            <Label>
              Ordklasse
              <select className="form-select" {...register('pos')}>
                <option>substantiv</option>
                <option>verb</option>
                <option>adjektiv</option>
                <option>pronomen</option>
                <option>determinativ</option>
                <option>preposisjon</option>
                <option>adverb</option>
                <option>subjunksjon</option>
                <option>konjunksjon</option>
                <option>interjeksjon</option>
              </select>
            </Label>
          </div>
        </Row>
        <Row>
          <Label>
            Referanse
            <input
              className="form-control"
              type="text"
              {...register('reference')}
            />
          </Label>
        </Row>
        <Button color="success" type="submit">
          {isLoading && (
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          Legg til term
        </Button>
      </Form>
      <Modal isOpen={isErrorModalOpen} toggle={toggleErrorModal}>
        <p>{errorMessage}</p>
      </Modal>
    </main>
  );
};

export default NewTermPage;
