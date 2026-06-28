export default function Container({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
