import { Table } from '@tanstack/react-table';
import style from '~/styles/termliste-ny.module.css';

type Props = {
  table: Table<any>;
};

export const Paginator = ({ table }: Props) => {
  return (
    <div className={style.paginator}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div>Side</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} av {table.getPageCount().toLocaleString()}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Gå til side:
        <input
          type="number"
          min="1"
          max={table.getPageCount()}
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className="border p-1 rounded w-16"
        />
      </span>
      <select
        className="border p-1 rounded"
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 25, 50, 100].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Vis {pageSize}
          </option>
        ))}
      </select>
      <button
        className={style.paginatorButton}
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="fa-solid fa-backward-fast"></span>
      </button>
      <button
        className={style.paginatorButton}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="fa-solid fa-play fa-flip-horizontal"></span>
      </button>
      <button className={style.paginatorButton} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        <span className="fa-solid fa-play"></span>
      </button>
      <button className={style.paginatorButton} onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
        <span className="fa-solid fa-forward-fast"></span>
      </button>
    </div>
  );
};
