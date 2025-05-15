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
import { TranslationFilter } from '~/routes/termliste/filters/translation-filter';
import { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import type { SubjectsLoaderData } from '~/types/subject';
import style from '~/styles/termliste-ny.module.css';
import { Paginator } from '~/routes/termliste-ny/paginator/paginator';
import { SubjectFilter } from '~/routes/termliste/filters/subject-filter';
import { loader } from '~/routes/termliste-ny/route';
import { subjectFilter } from '~/routes/termliste-ny/filters/subject-filter';
import { translationFilter } from '~/routes/termliste-ny/filters/translation-filter';

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

type Props = {
  terms: Term[];
};

export default function Table({ terms }: Props) {
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
    globalFilterFn: translationFilter,
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
        </table>
        <Paginator table={table} />
      </div>
    </div>
  );
}
