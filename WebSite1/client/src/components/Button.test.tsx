import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-secondary');
  });

  it('applies danger variant when specified', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-danger');
  });

  it('applies medium size by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-medium');
  });

  it('applies small size when specified', () => {
    render(<Button size="small">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-small');
  });

  it('applies large size when specified', () => {
    render(<Button size="large">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-large');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('merges custom className with default classes', () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-medium', 'custom-class');
  });

  it('forwards additional props to button element', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('data-testid', 'submit-btn');
  });
});

