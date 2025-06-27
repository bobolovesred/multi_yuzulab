
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'glass' | 'glass-active';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    className = '', 
    ...props 
  }, ref) => {
    const baseStyles = 'font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-ring focus:ring-offset-2 focus:ring-offset-ui-surface transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center backdrop-blur-lg';
    
    // All variants now embrace glassmorphism
    const variantStyles = {
      primary: 'bg-brand-DEFAULT/70 border border-brand-DEFAULT/80 text-brand-dark shadow-glass-button-idle hover:bg-brand-DEFAULT/85 hover:shadow-glass-button-hover', 
      secondary: 'bg-slate-100/50 border border-slate-300/50 text-content-primary shadow-glass-button-idle hover:bg-slate-200/60 hover:shadow-glass-button-hover', // Standard light glass
      outline: 'bg-transparent border-2 border-slate-400/50 text-content-secondary shadow-none hover:bg-white/10 hover:border-slate-500/70 hover:text-content-primary hover:shadow-glass-button-idle', // Minimal border, more transparent
      danger: 'bg-red-500/65 border border-red-500/75 text-white shadow-glass-button-idle hover:bg-red-500/80 hover:shadow-glass-button-hover', 
      ghost: 'bg-transparent text-content-secondary shadow-none hover:bg-slate-500/10 hover:text-content-primary', // Minimal, often for icons
      glass: 'bg-slate-200/30 border border-slate-400/30 text-content-primary shadow-glass-button-idle hover:bg-slate-300/40 hover:shadow-glass-button-hover',
      'glass-active': 'bg-brand-DEFAULT/70 border border-brand-DEFAULT/80 text-brand-dark shadow-glass-button-idle hover:bg-brand-DEFAULT/85 hover:shadow-glass-button-hover'
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs h-8',
      md: 'px-5 py-2.5 text-sm h-10',
      lg: 'px-6 py-3 text-base h-12',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button 
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
