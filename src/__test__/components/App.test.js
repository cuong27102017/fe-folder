import { render, screen } from '@testing-library/react';
import App from '../../App';

describe('testing App component', () => {
  test('renders Folder Manager', () => {
    render(<App />);
    const linkElement = screen.getByText(/Folder Manager/i);
    expect(linkElement).toBeInTheDocument();
  });
});
