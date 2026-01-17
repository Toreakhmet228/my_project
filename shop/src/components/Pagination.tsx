import "./Pagination.css";

interface Props {
  total: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
}

export default function Pagination({
  total,
  limit,
  offset,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePrevious = () => {
    if (offset > 0) {
      onPageChange(Math.max(0, offset - limit));
    }
  };

  const handleNext = () => {
    if (offset + limit < total) {
      onPageChange(offset + limit);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={handlePrevious}
        disabled={offset === 0}
        className="pagination-button"
      >
        Previous
      </button>
      <span className="pagination-info">
        Page {currentPage} of {totalPages} ({total} total)
      </span>
      <button
        onClick={handleNext}
        disabled={offset + limit >= total}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
}
