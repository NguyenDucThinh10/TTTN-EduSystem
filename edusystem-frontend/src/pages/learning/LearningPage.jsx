import ClassSelector from './components/ClassSelector';
import LearningHeader from './components/LearningHeader';
import StudentWorkspace from './components/StudentWorkspace';
import TeacherWorkspace from './components/TeacherWorkspace';
import useLearningWorkflow from './useLearningWorkflow';
import './styles/learningLayout.css';
import './styles/teacherAssignments.css';
import './styles/studentAssignments.css';
import './styles/analyticsPanel.css';

export default function LearningPage({ user, onLogout }) {
  const workflow = useLearningWorkflow(user);

  return (
    <main className="workspace">
      <LearningHeader onLogout={onLogout} title="Hoc tap va danh gia" user={user} />
      <ClassSelector
        classes={workflow.classes}
        selectedClass={workflow.selectedClass}
        selectedClassId={workflow.selectedClassId}
        onClassChange={workflow.setSelectedClassId}
      />
      {workflow.notice && <div className="notice">{workflow.notice}</div>}
      {workflow.loading && <div className="loading-line">Dang tai du lieu...</div>}

      {workflow.isTeacher && (
        <TeacherWorkspace
          assignments={workflow.assignments}
          assignmentDetail={workflow.assignmentDetail}
          classAnalytics={workflow.classAnalytics}
          dashboard={workflow.dashboard}
          editingId={workflow.editingId}
          form={workflow.form}
          gradeForms={workflow.gradeForms}
          handleAssignmentChange={workflow.handleAssignmentChange}
          onAssignmentFileChange={workflow.onAssignmentFileChange}
          onCancelEdit={workflow.onCancelEdit}
          onDelete={workflow.onDeleteAssignment}
          onGrade={workflow.onGrade}
          onSelectAssignment={workflow.onSelectAssignment}
          onStartEdit={workflow.onStartEdit}
          onSubmitAssignmentForm={workflow.onSubmitAssignmentForm}
          selectedAssignmentId={workflow.selectedAssignmentId}
          updateGradeForm={workflow.updateGradeForm}
        />
      )}

      {workflow.isStudent && (
        <StudentWorkspace
          assignments={workflow.assignments}
          mySubmissions={workflow.mySubmissions}
          onCancelSubmission={workflow.onCancelSubmission}
          onFileChange={workflow.onFileChange}
          onResubmit={workflow.onResubmit}
          onUpload={workflow.onUpload}
          selectedClass={workflow.selectedClass}
          studentGrades={workflow.studentGrades}
          submittedByAssignment={workflow.submittedByAssignment}
          uploadFiles={workflow.uploadFiles}
        />
      )}
    </main>
  );
}
