import AssignmentForm from "../../../components/forms/AssignmentForm"; import PageTemplate from "../../PageTemplate";
export default function AssignmentCreatePage() { return <PageTemplate title="Tạo bài tập mới" description="Giao bài tập cho lớp học phần."><section className="panel"><AssignmentForm /></section></PageTemplate>; }
