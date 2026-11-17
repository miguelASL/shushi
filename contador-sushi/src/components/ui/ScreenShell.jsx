export default function ScreenShell({ children, className = '' }) {
  return (
    <div className={`screen-pad relative flex flex-col ${className}`}>
      {children}
    </div>
  );
}
