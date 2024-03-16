// Import necessary utilities from testing-library
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Performance from "./Performance";
import { IconExclamationMark } from "@tabler/icons";
import toast from "react-hot-toast";

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

// Mock the axios module
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'), // Import actual implementations
  Tooltip: () => null, // Mock out specific components as needed
}));


// Mock data for users and topics
const mockUsersData = {
  data: [
    { id: "1", username: "user1", email: "user1@example.com", lastActive: new Date().toISOString(), masteries: [], attempts: [], image: "" },
    { id: "2", username: "user2", email: "user2@example.com", lastActive: new Date().toISOString(), masteries: [], attempts: [], image: "" },
  ],
};

const mockTopicsData = {
  data: [
    { topicSlug: "topic1", topicName: "Topic 1", topicLevel: 1 },
    { topicSlug: "topic2", topicName: "Topic 2", topicLevel: 2 },
  ],
};

const queryClient = new QueryClient();

// Wrapper component for providing required contexts
const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {  
  jest.mock('react-chartjs-2', () => ({
    Bar: () => null, // Mock Bar as a no-op component
  }));
  
  jest.clearAllMocks();
  mockedAxios.get.mockImplementation((url) => {
    switch (url) {
      case "/api/user/admin":
        return Promise.resolve(mockUsersData);
      case "/api/topic":
        return Promise.resolve(mockTopicsData);
      default:
        return Promise.reject(new Error("not found"));
    }
  });

});

describe("Performance component", () => {
  it('renders without crashing and waits for elements to load', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Performance />
      </QueryClientProvider>
    );
  });
    
  it('displays user data after successful data fetch', async () => {
    // Mocking Axios calls to return successful responses with mock data
    mockedAxios.get.mockImplementation((url) => {
      if (url === "/api/user/admin") {
        return Promise.resolve({ data: mockUsersData });
      }
      if (url === "/api/topic") {
        return Promise.resolve({ data: mockTopicsData });
      }
      return Promise.reject(new Error("not found"));
    });
  
    render(<Performance />, { wrapper: Wrapper });
  
    // Wait for the user data to be displayed, ensuring the component had time to process and render the fetched data
    const user1 = await screen.findByText("user1");
    const user2 = await screen.findByText("user2");
  
    expect(user1).toBeInTheDocument();
    expect(user2).toBeInTheDocument();
  });
  
  
  // You can add more tests here to cover user interactions, state changes, and edge cases
});