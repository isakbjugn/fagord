import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query"
import { Button, Form, Label, Row } from "reactstrap"
import { updateTerm } from "../../../../lib/fetch"
import useToggle from "../../../utils/use-toggle"
import Spinner from "../../spinner/spinner"
import styles from "./definition.module.css"

interface DefinitionProps {
  termId: string;
  definition?: string;
}

const Definition = ({ termId, definition }: DefinitionProps) => {
  
  const queryClient = useQueryClient();
  const [isWriting, toggleWriting] = useToggle(false);
  const { register, handleSubmit } = useForm();
  const { mutate, isLoading } = useMutation(updateTerm, {
    onSettled: () => {
      queryClient.invalidateQueries('dictionary');
    }
  })

  if (isLoading) return <Spinner />

  const onSubmit = (input: any) => {
    toggleWriting();
    mutate({termId: termId, term: input});
  }

  const getButtonText = () => {
    if (isWriting) return "Lukk";
    if (definition) return "Endre definisjon";
    return "Legg til definisjon";
  }

  return (
    <div>
      <p>
        {definition ? definition : <em>Ingen definisjon tilgjengelig.</em>}
      </p>
        <Form onSubmit={handleSubmit(onSubmit)}>
        {isWriting && (
          <Row>
            <Label>
              <input placeholder="Skriv inn definisjon" className="form-control" {...register("definition", { required: true })} />
            </Label>
          </Row>
        )}
        <span className={styles.buttons}>
          {isWriting && <Button color="success" type="submit">Send inn</Button>}
          <Button color="light" outline onClick={() => toggleWriting()}>{getButtonText()}</Button>
        </span>
        </Form>
    </div>
  )
}

export default Definition;