import style from '~/styles/term.module.css';
import { Await, Form, Link, Outlet, useLocation, useParams, useRouteLoaderData } from '@remix-run/react';
import type { loader as rootLoader } from '~/root';
import { Suspense, useState } from 'react';
import { Loader } from '~/src/components/loader/loader';
import { Breadcrumb, BreadcrumbItem, Button, Card, CardBody, CardText, CardTitle, Col, Label, Row } from 'reactstrap';
import type { Term } from '~/types/term';
import { IconButton } from '@mui/material';
import { IosShare } from '@mui/icons-material';
import { ClientOnly } from 'remix-utils/client-only';
import { useToggle } from '~/src/utils/use-toggle';
import { DialectInput } from '~/lib/components/dialect-input';

export default function Term() {
  const { terms } = useRouteLoaderData<typeof rootLoader>('root');
  const { termId } = useParams();

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={terms}>
        {(terms) => {
          const term = terms.find((term: Term) => term._id === termId);

          return (
            <main className="container my-3">
              <div className="col-12 col-lg-10 mx-auto ">
                <div className="row" style={{ color: 'white' }}>
                  <Breadcrumb>
                    <BreadcrumbItem>
                      <Link to="/termliste">Termliste</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>{term.en}</BreadcrumbItem>
                  </Breadcrumb>
                </div>
                <TermComponent term={term} />
              </div>
            </main>
          );
        }}
      </Await>
    </Suspense>
  );
}

const TermComponent = ({ term }: { term: Term }) => {
  const fieldSpec = term.subfield !== '' ? term.subfield : term.field;
  const fieldSpecStr = fieldSpec !== '' ? ' (' + fieldSpec + ')' : '';
  const termShareData = {
    title: 'Fagord',
    text: term.en + fieldSpecStr,
    url: 'https://www.fagord.no/term/' + term._id,
  };

  return (
    <article>
      <div className="row">
        <div className={style.header}>
          <div className={style.title}>
            <h1>{term.en}</h1>
            <h3>{fieldSpecStr}</h3>
          </div>
          <ClientOnly fallback={null}>
            {() => (
              <IconButton
                className={style.share}
                sx={{ color: '#ffffff' }}
                onClick={() => {
                  try {
                    navigator.share(termShareData);
                  } catch {
                    navigator.clipboard.writeText(termShareData.url);
                  }
                }}
              >
                <IosShare />
              </IconButton>
            )}
          </ClientOnly>
        </div>
        <hr />
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <Definition termId={term._id} definition={term.definition} />
        </div>
        <div className="col-12 col-sm-8 col-md-6 mt-2">
          <TranslationCard term={term} />
        </div>
      </div>
    </article>
  );
};

interface DefinitionProps {
  termId: string;
  definition?: string;
}

const Definition = ({ definition }: DefinitionProps) => {
  const location = useLocation();
  const isEditing = location.pathname.includes('endre');
  const buttonText = definition !== '' ? 'Endre definisjon' : 'Legg til definisjon';

  return (
    <div>
      <p>{definition !== '' ? definition : <em>Ingen definisjon tilgjengelig.</em>}</p>
      <Outlet />
      {!isEditing && (
        <Link to="endre">
          <Button type="button" outline color="light">
            {buttonText}
          </Button>
        </Link>
      )}
    </div>
  );
};

interface TranslationCardProps {
  term: Term;
}

export const TranslationCard = ({ term }: TranslationCardProps) => {
  const [isWriting, toggleWriting] = useToggle(false);
  const [dialect, setDialect] = useState('nb');

  const buttonText = term.nb !== '' || term.nn !== '' ? 'Legg til forslag' : 'Legg til oversettelse';

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
        {isWriting ? (
          <Form method="post" action="varianter/legg-til" onSubmit={toggleWriting}>
            <Row>
              <Col>
                <Label htmlFor="term">
                  <DialectInput name="term" dialect={dialect as 'nb' | 'nn'} />
                </Label>
              </Col>
              <Col>
                <ToggleButton leftLabel="nb" rightLabel="nn" name="dialect" handleChange={setDialect} />
              </Col>
            </Row>
            <span className={style.buttons}>
              <Button color="success">Send inn</Button>
              <Button type="button" color="light" outline onClick={toggleWriting}>
                Lukk
              </Button>
            </span>
          </Form>
        ) : (
          <Button color="light" outline onClick={toggleWriting}>
            {buttonText}
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

interface ToggleButtonProps {
  leftLabel: string;
  rightLabel: string;
  name: string;
  handleChange: (value: string) => void;
}

export const ToggleButton = ({ leftLabel, rightLabel, name, handleChange }: ToggleButtonProps) => (
  <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
    <input
      value={leftLabel}
      defaultChecked={true}
      type="radio"
      className="btn-check"
      id="btncheck1"
      autoComplete="off"
      name={name}
      onChange={() => {
        handleChange(leftLabel);
      }}
    />
    <label className="btn btn-outline-light" htmlFor="btncheck1">
      {leftLabel}
    </label>

    <input
      value={rightLabel}
      type="radio"
      className="btn-check"
      id="btncheck2"
      autoComplete="off"
      name={name}
      onChange={() => {
        handleChange(rightLabel);
      }}
    />
    <label className="btn btn-outline-light" htmlFor="btncheck2">
      {rightLabel}
    </label>
  </div>
);
