import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  it('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByText(/React \+ TypeScript \+ Vite/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the counter with initial value of 0', () => {
    render(<App />);
    const countDisplay = screen.getByText(/Count: 0/i);
    expect(countDisplay).toBeInTheDocument();
  });

  it('increments the counter when increment button is clicked', () => {
    render(<App />);
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    
    fireEvent.click(incrementButton);
    expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();
    
    fireEvent.click(incrementButton);
    expect(screen.getByText(/Count: 2/i)).toBeInTheDocument();
  });

  it('decrements the counter when decrement button is clicked', () => {
    render(<App />);
    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    
    fireEvent.click(decrementButton);
    expect(screen.getByText(/Count: -1/i)).toBeInTheDocument();
  });

  it('resets the counter when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });
    
    // Increment a few times
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    expect(screen.getByText(/Count: 3/i)).toBeInTheDocument();
    
    // Reset
    await user.click(resetButton);
    expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
  });

  it('renders all three buttons', () => {
    render(<App />);
    
    expect(screen.getByRole('button', { name: /increment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrement/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  // ❌ INTENTIONALLY FAILING TESTS FOR DEMONSTRATION ❌

  it('FAIL: counter should start at 10 (wrong expectation)', () => {
    render(<App />);
    // This will fail because counter starts at 0, not 10
    expect(screen.getByText(/Count: 10/i)).toBeInTheDocument();
  });

  it('FAIL: should have a submit button (element does not exist)', () => {
    render(<App />);
    // This will fail because there's no submit button in the component
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('FAIL: increment should add 5 instead of 1', () => {
    render(<App />);
    const incrementButton = screen.getByRole('button', { name: /increment/i });

    fireEvent.click(incrementButton);
    // This will fail because increment adds 1, not 5
    expect(screen.getByText(/Count: 5/i)).toBeInTheDocument();
  });
});

