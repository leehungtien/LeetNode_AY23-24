// Mock ResizeObserver globally
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}; 

import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Performance from "./Performance";

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue({ data: [] }); // Adjust as needed for your component's data fetching

// Mock Chart.js via react-chartjs-2 as an example
jest.mock('react-chartjs-2', () => ({
  Bar: () => null, // Mock out other chart components as needed
}));

// Mock Mantine components that may cause the 'addEventListener' error or are not essential for the tests
jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'), // Use actual implementations for other components
  Select: () => null, // Mock specific components causing issues. Adjust based on your usage.
}));

// Mock data for users
const mockUsersData = {
  data: [
    { id: "1", username: "user1", email: "user1@example.com", lastActive: new Date().toISOString(), masteries: [], attempts: [], image: "" },
    { id: "2", username: "user2", email: "user2@example.com", lastActive: new Date().toISOString(), masteries: [], attempts: [], image: "" },
  ],
};

// Mock data for topics
const mockTopicsData = {
  data: [
    { topicSlug: "topic1", topicName: "Topic 1", topicLevel: 1 },
    { topicSlug: "topic2", topicName: "Topic 2", topicLevel: 2 },
  ],
};

// Mock axios responses
mockedAxios.get.mockImplementation((url) => {
  if (url.includes("/api/user/admin")) {
    return Promise.resolve(mockUsersData);
  }
  if (url.includes("/api/topic")) {
    return Promise.resolve(mockTopicsData);
  }
  return Promise.reject(new Error("not found"));
});

// Initialize a new instance of QueryClient from React Query.
const queryClient = new QueryClient();

describe("Performance component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('renders without crashing by checking for static text "All students who need help!"', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Performance />
      </QueryClientProvider>
    );

    // Example: Waiting for a static text to appear as a sign of successful render
    await waitFor(() => {
      expect(screen.getByText(/All students who need help!/)).toBeInTheDocument();
    });
  });

  it('displays user data after successful data fetch', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Performance />
      </QueryClientProvider>
    );
  
    // Use findByText to wait for asynchronous updates
    // Adjust these based on actual text/content rendered by the component
    const user1 = await screen.findByText("user1");
    const user2 = await screen.findByText("user2");
  
    expect(user1).toBeInTheDocument();
    expect(user2).toBeInTheDocument();
  });
});