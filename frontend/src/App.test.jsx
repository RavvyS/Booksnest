import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App Smoke Test', () => {
  test('renders the landing page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    // Check for a known text on the landing page
    expect(screen.getByText(/BookNest/i)).toBeInTheDocument();
  });
});
