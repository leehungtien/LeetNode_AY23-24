import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from './Settings';
import { SessionProvider } from "next-auth/react";
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Mocking axios
jest.mock('react-hot-toast', () => ({
    ...jest.requireActual('react-hot-toast'), // This line ensures you can use other unmocked parts of the library
    toast: {
      success: jest.fn(),
      // Mock other methods as needed
    },
  }));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mocking react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
}));

// Mocking next-auth/react useSession hook
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
      },
    },
  }),
}));

// Mock data
const usersData = { data: [{ id: '1', username: 'User1', role: 'USER', attempts: [], image: 'image-url' }] };
const topicsData = { data: [{ topicSlug: 'test-slug', topicName: 'Test Topic' }] };

describe('Settings Component', () => {
  beforeAll(() => {
    mockedAxios.get.mockImplementation((url) => {
      switch (url) {
        case '/api/user/admin':
          return Promise.resolve(usersData);
        case '/api/topic':
          return Promise.resolve(topicsData);
        default:
          return Promise.reject(new Error('not found'));
      }
    });
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  const queryClient = new QueryClient();

  test('renders Settings component and loads user and topic data', async () => {
    const { findByText } = render(
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <Settings />
        </QueryClientProvider>
      </SessionProvider>
    );

    expect(await findByText('General')).toBeInTheDocument();
    expect(await findByText('Course Attempts')).toBeInTheDocument();
    // Verify that the component successfully fetched and rendered the data
    expect(await findByText('User1')).toBeInTheDocument();
    expect(await findByText('Test Topic')).toBeInTheDocument();
  });

  // Additional tests for interactions, form submissions, etc., can be added here
});

