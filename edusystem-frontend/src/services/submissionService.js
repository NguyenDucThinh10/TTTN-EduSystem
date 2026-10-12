import { submissionApi } from '../api/submissionApi';
import { validateUploadFile } from '../utils/fileUtils';

export const submissionService = {
  mySubmissions: submissionApi.mySubmissions,
  listByAssignment: submissionApi.listByAssignment,
  studentsByAssignment: submissionApi.studentsByAssignment,
  detail: submissionApi.detail,
  submit(assignmentId, file) {
    const message = validateUploadFile(file);
    if (message) throw new Error(message);
    return submissionApi.submit(assignmentId, file);
  },
  resubmit(assignmentId, file) {
    const message = validateUploadFile(file);
    if (message) throw new Error(message);
    return submissionApi.resubmit(assignmentId, file);
  },
  cancel: submissionApi.cancel,
};
