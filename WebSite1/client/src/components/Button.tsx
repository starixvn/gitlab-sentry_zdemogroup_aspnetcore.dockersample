import { ButtonHTMLAttributes } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const classes = `btn btn-${variant} btn-${size} ${className}`.trim();

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;

