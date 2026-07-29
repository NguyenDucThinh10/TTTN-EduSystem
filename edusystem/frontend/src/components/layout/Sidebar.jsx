import { NavLink } from "react-router-dom";
export default function Sidebar({ title, items = [] }) {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark">EL</span><div><strong>EduLMS</strong><small>{title}</small></div></div><nav>{items.map((item) => <NavLink key={item.to} to={item.to} end={item.end}>{item.icon}<span>{item.label}</span></NavLink>)}</nav></aside>;
}
