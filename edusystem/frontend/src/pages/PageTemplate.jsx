import PageContainer from "../components/layout/PageContainer";
export default function PageTemplate({ title, description, children }) {
  return <PageContainer title={title} description={description}>{children || <section className="panel"><p className="muted">Màn hình đã sẵn sàng để kết nối API và bổ sung nghiệp vụ chi tiết.</p></section>}</PageContainer>;
}
