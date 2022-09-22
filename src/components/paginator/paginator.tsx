import { Pagination, PaginationItem, PaginationLink } from "reactstrap"

interface PaginatorProps {
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  tableLength: number;
}

const Paginator = ({pageIndex, setPageIndex, pageSize, tableLength}: PaginatorProps) => {
  const maxPages = Math.ceil(tableLength / pageSize);
  const pages = Array.from(Array(maxPages).keys());
  
  return (
    <Pagination aria-label="Sidenavigering i tabell" className="pagination justify-content-end ">
      <PaginationItem disabled={(pageIndex <= 0) ? true : undefined}>
        <PaginationLink previous onClick={() => setPageIndex(idx => idx--)} />
      </PaginationItem>
      {pages.map(page =>
        <PaginationLink key={page} onClick={() => setPageIndex(page)}>{page+1}</PaginationLink>
      )}
      <PaginationItem disabled={(pageIndex >= maxPages) ? true : undefined} >
        <PaginationLink next onClick={() => setPageIndex(idx => idx++)} />
      </PaginationItem>
    </Pagination>
  )
}

export default Paginator;