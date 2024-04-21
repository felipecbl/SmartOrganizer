
export interface PanelInterface {
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

export const Panel: React.FC<PanelInterface> = ({ children, className = "", title }) => {
  return (
    <div className={`panel ${className}`}>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};