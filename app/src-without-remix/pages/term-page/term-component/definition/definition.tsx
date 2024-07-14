import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button, Form, Label, Row } from 'reactstrap';

import style from './definition.module.css';
import { useToggle } from '~/utils/use-toggle';
import { updateTerm } from '~/src-without-remix/lib/fetch.client';
import { Spinner } from '~/src-without-remix/components/spinner/spinner';
import type { SubmitTerm } from '~/types/term';

interface DefinitionProps {
  termId: string;
  definition?: string;
}

export const Definition = ({ termId, definition }: DefinitionProps): JSX.Element => {
  const queryClient = useQueryClient();
  const [isWriting, toggleWriting] = useToggle(false);
  const { register, handleSubmit, setValue } = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: updateTerm,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dictionary'] });
    },
  });

  if (isPending) return <Spinner />;

  const onSubmit = (input: SubmitTerm): void => {
    toggleWriting();
    mutate({ termId, term: input });
  };

  const getButtonText = (): string => {
    if (isWriting) return 'Lukk';
    if (definition !== '') return 'Endre definisjon';
    return 'Legg til definisjon';
  };

  return (
    <div>
      <p>{definition !== '' ? definition : <em>Ingen definisjon tilgjengelig.</em>}</p>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {isWriting && (
          <Row>
            <Label>
              <input
                placeholder="Skriv inn definisjon"
                className="form-control"
                {...register('definition', { required: true })}
              />
            </Label>
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
              setValue('definition', definition);
              toggleWriting();
            }}
          >
            {getButtonText()}
          </Button>
        </span>
      </Form>
    </div>
  );
};
