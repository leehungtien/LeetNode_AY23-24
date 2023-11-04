import React from 'react';
import { render, screen, waitFor, } from '@testing-library/react';
import Leaderboard from './Leaderboard';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from '@testing-library/user-event'

// Mock the axios get method to simulate API call
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
}));

const queryClient = new QueryClient();

// Mock ResizeObserver
class ResizeObserver {
  observe() {
      // do nothing
  }
  unobserve() {
      // do nothing
  }
  disconnect() {
      // do nothing
  }
}

window.ResizeObserver = ResizeObserver;
test('renders Leaderboard component', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Leaderboard />
    </QueryClientProvider>
  );

  // Wait for the component to load
  await waitFor(() => {
    // Check for specific content
    expect(screen.getByText("Leaderboard")).toBeTruthy();
    const searchInput = screen.queryByPlaceholderText(/Search User/);
    if (searchInput) {
      expect(searchInput).toBeInTheDocument();
  
      // // Simulate user interaction (example: changing the search input)
      // const user = userEvent.setup()
      // user.type(searchInput, 'Test User');

      // // Validate the component's response
      // expect(screen.getByText('Test User')).toBeTruthy();
    }

    // Verify snapshots
    // expect(screen.container.firstChild).toMatchSnapshot();
  });
});
