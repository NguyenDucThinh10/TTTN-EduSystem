import SubmissionForm from "../../../components/forms/SubmissionForm"; import PageTemplate from "../../PageTemplate";
export default function SubmitAssignmentPage() { return <PageTemplate title="Nộp bài tập" description="Tải file bài làm và gửi cho giảng viên."><section className="panel"><SubmissionForm /></section></PageTemplate>; }
