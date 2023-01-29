import { Term } from '../../../../types/term';
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Form,
  Label,
  Row,
} from 'reactstrap';
import styles from './translation-card.module.css';
import { useMutation, useQueryClient } from 'react-query';
import useToggle from '../../../utils/use-toggle';
import { useForm } from 'react-hook-form';
import { addVariant } from '../../../../lib/fetch';
import Spinner from '../../spinner/spinner';

interface TranslationCardProps {
  term: Term;
}

const TranslationCard = ({ term }: TranslationCardProps) => {
  const queryClient = useQueryClient();
  const [isWriting, toggleWriting] = useToggle(false);
  const { register, handleSubmit } = useForm();
  const { mutate, isLoading } = useMutation(addVariant, {
    onSettled: () => {
      queryClient.invalidateQueries('dictionary');
    },
  });

  if (!term) return null;

  const onSubmit = (input: any) => {
    toggleWriting();
    mutate({ termId: term._id, variant: input });
  };

  const getButtonText = () => {
    if (isWriting) return 'Lukk';
    if (term.nb || term.nn) return 'Legg til forslag';
    return 'Legg til oversettelse';
  };

  return (
    <Card className={styles.card}>
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
        {isLoading ? (
          <Spinner />
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            {isWriting && (
              <Row>
                <Col>
                  <Label>
                    <input
                      placeholder="Forslag"
                      className="form-control"
                      {...register('term', { required: true })}
                    />
                  </Label>
                </Col>
                <Col>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic checkbox toggle button group"
                  >
                    <input
                      value="nb"
                      defaultChecked={true}
                      type="radio"
                      className="btn-check"
                      id="btncheck1"
                      autoComplete="off"
                      {...register('dialect')}
                    />
                    <label
                      className="btn btn-outline-light"
                      htmlFor="btncheck1"
                    >
                      nb
                    </label>

                    <input
                      value="nn"
                      type="radio"
                      className="btn-check"
                      id="btncheck2"
                      autoComplete="off"
                      {...register('dialect')}
                    />
                    <label
                      className="btn btn-outline-light"
                      htmlFor="btncheck2"
                    >
                      nn
                    </label>
                  </div>
                </Col>
              </Row>
            )}
            <span className={styles.buttons}>
              {isWriting && (
                <Button color="success" type="submit">
                  Send inn
                </Button>
              )}
              <Button color="light" outline onClick={() => toggleWriting()}>
                {getButtonText()}
              </Button>
            </span>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default TranslationCard;
