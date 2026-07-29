export default function Breadcrumb({ items = [] }) {
  return <div className="breadcrumb">{items.map((item, index) => <span key={item}>{index > 0 && " / "}{item}</span>)}</div>;
}
