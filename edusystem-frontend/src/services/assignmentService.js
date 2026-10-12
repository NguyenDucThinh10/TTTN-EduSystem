import { assignmentApi } from '../api/assignmentApi';
import { toApiDate } from '../utils/dateUtils';

export const assignmentService = {
  listByClass: assignmentApi.listByClass,
  detail: assignmentApi.detail,
  remove: assignmentApi.remove,
  async save({ assignmentId, payload, file }) {
    let fileUrl = payload.fileUrl;
    if (file) {
      const uploaded = await assignmentApi.uploadFile(file);
      fileUrl = uploaded.fileUrl;
    }

    const body = {
      ...payload,
      classId: Number(payload.classId),
      dueDate: toApiDate(payload.dueDate),
      maxScore: Number(payload.maxScore),
      weight: 1,
      fileUrl,
    };

    return assignmentId
      ? assignmentApi.update(assignmentId, body)
      : assignmentApi.create(body);
  },
};
