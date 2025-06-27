
import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id?: string; 
  options: SelectOption[];
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, error, className, ...props }) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      <label htmlFor={selectId} className="block text-sm font-medium text-content-primary mb-1.5">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        id={selectId}
        className={`block w-full pl-3.5 pr-10 py-2.5 text-content-primary border ${error ? 'border-red-500 focus:ring-red-500' : 'border-ui-border focus:border-brand-DEFAULT focus:ring-brand-DEFAULT'} 
                    focus:outline-none focus:ring-1 sm:text-sm rounded-lg shadow-sm bg-white
                    appearance-none transition-colors duration-150 ease-in-out ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-content-primary">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};