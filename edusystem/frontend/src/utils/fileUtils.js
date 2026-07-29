import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from "../constants/fileTypes";
export const isAllowedFile = (file) => ALLOWED_FILE_TYPES.includes(file.type);
export const isValidFileSize = (file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
export const formatFileSize = (bytes = 0) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
