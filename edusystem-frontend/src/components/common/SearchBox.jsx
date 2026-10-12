export default function SearchBox({ onChange, placeholder = 'Tim kiem...', value }) {
  return (
    <label className="search-box">
      <input value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  );
}
