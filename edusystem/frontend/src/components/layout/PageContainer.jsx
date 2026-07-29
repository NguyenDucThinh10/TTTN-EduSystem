import Breadcrumb from "./Breadcrumb";
export default function PageContainer({ title, description, actions, breadcrumb = [], children }) {
  return <main className="page">{breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}<div className="page-header"><div><h1 className="page-title">{title}</h1>{description && <p className="page-description">{description}</p>}</div>{actions && <div className="actions">{actions}</div>}</div>{children}</main>;
}
