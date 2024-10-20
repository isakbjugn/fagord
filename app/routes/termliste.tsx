import { Await, Link, useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { Suspense, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import type { loader as rootLoader } from '~/root';
import type { Subject } from '~/types/subject';
import { defer } from '@remix-run/node';
import type { Language, Term } from '~/types/term';
import style from '~/styles/termliste.module.css';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { Spinner } from '~/lib/components/spinner';
import {
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { getComparator } from '~/lib/sorting';
import type { Order } from '~/lib/sorting';
import { visuallyHidden } from '@mui/utils';
import { ClientOnly } from 'remix-utils/client-only';

interface TransFilter {
  text: string;
  filter: TransFilterType;
  defaultChecked: boolean;
}

type TransFilterType = 'all' | 'translated' | 'incomplete';

const AllSubjects: Subject = { field: 'Alle fagfelt', subfields: [] };

const transFilters: TransFilter[] = [
  {
    text: 'Alle',
    filter: 'all',
    defaultChecked: true,
  },
  {
    text: 'Oversatt',
    filter: 'translated',
    defaultChecked: false,
  },
  {
    text: 'Ufullstendig',
    filter: 'incomplete',
    defaultChecked: false,
  },
];

export function loader() {
  const subjectsUrl = 'https://api.fagord.no/fagfelt/';
  const subjects = fetch(subjectsUrl).then((res) => {
    if (res.ok) return res.json();
    else throw new Error(`${res.status} ${res.statusText}: Feil under henting av fagfelt!`);
  });

  return defer(
    {
      subjects: subjects,
    },
    { headers: { 'Cache-Control': 'max-age=3600' } },
  );
}

export default function Termliste() {
  const { terms } = useRouteLoaderData<typeof rootLoader>('root');
  const { subjects } = useLoaderData<typeof loader>();
  const [transFilter, setTransFilter] = useState<TransFilterType>('all');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(AllSubjects.field);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Language>('en');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const applyTransFilter = (terms: Term[]): Term[] => {
    switch (transFilter) {
      case 'translated':
        return terms.filter((term) => term.nb !== '' || term.nn !== '');
      case 'incomplete':
        return terms.filter((term) => term.nb === '' || term.nn === '');
      default:
        return terms;
    }
  };

  const applySubjectFilter = (terms: Term[]): Term[] => {
    if (subjectFilter === null) return terms;
    if (subjectFilter === AllSubjects.field) return terms;
    return terms.filter((term) => term.field === subjectFilter);
  };

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof Language): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const subjectFilterComponent = () => (
    <Suspense fallback={<Spinner />}>
      <Await resolve={subjects}>
        {(subjects: Subject[]) => (
          <select className={style.subjects} onChange={(event) => setSubjectFilter(event.currentTarget.value)}>
            {[AllSubjects, ...subjects].map((subject) => (
              <option key={subject.field}>{subject.field}</option>
            ))}
          </select>
        )}
      </Await>
    </Suspense>
  );

  return (
    <main className="container-sm my-2">
      <div className="col-12 col-lg-10 mx-auto">
        <div className={style.header}>
          <Form className={style.form}>
            {transFilters.map((filter) => (
              <FormGroup check inline key={filter.filter}>
                <Input
                  name="dictionaryView"
                  type="radio"
                  onChange={() => {
                    setTransFilter(filter.filter);
                  }}
                  defaultChecked={filter.defaultChecked}
                />
                <Label check>{filter.text}</Label>
              </FormGroup>
            ))}
          </Form>
          {subjectFilterComponent()}
        </div>
        <Paper sx={{ width: '100%', mb: 2, bgcolor: 'background.paper' }}>
          <TableContainer>
            <Table aria-labelledby="tableTitle" size="small">
              <DictionaryHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
              <Suspense
                fallback={
                  <TableBody color={'black'}>
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Spinner color="blue" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                }
              >
                <Await resolve={terms}>
                  {(terms) => {
                    // Avoid a layout jump when reaching the last page with empty rows.
                    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - terms.length) : 0;
                    return (
                      <TableBody>
                        {applyTransFilter(applySubjectFilter(terms))
                          .slice()
                          .sort(getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((term: Term, index: number) => (
                            <TermEntry term={term} index={index} key={term._id} />
                          ))}
                        {emptyRows > 0 && (
                          <TableRow
                            style={{
                              height: 33 * emptyRows,
                            }}
                          >
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    );
                  }}
                </Await>
              </Suspense>
            </Table>
          </TableContainer>
          <ClientOnly fallback={null}>
            {() => (
              <Suspense fallback={null}>
                <Await resolve={terms}>
                  {(terms: Term[]) => (
                    <TablePagination
                      className={style.paginator}
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      component="div"
                      labelRowsPerPage={'Antall ord:'}
                      count={terms.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  )}
                </Await>
              </Suspense>
            )}
          </ClientOnly>
        </Paper>
      </div>
    </main>
  );
}

interface HeadCell {
  id: keyof Language;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'en',
    numeric: false,
    label: 'Engelsk',
  },
  {
    id: 'nb',
    numeric: false,
    label: 'Bokmål',
  },
  {
    id: 'nn',
    numeric: false,
    label: 'Nynorsk',
  },
];

interface DictionaryHeaderProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Language) => void;
  order: Order;
  orderBy: string;
}

export const DictionaryHeader = (props: DictionaryHeaderProps) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Language) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export const TermEntry = (props: { term: Term; index: number }) => {
  const [open, setOpen] = useState(false);
  const { term, index } = props;
  const labelId = `enhanced-table-checkbox-${index}`;
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') setOpen(!open);
  };

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        key={term._id}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <TableCell>
          <button
            aria-label="expand row"
            className={style.expandButton}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <i aria-hidden className={`fa-solid fa-chevron-${open ? 'up' : 'down'} fa-xs ${style.chevron}`} />
          </button>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" tabIndex={0} onKeyDown={handleKeyDown}>
          {term.en}
        </TableCell>
        <TableCell tabIndex={0} onKeyDown={handleKeyDown}>
          {term.nb}
        </TableCell>
        <TableCell tabIndex={0} onKeyDown={handleKeyDown}>
          {term.nn}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TermDetails term={term} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const TermDetails = (props: { term: Term }) => {
  const { term } = props;

  return (
    <>
      <Box sx={{ margin: 1 }}>
        <Table size="small" aria-label="purchases">
          <TableBody>
            {term.field !== '' && (
              <TableRow>
                <TableCell component="th" scope="row">
                  Fagfelt
                </TableCell>
                <TableCell>{term.field}</TableCell>
              </TableRow>
            )}
            {term.subfield !== '' && (
              <TableRow>
                <TableCell component="th" scope="row">
                  Underområde
                </TableCell>
                <TableCell>{term.subfield}</TableCell>
              </TableRow>
            )}
            {term.definition !== '' && (
              <TableRow>
                <TableCell component="th" scope="row">
                  Definisjon
                </TableCell>
                <TableCell>{term.definition}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <div className={'col my-2 mx-4 ' + style.button}>
        <Link className="btn btn-outline-dark btn-sm" to={'/term/' + term._id} role="button">
          Til termside
        </Link>
      </div>
    </>
  );
};
