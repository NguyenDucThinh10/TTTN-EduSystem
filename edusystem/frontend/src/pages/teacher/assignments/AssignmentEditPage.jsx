import AssignmentForm from "../../../components/forms/AssignmentForm"; import PageTemplate from "../../PageTemplate";
export default function AssignmentEditPage() { return <PageTemplate title="Chỉnh sửa bài tập" description="Cập nhật nội dung và hạn nộp bài tập."><section className="panel"><AssignmentForm initial={{ title: "Bài tập vòng lặp", maxScore: 10 }} /></section></PageTemplate>; }
