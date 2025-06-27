
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, error, className, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-content-primary mb-1.5">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        className={`block w-full px-3.5 py-2.5 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-ui-border focus:border-brand-DEFAULT focus:ring-brand-DEFAULT'} 
                    rounded-lg shadow-sm bg-white text-content-primary placeholder-content-subtle 
                    focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-150 ease-in-out ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};