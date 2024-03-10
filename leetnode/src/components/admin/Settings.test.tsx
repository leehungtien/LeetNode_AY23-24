import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from './Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import axios from 'axios'; // Ensure axios is imported

// Mock external modules
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Settings Component', () => {
  // Setup Axios mocks before each test
  beforeEach(() => {
    // Mocking GET requests
    mockedAxios.get.mockImplementation((url) => {
      switch (url) {
        // Add your cases here
        default:
          return Promise.reject(new Error('not found'));
      }
    });

    // Mocking POST requests (adjust according to your component's needs)
    mockedAxios.post.mockImplementation((url, data) => {
      // Example: Mock response for a specific URL
      return Promise.resolve({ data: {/* mocked response data */} });
    });

    // Reset mocks after each test to ensure clean state
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={{ expires: '2024-12-31T23:59:59.999Z' }}>
          <Settings />
        </SessionProvider>
      </QueryClientProvider>
    );
  });

  test('displays loader while fetching data', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={{ expires: '2024-12-31T23:59:59.999Z' }}>
          <Settings />
        </SessionProvider>
      </QueryClientProvider>
    );
  
    const loader = screen.getByTestId('loader'); // Make sure your Loader component has this data-testid attribute
    expect(loader).toBeInTheDocument();
  });

  test('renders user data after successful fetch', async () => {
    mockedAxios.get.mockImplementation(url => {
      if (url.includes('/api/user/admin')) {
        return Promise.resolve({ 
          data: [{ id: '1', username: 'User1', role: 'USER', attempts: [], image: 'image-url' }]
        });
      }
      if (url.includes('/api/topic')) {
        return Promise.resolve({ 
          data: [{ topicSlug: 'test-slug', topicName: 'Test Topic' }]
        });
      }
      return Promise.reject(new Error('not found'));
    });
  
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={{ expires: '2024-12-31T23:59:59.999Z' }}>
          <Settings />
        </SessionProvider>
      </QueryClientProvider>
    );
  
    await waitFor(() => {
      expect(screen.getByText('User1')).toBeInTheDocument();
      expect(screen.getByText('Test Topic')).toBeInTheDocument();
    });
  });
  
  
});
