import { Await, Link, Outlet, useLocation, useParams, useRouteLoaderData } from '@remix-run/react';
import type { loader as rootLoader } from '~/root';
import { Suspense } from 'react';
import { Loader } from '~/src/components/loader/loader';
import { Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import type { Term } from '~/types/term';
import style from '~/src/pages/term-page/term-component/term-component.module.css';
import { IconButton } from '@mui/material';
import { IosShare } from '@mui/icons-material';
import { ClientOnly } from 'remix-utils/client-only';

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
