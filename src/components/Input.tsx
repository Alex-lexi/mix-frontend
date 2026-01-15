import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="mb-4 w-full">
        {label && (
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field text-sm md:text-base ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs md:text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
