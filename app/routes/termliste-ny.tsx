import type { Term } from '~/types/term';
import {
  ColumnFiltersState,
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import '~/styles/termliste-ny.module.css';
import { TranslationFilter } from '~/lib/components/translation-filter';
import { Suspense, useState } from 'react';
import { Spinner } from '~/lib/components/spinner';
import { Await, useLoaderData } from '@remix-run/react';
import type { Subject } from '~/types/subject';
import style from '~/styles/termliste-ny.module.css';
import { data } from '@remix-run/node';
import { Paginator } from '~/lib/components/paginator';

declare module '@tanstack/react-table' {
  // inkluder egentilpassede filterfunksjoner
  interface FilterFns {
    subject: FilterFn<unknown>;
  }
}

const defaultData: Term[] = [
  {
    _id: 'embedding_1',
    definition: '',
    en: 'embedding',
    nb: '',
    nn: '',
    variants: [],
    field: 'IT',
    subfield: 'Maskinlæring',
    pos: 'substantiv',
  },
  {
    _id: 'embody_ver',
    definition: '',
    en: 'embody',
    nb: 'legemliggjøre',
    nn: 'lekamleggjere',
    variants: [
      { term: 'legemliggjøre', dialect: 'nb', votes: 1 },
      { term: 'lekamleggjere', dialect: 'nn', votes: 1 },
    ],
    field: '',
    subfield: '',
    pos: 'verb',
  },
  {
    _id: 'enable_adv',
    definition: '',
    en: 'enable',
    nb: 'muliggjøre',
    nn: 'gjere mogleg',
    variants: [
      { term: 'muliggjøre', dialect: 'nb', votes: 1 },
      { term: 'gjere mogleg', dialect: 'nn', votes: 1 },
    ],
    field: 'Markedsføring',
    subfield: 'Strategi',
    pos: 'verb',
  },
];

const columnHelper = createColumnHelper<Term>();

const columns = [
  columnHelper.accessor('en', {
    header: 'Engelsk',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('nb', {
    header: 'Bokmål',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('nn', {
    header: 'Nynorsk',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('field', {
    header: 'Fagfelt',
    cell: (info) => info.getValue(),
    filterFn: 'subject',
  }),
];

const translatedFilter: FilterFn<Term> = (row, columnId, filterValue) => {
  if (filterValue === 'translated') {
    return row.original.nb !== '' && row.original.nn !== '';
  } else if (filterValue === 'incomplete') {
    return row.original.nb === '' || row.original.nn === '';
  }
  return true;
};

const subjectFilter: FilterFn<Term> = (row, columnId, filterValue) => {
  const subject = row.getValue(columnId);
  if (filterValue === AllSubjects.field) return true;
  return subject === filterValue;
};

const AllSubjects: Subject = { field: 'Alle fagfelt', subfields: [] };

export function loader() {
  const subjectsUrl = 'https://api.fagord.no/fagfelt/';
  const subjects = fetch(subjectsUrl).then((res) => {
    if (res.ok) return res.json();
    else throw new Error(`${res.status} ${res.statusText}: Feil under henting av fagfelt!`);
  });

  return data({ subjects: subjects }, { headers: { 'Cache-Control': 'max-age=3600' } });
}

export default function Termliste() {
  const { subjects } = useLoaderData<typeof loader>();
  const [transFilter, setTransFilter] = useState<any>(['all']);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const table = useReactTable({
    data: defaultData,
    columns,
    state: {
      pagination,
      columnFilters: columnFilters,
      columnVisibility: {
        en: true,
        nb: true,
        nn: true,
        field: true,
      },
      globalFilter: transFilter,
    },
    filterFns: {
      subject: subjectFilter,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: translatedFilter,
    getPaginationRowModel: getPaginationRowModel(),
  });

  const subjectFilterComponent = () => (
    <Suspense fallback={<Spinner />}>
      <Await resolve={subjects}>
        {(subjects: Subject[]) => (
          <select
            className={style.subjects}
            onChange={(event) => table.getColumn('field')?.setFilterValue(event.currentTarget.value)}
          >
            {[AllSubjects, ...subjects].map((subject) => (
              <option key={subject.field}>{subject.field}</option>
            ))}
          </select>
        )}
      </Await>
    </Suspense>
  );

  return (
    <div className="container-sm my-2">
      <div className="col-12 col-lg-10 mx-auto">
        <div className={style.header}>
          <TranslationFilter setTransFilter={setTransFilter} />
          {subjectFilterComponent()}
        </div>
        <table className={style.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <td key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
        <Paginator table={table} />
      </div>
    </div>
  );
}
