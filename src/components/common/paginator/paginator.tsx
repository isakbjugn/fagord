import { useEffect, useState } from "react"
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"

interface PaginatorProps {
  onPageChange: (page: number) => void;
  pageSize: number;
  tableLength: number;
  resetPaginator?: boolean;
}

const Paginator = ({onPageChange, pageSize, tableLength, resetPaginator}: PaginatorProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const numPages = Math.ceil(tableLength / pageSize);
  const pages = Array.from(Array(numPages).keys());
  const lastPage = numPages - 1;

  useEffect(() => {
    setPageIndex(0);
  }, [resetPaginator])

  useEffect(() => {
    onPageChange(pageIndex);
  }, [pageIndex, onPageChange])

  const toPageTab = (page: number) =>
    <PaginationItem active={page === pageIndex} key={page}>
      <PaginationLink onClick={() => setPageIndex(page)}>
        {page + 1}
      </PaginationLink>
    </PaginationItem>
  
  if (numPages < 8) {
    return (
      <Pagination aria-label="Sidenavigering i tabell" className="pagination justify-content-end ">
        { pages.map(page => toPageTab(page)) }
      </Pagination>
    )
  }

  return (
    <Pagination aria-label="Sidenavigering i tabell" className="pagination justify-content-end ">
      {toPageTab(0)}
      {(pageIndex < 3)
        ? [1, 2, 3, 4].map(page => toPageTab(page))
        : <PaginationItem key='prev'>
            <PaginationLink previous onClick={() => setPageIndex(page => page - 1)} />
        </PaginationItem>
      }
      {(pageIndex > 2 && pageIndex < lastPage - 2) &&
        [pageIndex - 1, pageIndex, pageIndex + 1].map(page => toPageTab(page))
      }
      {(pageIndex > lastPage - 3)
        ? [lastPage - 3, lastPage - 2, lastPage - 1].map(page => toPageTab(page))
        : <PaginationItem key='next'>
            <PaginationLink next onClick={() => setPageIndex(page => page + 1)} />
          </PaginationItem>
      }
      {toPageTab(lastPage)}
    </Pagination>
  )
}

export default Paginator;