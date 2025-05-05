import type { Term } from '~/types/term';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import '~/styles/termliste-ny.module.css';
import { useTransFilter } from '~/lib/use-trans-filter';
import { TranslationFilter } from '~/lib/components/translation-filter';

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
];

export default function Termliste() {
  const table = useReactTable({
    data: defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [setTransFilter, applyTransFilter] = useTransFilter();

  return (
    <div className="container-sm my-2">
      <div className="col-12 col-lg-10 mx-auto">
        <div style={{ marginBottom: '8px' }}>
          <TranslationFilter setTransFilter={setTransFilter} />
        </div>
        <table style={{ borderRadius: '16px', width: '100%' }}>
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
      </div>
    </div>
  );
}
