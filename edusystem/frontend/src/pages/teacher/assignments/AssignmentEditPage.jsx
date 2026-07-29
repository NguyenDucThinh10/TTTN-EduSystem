import AssignmentForm from "../../../components/forms/AssignmentForm"; import PageTemplate from "../../PageTemplate";
export default function AssignmentEditPage() { return <PageTemplate title="Chinh sua bai tap" description="Cap nhat noi dung va han nop bai tap."><section className="panel"><AssignmentForm initial={{ title: "Bai tap vong lap", maxScore: 10 }} /></section></PageTemplate>; }
