import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button, Card, CardBody, CardText, CardTitle, Col, Form, Label, Row } from 'reactstrap';

import { Spinner } from '../../../../components/spinner/spinner';
import { ToggleButton } from '../../../../components/toggle-button/toggle-button';
import { addVariant } from '../../../../lib/fetch';
import type { SubmitVariant, Term } from '../../../../types/term';
import { useDebounce } from '../../../../utils/use-debounce';
import { useOrdbokene } from '../../../../utils/use-ordbokene';
import { useToggle } from '../../../../utils/use-toggle';
import style from './translation-card.module.css';

interface TranslationCardProps {
  term: Term;
}

export const TranslationCard = ({ term }: TranslationCardProps) => {
  const queryClient = useQueryClient();
  const [isWriting, toggleWriting] = useToggle(false);
  const { handleSubmit, register, setValue, watch } = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: addVariant,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dictionary'] });
    },
  });
  const debouncedSuggestion = useDebounce(watch('term'), 200);
  const [isVariantValid, validationText, suggestion] = useOrdbokene(debouncedSuggestion, watch('dialect'));

  if (term === null) return <></>;

  const onSubmit = (input: SubmitVariant): void => {
    toggleWriting();
    mutate({ termId: term._id, variant: input });
  };

  const getButtonText = (): string => {
    if (isWriting) return 'Lukk';
    if (term.nb !== '' || term.nn !== '') return 'Legg til forslag';
    return 'Legg til oversettelse';
  };

  return (
    <Card className={style.card}>
      <CardBody>
        <CardTitle tag="h5">Oversettelse</CardTitle>
        <CardText>
          Engelsk: <em>{term.en}</em>
        </CardText>
        <CardText>
          Bokmål: <em>{term.nb}</em>
        </CardText>
        <CardText>
          Nynorsk: <em>{term.nn}</em>
        </CardText>
        {isPending ? (
          <Spinner />
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            {isWriting && (
              <Row>
                <Col>
                  <Label>
                    <input
                      placeholder="Forslag"
                      className={`form-control ${isVariantValid ? 'is-valid' : ''}`}
                      autoCapitalize="none"
                      {...register('term', { required: true })}
                    />
                    <div className={`valid-feedback bright-feedback-text ${style['valid-feedback']}`}>
                      {validationText}
                    </div>
                    {suggestion && (
                      <div className={style['suggestion-feedback']}>
                        Mente du{' '}
                        <u onClick={() => setValue('term', suggestion)} style={{ cursor: 'pointer' }}>
                          {suggestion}
                        </u>
                        ?
                      </div>
                    )}
                  </Label>
                </Col>
                <Col>
                  <ToggleButton leftLabel="nb" rightLabel="nn" fieldLabel="dialect" register={register} />
                </Col>
              </Row>
            )}
            <span className={style.buttons}>
              {isWriting && (
                <Button color="success" type="submit">
                  Send inn
                </Button>
              )}
              <Button
                color="light"
                outline
                onClick={() => {
                  toggleWriting();
                }}
              >
                {getButtonText()}
              </Button>
            </span>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};
