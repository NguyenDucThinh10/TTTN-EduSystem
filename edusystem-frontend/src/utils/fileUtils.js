import { ALLOWED_FILE_EXTENSIONS, MAX_UPLOAD_SIZE_MB } from '../constants/fileTypes';

export function fileHref(fileUrl) {
  if (!fileUrl) return '';
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;
  return `http://localhost:8080${fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`}`;
}

export function fileExtension(filename = '') {
  return filename.includes('.') ? filename.split('.').pop().toLowerCase() : '';
}

export function validateUploadFile(file) {
  if (!file) return 'Chua chon file.';
  if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) return `File khong duoc vuot qua ${MAX_UPLOAD_SIZE_MB}MB.`;
  if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension(file.name))) return 'Dinh dang file khong hop le.';
  return '';
}
