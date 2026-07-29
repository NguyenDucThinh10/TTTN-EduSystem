import ClassroomForm from "../../../components/forms/ClassroomForm"; import PageTemplate from "../../PageTemplate";
export default function ClassroomEditPage() { return <PageTemplate title="Sửa thông tin lớp" description="Cập nhật lớp học phần."><section className="panel"><ClassroomForm initial={{ name: "CS101-01", courseCode: "CS101", teacher: "Trần Thị B" }} /></section></PageTemplate>; }
