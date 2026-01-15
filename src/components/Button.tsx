import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  variant = 'primary', 
  children, 
  loading, 
  disabled, 
  className = '',
  size = 'md',
  ...props 
}: ButtonProps) {
  const baseSizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const baseClass = `${baseSizes[size]} rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px] min-w-[44px] md:min-h-auto md:min-w-auto`;
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
}
