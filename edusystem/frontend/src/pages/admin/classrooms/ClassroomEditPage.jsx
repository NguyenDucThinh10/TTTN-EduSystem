import ClassroomForm from "../../../components/forms/ClassroomForm"; import PageTemplate from "../../PageTemplate";
export default function ClassroomEditPage() { return <PageTemplate title="Sua thong tin lop" description="Cap nhat lop hoc phan."><section className="panel"><ClassroomForm initial={{ name: "CS101-01", courseCode: "CS101", teacher: "Tran Thi B" }} /></section></PageTemplate>; }
