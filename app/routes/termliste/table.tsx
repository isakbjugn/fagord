import type { Term } from '~/types/term';
import {
  ColumnFiltersState,
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortDirection,
  SortingFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { TranslationFilter } from './translation-filter/translation-filter';
import { Fragment, useState, type KeyboardEvent } from 'react';
import { useLoaderData } from '@remix-run/react';
import type { SubjectsLoaderData } from '~/types/subject';
import style from '~/routes/termliste/termliste.module.css';
import '~/routes/termliste/termliste.module.css';
import { Paginator } from '~/routes/termliste/paginator/paginator';
import { SubjectFilter } from './subject-filter/subject-filter';
import { loader } from '~/routes/termliste/route';
import { subjectFilter, translationFilter } from '~/routes/termliste/filters';
import { TermDetaljer } from './term-detaljer/term-detaljer';

function handleKeyDown(handler: ((event: KeyboardEvent) => void) | undefined) {
  return (event: KeyboardEvent) => {
    if (event.code === 'Enter' || event.code === 'Space') {
      if (handler && typeof handler === 'function') {
        handler(event);
      }
    }
  };
}

declare module '@tanstack/react-table' {
  // inkluder egentilpassede filterfunksjoner
  interface FilterFns {
    subject: FilterFn<unknown>;
  }
  interface SortingFns {
    textEmptyLast: SortingFn<unknown>;
  }
}

const columnHelper = createColumnHelper<Term>();

const textEmptyLast: SortingFn<Term> = (rowA, rowB, columnId) => {
  const a = rowA.getValue(columnId) as string;
  const b = rowB.getValue(columnId) as string;

  if (a === undefined && b === undefined) return 0;
  if (a === undefined || a === '') return 1;
  if (b === undefined || b === '') return -1;

  return a.localeCompare(b);
};

const columns = [
  {
    id: 'detaljer',
    header: () => null,
    cell: ({ row }: { row: Row<Term> }) => <ExpandButton row={row} />,
    enableSorting: false,
  },
  columnHelper.accessor('en', {
    header: 'Engelsk',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('nb', {
    header: 'Bokmål',
    cell: (info) => info.getValue(),
    sortingFn: 'textEmptyLast',
  }),
  columnHelper.accessor('nn', {
    header: 'Nynorsk',
    cell: (info) => info.getValue(),
    sortingFn: 'textEmptyLast',
  }),
  columnHelper.accessor('field', {
    header: 'Fagfelt',
    cell: (info) => info.getValue(),
    filterFn: 'subject',
    sortingFn: 'textEmptyLast',
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
  const [sorting, setSorting] = useState<SortingState>([]);
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
      sorting,
    },
    filterFns: {
      subject: subjectFilter,
    },
    sortingFns: {
      textEmptyLast,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: translationFilter,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
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
        <div className={style.tableScrollWrapper}>
          <table className={style.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      tabIndex={header.column.getCanSort() ? 0 : undefined}
                      onKeyDown={handleKeyDown(header.column.getToggleSortingHandler())}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          style={header.column.getCanSort() ? { cursor: 'pointer', userSelect: 'none' } : {}}
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                              : undefined
                          }
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <SortingIndicator isSorted={header.column.getIsSorted()} />
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <tr className={style.termEntry}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        tabIndex={cell.column.id !== 'detaljer' ? 0 : undefined}
                        onClick={cell.column.id !== 'detaljer' ? row.getToggleExpandedHandler() : undefined}
                        onKeyDown={
                          cell.column.id !== 'detaljer' ? handleKeyDown(row.getToggleExpandedHandler()) : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() ? (
                    <tr>
                      <td colSpan={1} />
                      <td colSpan={columns.length}>
                        <TermDetaljer term={row.original} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <Paginator table={table} />
      </div>
    </div>
  );
}

type ExpandButtonProps = {
  row: Row<Term>;
};

function ExpandButton({ row }: ExpandButtonProps) {
  return (
    <button onClick={row.getToggleExpandedHandler()} className={style.expandButton} tabIndex={0}>
      {row.getIsExpanded() ? (
        <i aria-hidden className="fa-solid fa-angle-up" />
      ) : (
        <i aria-hidden className="fa-solid fa-angle-down" />
      )}
    </button>
  );
}

type SortingIndicatorProps = {
  isSorted: false | SortDirection;
};

const SortingIndicator = ({ isSorted }: SortingIndicatorProps) => {
  return (
    <span>
      {' '}
      {isSorted === 'asc' ? (
        <i className="fa-solid fa-angle-up" />
      ) : isSorted === 'desc' ? (
        <i className="fa-solid fa-angle-down" />
      ) : null}
    </span>
  );
};
