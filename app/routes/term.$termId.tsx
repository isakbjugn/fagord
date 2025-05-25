import {
  ClientLoaderFunction,
  ClientLoaderFunctionArgs,
  Form,
  isRouteErrorResponse,
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
  useRouteError,
} from '@remix-run/react';
import { useRef, useState } from 'react';
import type { ColorOptions, Tag } from 'react-tagcloud';
import { TagCloud } from 'react-tagcloud';
import { Breadcrumb, BreadcrumbItem, Button, Card, CardBody, CardText, CardTitle, Col, Label, Row } from 'reactstrap';
import { ClientOnly } from 'remix-utils/client-only';

import { DialectInput } from '~/lib/components/dialect-input';
import { Dialog } from '~/lib/components/dialog';
import { ShareTermButton } from '~/lib/components/share-term-button.client';
import { ToggleButton } from '~/lib/components/toggle-button';
import { useToggle } from '~/lib/use-toggle';
import style from '~/styles/term.module.css';
import type { Term, Variant } from '~/types/term';

export const loader = async ({ params }: ClientLoaderFunctionArgs) => {
  const { termId } = params;
  const termUrl = `https://api.fagord.no/termer/${termId}`;

  const termResponse = await fetch(termUrl);
  if (!termResponse.ok) {
    throw new Response('Failed to fetch term', { status: termResponse.status });
  }
  const term = (await termResponse.json()) as Term;
  return {
    term: term,
  };
};

let isInitialRequest = true;

export const clientLoader: ClientLoaderFunction = async ({ params, serverLoader }: ClientLoaderFunctionArgs) => {
  if (isInitialRequest) {
    return await serverLoader();
  }

  const { termId } = params;
  const cachedTerms = localStorage.getItem('terms');

  if (termId && cachedTerms) {
    const terms = JSON.parse(cachedTerms) as Term[];
    const term = terms.find((cachedTerm) => cachedTerm._id === termId);

    if (!term) {
      throw new Response('Term not found', { status: 404 });
    }
    return {
      term: term,
    };
  }

  const termUrl = `https://api.fagord.no/termer/${termId}`;

  const termResponse = await fetch(termUrl);
  if (!termResponse.ok) {
    throw new Response('Failed to fetch term', { status: termResponse.status });
  }
  const term = (await termResponse.json()) as Term;
  return {
    term: term,
  };
};

clientLoader.hydrate = true;

export default function Term() {
  const { term } = useLoaderData<typeof loader>();

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
        <VariantCloud variants={term.variants} />
      </div>
    </main>
  );
}

const TermComponent = ({ term }: { term: Term }) => {
  const fieldSpec = term.subfield !== '' ? term.subfield : term.field;
  const fieldSpecStr = fieldSpec !== '' ? ' (' + fieldSpec + ')' : '';

  return (
    <article>
      <div className="row">
        <div className={style.header}>
          <div className={style.title}>
            <h1>{term.en}</h1>
            <h3>{fieldSpecStr}</h3>
          </div>
          <ClientOnly fallback={null}>{() => <ShareTermButton term={term} />}</ClientOnly>
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

interface VariantCloudProps {
  variants: Variant[];
}

export const VariantCloud = ({ variants }: VariantCloudProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fetcher = useFetcher<Variant>();
  const options: ColorOptions = {
    luminosity: 'light',
    hue: 'red',
  };

  const renderTermNoDuplicates = (variant: Variant): string => {
    if (variants.filter((v) => v.term === variant.term).length > 1) return variant.term + ' (' + variant.dialect + ')';
    return variant.term;
  };

  return (
    <>
      <TagCloud
        className={style.cloud}
        minSize={20}
        maxSize={40}
        colorOptions={options}
        tags={variants.map((v) => {
          const displayed_variant = renderTermNoDuplicates(v);
          return {
            value: displayed_variant,
            key: displayed_variant,
            props: {
              term: v.term,
              dialect: v.dialect,
            },
            count: v.votes,
          } as Tag;
        })}
        onClick={(tag: Tag) => {
          const formData = new FormData();
          if (tag.props) {
            const { term, dialect } = tag.props as { term: string; dialect: 'nb' | 'nn' };
            formData.append('term', term);
            formData.append('dialect', dialect);

            fetcher.submit(formData, { method: 'post', action: 'varianter/stem' });
            dialogRef.current?.showModal();
          }
        }}
      />
      <Dialog ref={dialogRef}>
        {fetcher.state === 'submitting' ? (
          <p>Stemmer...</p>
        ) : (
          <p>
            Du har gitt én stemme til <em>«{fetcher.data?.term}»</em>.
          </p>
        )}
      </Dialog>
    </>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="container my-3">
          <div className="col-12 col-lg-10 mx-auto">
            <h1>Termen ble ikke funnet</h1>
            <p>Vi kunne ikke finne termen du leter etter.</p>
            <Link to="/termliste">Tilbake til termlisten</Link>
          </div>
        </div>
      );
    }
    return (
      <div className="container my-3">
        <div className="col-12 col-lg-10 mx-auto">
          <h1>Feil</h1>
          <p>{error.statusText || error.status}</p>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="container my-3">
        <div className="col-12 col-lg-10 mx-auto">
          <h1>Feil</h1>
          <p>{error.message}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container my-3">
        <div className="col-12 col-lg-10 mx-auto">
          <h1>Ukjent feil</h1>
          <p>Det oppstod en ukjent feil.</p>
        </div>
      </div>
    );
  }
}
