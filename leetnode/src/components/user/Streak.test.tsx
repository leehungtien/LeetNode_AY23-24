// streak.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import Streak from './Streak'; // Adjust the import path to your file structure

// TypeScript interfaces for mocking data
interface UserData {
  loginStreak: number;
  lastActive: string;
  attempts: Record<string, number>;
  points: number;
}

interface User {
  id: string;
  points: number;
}

// Mocking axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mocking next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

const mockedUseSession = useSession as jest.Mock<any>;

// Mocking react-query
jest.mock('@tanstack/react-query', () => {
  // Import the original module to not mock everything
  const originalModule = jest.requireActual('@tanstack/react-query');

  return {
    ...originalModule, // Use actual implementation for QueryClient
    useQuery: jest.fn().mockReturnValue({
      isLoading: true,
      data: undefined,
      isError: false,
      error: null,
    }),
  };
});


const mockedUseQuery = useQuery as jest.Mock<any>;

// Setup QueryClient for wrapping the component
const queryClient = new QueryClient();

// Mock data
const mockedUserData: UserData = {
  loginStreak: 5,
  lastActive: '2023-03-15',
  attempts: { '2023-03-15': 1 },
  points: 100,
};

const mockedAllUsers: User[] = [
  { id: 'user1', points: 100 },
];

describe('Streak Component', () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue({ data: mockedUserData });
    mockedAxios.get.mockResolvedValue({ data: mockedAllUsers });
    mockedUseSession.mockReturnValue({ data: { user: { id: 'user1' } }, status: 'authenticated' });
    mockedUseQuery.mockImplementation((queryKey: any) => {
      if (queryKey.queryKey[0] === 'userInfo') {
        return { data: mockedUserData, isLoading: false, isError: false };
      } else if (queryKey.queryKey[0] === 'challenge') {
        return { data: mockedAllUsers, isLoading: false, isError: false };
      }
      return { data: null, isLoading: false, isError: false };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing by checking for static text', async () => {
    mockedUseQuery.mockReturnValueOnce({ isLoading: true });

    render(
      <QueryClientProvider client={queryClient}>
        <Streak />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Daily Streak/i)).toBeInTheDocument();
    });
  });

  it('renders user info and interactions correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Streak />
      </QueryClientProvider>
    );

    // Asserting text content based on mock data
    await waitFor(() => expect(screen.getByText('Login Streak')).toBeInTheDocument());
    expect(screen.getByText('5')).toBeInTheDocument(); // Login streak value

    // Example interaction: clicking on a calendar day (adjust selector as needed)
    // const dayElement = screen.getByRole('button', { name: /15/i }); // Assuming days are buttons
    // userEvent.click(dayElement);
    // Expect some state update or UI response to this interaction
  });

  // Add more tests as needed to cover other functionalities and interactions
});
