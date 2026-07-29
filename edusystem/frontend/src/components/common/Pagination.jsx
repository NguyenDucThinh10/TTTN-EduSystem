import Button from "./Button";
export default function Pagination({ page, totalPages, onChange }) {
  return <div className="actions"><Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>Truoc</Button><span>Trang {page}/{totalPages}</span><Button variant="secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Sau</Button></div>;
}
