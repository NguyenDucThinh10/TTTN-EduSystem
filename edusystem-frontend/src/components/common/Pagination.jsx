export default function Pagination({ page = 0, totalPages = 1, onPageChange }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>Truoc</button>
      <span>{page + 1} / {totalPages}</span>
      <button type="button" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>Sau</button>
    </nav>
  );
}
