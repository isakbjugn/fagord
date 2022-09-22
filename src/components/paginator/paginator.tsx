import { useEffect, useState } from "react"
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"

interface PaginatorProps {
  onPageChange: (page: number) => void;
  pageSize: number;
  tableLength: number;
}

const Paginator = ({onPageChange, pageSize, tableLength}: PaginatorProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const maxPages = Math.ceil(tableLength / pageSize);
  const pages = Array.from(Array(maxPages).keys());

  useEffect(() => {
    onPageChange(pageIndex);
  }, [pageIndex, onPageChange])

  const toPageTab = (page: number) =>
    <PaginationItem active={page === pageIndex} key={page}>
      <PaginationLink onClick={() => setPageIndex(page)}>
        {page + 1}
      </PaginationLink>
    </PaginationItem>
  
  return (
    <Pagination aria-label="Sidenavigering i tabell" className="pagination justify-content-end ">
      <PaginationItem disabled={(pageIndex <= 0) ? true : undefined}>
        <PaginationLink previous onClick={() => setPageIndex(pageIndex - 1)} />
      </PaginationItem>
      {pages.map(page => toPageTab(page)) }
      <PaginationItem disabled={(pageIndex >= maxPages - 1) ? true : undefined} >
        <PaginationLink next onClick={() => setPageIndex(pageIndex + 1)} />
      </PaginationItem>
    </Pagination>
  )
}

export default Paginator;