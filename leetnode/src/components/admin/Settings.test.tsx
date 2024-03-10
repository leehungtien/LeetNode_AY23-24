import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from './Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import axios from 'axios'; // Ensure axios is imported
import toast from 'react-hot-toast';

// Mock external modules
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Polyfill ResizeObserver to prevent "ReferenceError: ResizeObserver is not defined" in Jest
global.ResizeObserver = class ResizeObserver {
    callback: any;
    constructor(callback: any) {
      this.callback = callback;
    }
    observe() {
      // Mock implementation
    }
    unobserve() {
      // Mock implementation
    }
    disconnect() {
      // Mock implementation
    }
  };

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
    // Mock implementation remains the same
  
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={{ expires: '2024-12-31T23:59:59.999Z' }}>
          <Settings />
        </SessionProvider>
      </QueryClientProvider>
    );
  
    await waitFor(() => {
      // Use findByText for async elements
      expect(screen.findByText('User1')).resolves.toBeInTheDocument();
      expect(screen.findByText('Test Topic')).resolves.toBeInTheDocument();
    });
  });
});
