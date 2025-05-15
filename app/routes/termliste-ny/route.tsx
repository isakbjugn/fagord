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
import { useState } from 'react';
import { useLoaderData, useRouteLoaderData } from '@remix-run/react';
import type { Subject, SubjectsLoaderData } from '~/types/subject';
import style from '~/styles/termliste-ny.module.css';
import { data } from '@remix-run/node';
import { Paginator } from '~/lib/components/paginator';
import type { loader as rootLoader } from '~/root';
import { SubjectFilter } from '~/routes/termliste/subject-filter';

declare module '@tanstack/react-table' {
  // inkluder egentilpassede filterfunksjoner
  interface FilterFns {
    subject: FilterFn<unknown>;
  }
}

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

  return fetch(subjectsUrl)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error('Kunne ikke hente fagfelt');
      }
      return data(
        { success: true, subjects: res.json() as Promise<Subject[]>, message: undefined },
        { headers: { 'Cache-Control': 'max-age=3600' } },
      );
    })
    .catch((error) => {
      return data(
        {
          success: false,
          subjects: [],
          message: 'Kunne ikke laste fagfelt',
        },
        { status: 500 },
      );
    });
}

export default function Termliste() {
  const { terms } = useRouteLoaderData<typeof rootLoader>('root');
  const subjectsData = useLoaderData<typeof loader>() as unknown as SubjectsLoaderData;
  const [transFilter, setTransFilter] = useState<any>(['all']);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const table = useReactTable({
    data: terms,
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

  return (
    <div className="container-sm my-2">
      <div className="col-12 col-lg-10 mx-auto">
        <div className={style.header}>
          <TranslationFilter setTransFilter={setTransFilter} />
          <SubjectFilter
            onChange={(subject) => table.getColumn('field')?.setFilterValue(subject)}
            subjectsData={subjectsData}
          />
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
