import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="text-base md:text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}
