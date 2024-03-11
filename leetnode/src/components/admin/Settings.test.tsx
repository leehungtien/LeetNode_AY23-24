import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from './Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Role } from "@prisma/client"; // Assuming Role is imported from @prisma/client or defined somewhere in your code

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

jest.mock('axios');
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Adjusted to include a mock session with the correct type
const mockSession = {
  expires: '2024-12-31T23:59:59.999Z',
  user: {
    id: 'user1', // Assuming an id is required
    name: 'User One', // name, email, and image are optional based on your type definition
    username: 'UserOneUsername', // Added to match expected type
    role: Role.USER, // Adjust based on your Role enum or type definition
    // email: 'user@example.com', // Include if necessary
    // image: 'path/to/image.jpg', // Include if necessary
  },
};

// Define a helper function to setup the test environment
const setup = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={mockSession}>
        <Settings />
      </SessionProvider>
    </QueryClientProvider>
  );
};

describe('Settings Component', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation(url => {
      if (url === '/api/user/admin') {
        return Promise.resolve({ data: [{ id: 'user1', username: 'User One', role: 'USER', attempts: [] }] });
      } else if (url === '/api/topic') {
        return Promise.resolve({ data: [{ topicSlug: 'topic1', topicName: 'Test Topic' }] });
      }
      return Promise.reject(new Error('URL not found'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', async () => {
    setup();
    await waitFor(() => expect(screen.getByTestId('loader')).toBeInTheDocument());
  });

  test('displays user and topics data after successful fetch', async () => {
    setup();
    await waitFor(() => expect(screen.getByText('User One')).toBeInTheDocument());
    await waitFor(() => {
      expect(screen.getByText(new RegExp('Test Topic', 'i'))).toBeInTheDocument();
    });
  });

  test('updates email frequency and shows success toast on submission', async () => {
    setup();
    const newFrequency = 'WEEKLY';

    await waitFor(() => {
      const select = screen.getByLabelText('Edit Your Email Alert Frequency');
      fireEvent.change(select, { target: { value: newFrequency } });
    });

    mockedAxios.post.mockResolvedValueOnce({ data: 'Success' });
    fireEvent.click(screen.getByText('Confirm Changes'));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Successfully updated!'));
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/admin/settings/updateEmailFreq', expect.anything());
  });

  test('handles API failure gracefully on update attempt', async () => {
    setup();
    mockedAxios.post.mockRejectedValueOnce(new Error('Failed to update'));
  
    // Trigger the action that leads to the API call
    fireEvent.click(screen.getByText('Confirm Changes'));
  
    // Wait for the expected outcome
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to update'));
  });
  

  // Additional tests here for resetting attempts, editing user details, etc.
  // Each test should simulate user actions, make assertions on expected outcomes, and mock API responses as needed.
});
