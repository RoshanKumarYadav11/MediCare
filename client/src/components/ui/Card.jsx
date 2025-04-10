export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

export const CardHeader = ({ children, icon: Icon }) => (
  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
    {children}
    {Icon && <Icon className="h-5 w-5 text-blue-600 ml-2" />}
  </div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
);

export const CardContent = ({ children }) => (
  <div className="px-4 py-5 sm:p-6">{children}</div>
);

export const CardFooter = ({ children }) => (
  <div className="px-4 py-4 sm:px-6">{children}</div>
);
