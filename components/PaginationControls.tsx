type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function PaginationControls({ page, totalPages, onPrevious, onNext }: PaginationControlsProps) {
  return (
    <div className="pagination">
      <button type="button" className="btn btn-secondary" disabled={page <= 1} onClick={onPrevious}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button type="button" className="btn btn-secondary" disabled={page >= totalPages} onClick={onNext}>
        Next
      </button>
    </div>
  );
}
