export default function Button({ children, className = '', variant = 'default', ...props }) {
  return (
    <button className={`ui-button ${variant} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  );
}
