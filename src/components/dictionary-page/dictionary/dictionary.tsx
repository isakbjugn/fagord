import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Term, Language } from "../../../types/term";
import { TermEntry } from './term-entry/term-entry'
import { DictionaryHeader } from './dictionary-header/dictionary-header'
import { getComparator, Order } from '../../utils/sorting'
import style from "./dictionary.module.css";

export const Dictionary = (props: { dictionary: Term[]}) => {
  const { dictionary } = props;
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Language>('en');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Language,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dictionary.length) : 0;

  return (
    <Paper sx={{ width: '100%', mb: 2, bgcolor: 'background.paper' }}>
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          size='small'
        >
          <DictionaryHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {dictionary.slice().sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((term: Term, index: number) => 
                <TermEntry term={term} index={index} key={term._id} />
              )}
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
        </Table>
      </TableContainer>
      <TablePagination
        className={style.paginator}
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        labelRowsPerPage={"Antall ord:"}
        count={dictionary.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
