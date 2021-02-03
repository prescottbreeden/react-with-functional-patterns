import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  const title = screen.getByText(/Let's make a panda!/i);
  expect(title).toBeInTheDocument();
});
