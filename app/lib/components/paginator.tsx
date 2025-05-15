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
        <i aria-hidden className="fa-solid fa-backward-fast" />
      </button>
      <button
        className={style.paginatorButton}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <i aria-hidden className="fa-solid fa-play fa-flip-horizontal" />
      </button>
      <button className={style.paginatorButton} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        <i aria-hidden className="fa-solid fa-play" />
      </button>
      <button className={style.paginatorButton} onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
        <i aria-hidden className="fa-solid fa-forward-fast" />
      </button>
    </div>
  );
};
