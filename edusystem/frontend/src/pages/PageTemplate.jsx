import PageContainer from "../components/layout/PageContainer";
export default function PageTemplate({ title, description, children }) {
  return <PageContainer title={title} description={description}>{children || <section className="panel"><p className="muted">Man hinh da san sang de ket noi API va bo sung nghiep vu chi tiet.</p></section>}</PageContainer>;
}
