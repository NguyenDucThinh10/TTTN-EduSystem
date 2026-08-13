import FileDownload from './FileDownload';

export default function FilePreview({ fileUrl }) {
  if (!fileUrl) return <span>Chua co file.</span>;
  return (
    <div className="file-preview">
      <span>{fileUrl.split('/').pop()}</span>
      <FileDownload fileUrl={fileUrl} />
    </div>
  );
}
