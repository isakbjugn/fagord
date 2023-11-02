import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { Button, Form, Label, Row } from 'reactstrap';

import { Modal } from '../../components/modal/modal';
import { postTerm } from '../../lib/fetch';
import type { SubmitTerm, Term } from '../../types/term';
import { removeEmptyString } from '../../utils/pick-by';
import { useDebounce } from '../../utils/use-debounce';
import { useDictionary } from '../../utils/use-dictionary';
import { useOrdbokene } from '../../utils/use-ordbokene';
import { useToggle } from '../../utils/use-toggle';
import style from './new-term-page.module.css';

export const NewTermPage = (): JSX.Element => {
  const { term: termFromUrl } = useParams();
  const queryClient = useQueryClient();
  const { register, setValue, watch, reset, handleSubmit } = useForm();
  const debouncedBokmalTerm = useDebounce(watch('nb'), 200);
  const debouncedNynorskTerm = useDebounce(watch('nn'), 200);
  const [isBokmalTermValid, bokmalValidationText, bokmalSuggestion] = useOrdbokene(
    debouncedBokmalTerm,
    'nb',
  );
  const [isNynorskTermValid, nynorskValidationText, nynorskSuggestion] = useOrdbokene(
    debouncedNynorskTerm,
    'nn',
  );
  const [result, setResult] = useState<Term | null>();
  const [isErrorModalOpen, toggleErrorModal] = useToggle(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dictionaryQuery = useDictionary();
  const { mutate, isPending } = useMutation({
    mutationFn: postTerm,
    onSuccess: async (data) => {
      setResult(data);
      await queryClient.invalidateQueries({ queryKey: ['dictionary'] });
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

  useEffect(() => {
    setValue('en', termFromUrl);
    setResult(null);
  }, [termFromUrl]);

  const watchField = watch('field', '');
  const watchEn = watch('en', termFromUrl);
  const watchPos = watch('pos', 'substantiv');
  const onSubmit = (input: SubmitTerm): void => {
    const cleanInput = watchField !== '' ? input : { ...input, subfield: '' };
    mutate(removeEmptyString(cleanInput));
  };

  const existsInTermbase = useMemo((): boolean => {
    if (watchEn === '') return false;
    if (dictionaryQuery.isPending || dictionaryQuery.isError) return false;
    return dictionaryQuery.data.find((term: Term) => term.en === watchEn && term.pos === watchPos) !== undefined;
  }, [dictionaryQuery, watchEn, watchPos]);

  const setFieldFromResult = (result: Term) => {
    setValue('field', result.field);
    setValue('subfield', result.subfield);
  };

  if (result !== undefined && result !== null)
    return (
      <section className={style.success}>
        <h2>Du har opprettet en term!</h2>
        <p>
          Takk for ditt bidrag til Fagord. Termen og dens oversettelse er nå lagt til i en voksende
          termbase.
        </p>
        <span className={style.buttons}>
          <Link to={'../term/' + result._id}>
            <Button outline color="light">
              Gå til term
            </Button>
          </Link>
          <Link to="/ny-term" onClick={() => setResult(null)}>
            <Button outline color="light">
              Opprett ny term
            </Button>
          </Link>
          <Link
            to="/ny-term"
            onClick={() => {
              setFieldFromResult(result);
              setResult(null);
            }}
          >
            <Button outline color="light">
              Ny term i samme fagfelt
            </Button>
          </Link>
        </span>
      </section>
    );

  return (
    <main className={style.form}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Legg til ny term</h2>
        <Row>
          <Label>
            Engelsk term
            <input
              defaultValue={termFromUrl}
              type="text"
              className={'form-control' + (existsInTermbase ? ' is-invalid' : '')}
              autoCapitalize="none"
              {...register('en', { required: true })}
            />
            <div className='invalid-feedback bright-feedback-text'>
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
                className={'form-control' + (isBokmalTermValid ? ' is-valid' : '')}
                type="text"
                autoCapitalize="none"
                {...register('nb')}
              />
              <div className='valid-feedback bright-feedback-text'>{bokmalValidationText}</div>
              {bokmalSuggestion && (
                <div className={style['suggestion-feedback']}>
                  Mente du{' '}
                  <u onClick={() => setValue('nb', bokmalSuggestion)} style={{ cursor: 'pointer' }}>
                    {bokmalSuggestion}
                  </u>
                  ?
                </div>
              )}
            </Label>
          </div>
          <div className="col-sm-6">
            <Label>
              Nynorsk
              <input
                className={'form-control' + (isNynorskTermValid ? ' is-valid' : '')}
                type="text"
                autoCapitalize="none"
                {...register('nn')}
              />
              <div className='valid-feedback bright-feedback-text'>{nynorskValidationText}</div>
              {nynorskSuggestion && (
                <div className={style['suggestion-feedback']}>
                  Mente du{' '}
                  <u
                    onClick={() => setValue('nn', nynorskSuggestion)}
                    style={{ cursor: 'pointer' }}
                  >
                    {nynorskSuggestion}
                  </u>
                  ?
                </div>
              )}
            </Label>
          </div>
        </Row>
        <Row>
          <div className="col-sm-6">
            <Label>
              Fagfelt
              <input className="form-control" type="text" {...register('field')} />
            </Label>
          </div>
          {watchField !== null && (
            <div className="col-sm-6">
              <Label>
                Gren
                <input className="form-control" type="text" {...register('subfield')} />
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
            <input className="form-control" type="text" {...register('reference')} />
          </Label>
        </Row>
        <Button color="success" type="submit">
          {isPending && (
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
