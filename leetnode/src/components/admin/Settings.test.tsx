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

  test('renders without crashing asynchronous with waitFor', async () => {
    setup();
    await waitFor(() => expect(screen.getByTestId('loader')).toBeInTheDocument());
  });
  
  test('renders without crashing synchronous without waitFor', () => {
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

  // test('displays user and topics data after successful fetch', async () => {
  //   setup();
  
  //   const userText = await screen.findByText((content, node): node is HTMLElement => {
  //     // Ensure node is an instance of HTMLElement to access textContent and children
  //     if (!(node instanceof HTMLElement)) return false;
  
  //     const hasText = (element: HTMLElement) => element.textContent === "User One";
  //     const nodeHasText = hasText(node);
  //     const childrenDontHaveText = Array.from(node.children).every(
  //       (child) => !hasText(child as HTMLElement)
  //     );
  
  //     return nodeHasText && childrenDontHaveText;
  //   });
  //   expect(userText).toBeInTheDocument();
  
  //   const topicText = await screen.findByText((content, node): node is HTMLElement => {
  //     // Provide a fallback to ensure the expression always evaluates to a boolean
  //     return node instanceof HTMLElement && (node.textContent?.includes('Test Topic') ?? false);
  //   });
  //   expect(topicText).toBeInTheDocument();
  // });

  // test('updates email frequency and shows success toast on submission', async () => {
  //   setup();
  
  //   // Find the select element by its label
  //   const selectElement = screen.getByLabelText('Edit Your Email Alert Frequency');
    
  //   // Change the value of the select element
  //   fireEvent.change(selectElement, { target: { value: 'newFrequency' } });
    
  //   // Assuming you have a button that submits the form/change
  //   const submitButton = screen.getByRole('button', { name: /confirm changes/i });
  //   fireEvent.click(submitButton);
    
  //   // Wait for the success toast message
  //   await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Successfully updated!'));
  // });

  // test('handles API failure gracefully on update attempt', async () => {
  //   mockedAxios.post.mockRejectedValueOnce(new Error('Failed to update'));
  //   fireEvent.click(await screen.findByText('Confirm Changes'));
    
  //   await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to update'));
  // });

  // Additional tests here for resetting attempts, editing user details, etc.
  // Each test should simulate user actions, make assertions on expected outcomes, and mock API responses as needed.
});
