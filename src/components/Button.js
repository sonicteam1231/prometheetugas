import React from 'react';

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  let baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-colors duration-200';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-blue-600 text-white hover:bg-blue-700';
      break;
    case 'secondary':
      variantStyles = 'bg-gray-300 text-gray-800 hover:bg-gray-400';
      break;
    case 'success':
        variantStyles = 'bg-green-600 text-white hover:bg-green-700';
        break;
    case 'danger':
        variantStyles = 'bg-red-600 text-white hover:bg-red-700';
        break;
    default:
      variantStyles = 'bg-blue-600 text-white hover:bg-blue-700';
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;