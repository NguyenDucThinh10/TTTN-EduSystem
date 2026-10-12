export default function FileUpload({ disabled, file, label = 'Chon file', onChange }) {
  return (
    <label className="file-upload">
      <span>{label}</span>
      <input disabled={disabled} type="file" onChange={(event) => onChange?.(event.target.files?.[0] || null)} />
      {file && <small>{file.name}</small>}
    </label>
  );
}
