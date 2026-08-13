import { fileHref } from '../../utils/fileUtils';

export default function FileDownload({ fileUrl, label = 'Tai file' }) {
  if (!fileUrl) return null;
  return <a href={fileHref(fileUrl)} target="_blank" rel="noreferrer">{label}</a>;
}
