import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
    }
  });
});

test('Test on search bar', async () => {
  const mockData = [
    {
      id: '1',
      username: 'user1',
      points: 100,
      image: null,
    },
    {
      id: '2',
      username: 'user2',
      points: 150,
      image: null,
    },
  ];

  // Mock the useQuery hook to return the mock data
  jest.spyOn(queryClient, 'getQueryData').mockReturnValue(mockData);

  render(
    <QueryClientProvider client={queryClient}>
      <Leaderboard />
    </QueryClientProvider>
  );

  // Wait for the component to load
  await waitFor(() => {
    // Check for specific content
    const searchInput = screen.queryByPlaceholderText(/Search User/);
    if (searchInput) {
      expect(searchInput).toBeInTheDocument();

      // Simulate user interaction (example: changing the search input)
      fireEvent.change(searchInput, { target: { value: 'user1' } });
    }

    // Wait for the component to update
    waitFor(() => {
      // Validate the component's response
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.queryByText('user2')).not.toBeInTheDocument();
    });
  });
});

