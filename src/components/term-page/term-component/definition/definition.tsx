import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Label, Row } from 'reactstrap';
import { updateTerm } from '../../../../lib/fetch';
import useToggle from '../../../utils/use-toggle';
import Spinner from '../../../common/spinner/spinner';
import styles from './definition.module.css';

interface DefinitionProps {
  termId: string;
  definition?: string;
}

const Definition = ({ termId, definition }: DefinitionProps): JSX.Element => {
  const queryClient = useQueryClient();
  const [isWriting, toggleWriting] = useToggle(false);
  const { register, handleSubmit, setValue } = useForm();
  const { mutate, isLoading } = useMutation({
    mutationFn: updateTerm,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dictionary'] });
    },
  });

  if (isLoading) return <Spinner />;

  const onSubmit = (input: any): void => {
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
      <p>
        {definition !== '' ? (
          definition
        ) : (
          <em>Ingen definisjon tilgjengelig.</em>
        )}
      </p>
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
        <span className={styles.buttons}>
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

export default Definition;
