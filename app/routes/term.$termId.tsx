import {
  Form,
  isRouteErrorResponse,
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
  useParams,
  useRouteError,
} from 'react-router';
import { useRef, useState } from 'react';
import type { ColorOptions, Tag } from 'react-tagcloud';
import { TagCloud } from 'react-tagcloud';
import { ClientOnly } from '~/lib/client-only';
import type { Route } from './+types/term.$termId';

import { DialectInput } from '~/lib/components/dialect-input';
import { Dialog } from '~/lib/components/dialog';
import { ShareTermButton } from '~/lib/components/share-term-button.client';
import { ToggleButton } from '~/lib/components/toggle-button';
import { useToggle } from '~/lib/use-toggle';
import style from '~/styles/term.module.css';
import type { Term, Variant } from '~/types/term';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { termId } = params;
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const termsUrl = `${FAGORD_RUST_API_URL}/terms/${termId}`;

  const termResponse = await fetch(termsUrl);
  if (!termResponse.ok) {
    throw new Response('Termen finnes ikke', { status: 404 });
  }

  return termResponse.json() as Promise<Term>;
};

export default function Term() {
  const term = useLoaderData<typeof loader>();

  return (
    <main className="container my-3">
      <div className="col-12 col-lg-10 mx-auto ">
        <div className="row" style={{ color: 'white' }}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/termliste">Termliste</Link>
              </li>
              <li className="breadcrumb-item active">{term.en}</li>
            </ol>
          </nav>
        </div>
        <TermComponent term={term} />
        {term.variants ? <VariantCloud variants={term.variants} /> : null}
      </div>
    </main>
  );
}

const TermComponent = ({ term }: { term: Term }) => {
  const field = term.subfield || term.field;

  return (
    <article>
      <div className="row">
        <div className={style.header}>
          <div className={style.title}>
            <h1>{term.en}</h1>
            {field && <h3>({field})</h3>}
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
  const hasDefinition = definition && definition !== '';
  const buttonText = hasDefinition ? 'Endre definisjon' : 'Legg til definisjon';

  return (
    <div>
      <p>{hasDefinition ? definition : <em>Ingen definisjon tilgjengelig.</em>}</p>
      <Outlet />
      {!isEditing && (
        <Link to="endre">
          <button className="btn btn-outline-light" type="button">
            {buttonText}
          </button>
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
    <div className={`card ${style.card}`}>
      <div className="card-body">
        <h5 className="card-title">Oversettelse</h5>
        <p className="card-text">
          Engelsk: <em>{term.en}</em>
        </p>
        <p className="card-text">
          Bokmål: <em>{term.nb}</em>
        </p>
        <p className="card-text">
          Nynorsk: <em>{term.nn}</em>
        </p>
        {isWriting ? (
          <Form method="post" action="varianter/legg-til" onSubmit={toggleWriting}>
            <div className="row">
              <div className="col">
                <label className="form-label" htmlFor="term">
                  <DialectInput name="term" dialect={dialect as 'nb' | 'nn'} />
                </label>
              </div>
              <div className="col">
                <ToggleButton leftLabel="nb" rightLabel="nn" name="dialect" handleChange={setDialect} />
              </div>
            </div>
            <span className={style.buttons}>
              <button className="btn btn-success">Send inn</button>
              <button className="btn btn-outline-light" type="button" onClick={toggleWriting}>
                Lukk
              </button>
            </span>
          </Form>
        ) : (
          <button className="btn btn-outline-light" onClick={toggleWriting}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
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
    if (variants.filter((v) => v.text === variant.text).length > 1) return variant.text + ' (' + variant.dialect + ')';
    return variant.text;
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
              id: v.id.toString(),
              term: v.text,
              dialect: v.dialect,
            },
            count: v.votes,
          } as Tag;
        })}
        onClick={(tag: Tag) => {
          const formData = new FormData();
          if (tag.props) {
            const { id } = tag.props as { id: string };
            formData.append('variantId', id);
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
            Du har gitt én stemme til <em>«{fetcher.data?.text}»</em>.
          </p>
        )}
      </Dialog>
    </>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  const { termId } = useParams();

  if (isRouteErrorResponse(error) && error.status === 404) {
    if (error.status === 404) {
      return (
        <div className="container my-3">
          <div className="col-12 col-lg-10 mx-auto">
            <h1>Ops! Her var det ingenting!</h1>
            <p>Vi fant ikke termen du slo opp. Er du sikker på at den finnes?</p>
            <span style={{ display: 'flex', gap: '8px' }}>
              <Link to="/termliste">
                <button className="btn btn-outline-light">Tilbake til termlisten</button>
              </Link>
              <Link to={`/ny-term/${termId}`}>
                <button className="btn btn-outline-light">Opprett term</button>
              </Link>
            </span>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container my-3">
      <div className="col-12 col-lg-10 mx-auto">
        <h1>Her gikk noe galt!</h1>
        <p>Noe gikk feil mens vi slo opp termen.</p>
        <Link to="/termliste">
          <button className="btn btn-outline-light">Tilbake til termlisten</button>
        </Link>
      </div>
    </div>
  );
}
