import { useForm } from "react-hook-form"
import { Button, Form, Label, Row } from "reactstrap"
import style from "./new-term-page.module.css"
import { pickBy } from "lodash";
import { postTerm } from "../../lib/fetch";
import { useState } from "react";
import Spinner from "../common/spinner/spinner"
import { Term } from "../../types/term"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "react-query"

const NewTermPage = () => {
  let { term } = useParams();
  const queryClient = useQueryClient();
  const { register, watch, reset, handleSubmit } = useForm();
  const [result, setResult] = useState<Term | null>();
  const { mutate, isLoading } = useMutation(postTerm, {
    onSuccess: (data) => {
      setResult(data);
    },
    onSettled: () => {
      queryClient.invalidateQueries('dictionary');
      reset();
    }
  })

  const watchField = watch("field", "");
  const onSubmit = (input: any) => {
    const cleanInput = (watchField) ? input : {...input, "subfield": ""};
    mutate(pickBy(cleanInput, (value: string) => value.length > 0));
  }
  
  if (result) return (
    <div className={style.success}>
      <h2>Du har opprettet en term!</h2>
      <p>Takk for ditt bidrag til Fagord. Termen og dens oversettelse er nå lagt til i en voksende termbase.</p>
      <span className={style.buttons}>
        <Link to={"../term/" + result._id}>
          <Button outline color="light">Gå til term</Button>
        </Link>
        <Button outline color="light" onClick={() => setResult(null)}>Opprett ny term</Button>
      </span>
    </div>
  )

  if (isLoading) return <Spinner />

  return (
    <div className={style.form}>
      <Form onSubmit={handleSubmit(onSubmit)} >
        <h2>Legg til ny term</h2>
          <Row>
            <Label>
              Engelsk term
              <input value={(term) ? term : undefined} className="form-control" type="text" {...register("en", { required: true })} />
            </Label>
          </Row>
          <Label>Norske termer</Label>
          <Row className="mb-4">
            <div className="col-sm-6">
              <Label>
                  Bokmål
                  <input className="form-control" type="text" {...register("nb")} />
                </Label>
            </div>
            <div className="col-sm-6">
              <Label>
                  Nynorsk
                  <input className="form-control" type="text" {...register("nn")} />
                </Label>
            </div>
          </Row>
          <Row>
            <div className="col-sm-6">
              <Label>
                Fagfelt
                <input className="form-control" type="text" {...register("field")} />
              </Label>
            </div>
            {watchField &&
              <div className="col-sm-6">
                <Label>
                  Underfelt
                  <input className="form-control" type="text" {...register("subfield")} />
                </Label>
              </div>
            }
          </Row>
          <Row>
            <div className="col-sm-6 col-md-12">
              <Label>
                Ordklasse
                <select className="form-select" {...register("pos")}>
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
              <input className="form-control" type="text" {...register("reference")} />
            </Label>
          </Row>
          <Button color="success" type="submit">Legg til term</Button>
      </Form>
    </div>
  )
}

export default NewTermPage;