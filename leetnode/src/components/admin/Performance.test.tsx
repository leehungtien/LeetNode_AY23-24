// Import necessary utilities from testing-library
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Performance from "./Performance";

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
  it('renders Performance component without crashing', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Performance />
      </QueryClientProvider>
    );
  });

  it("fetches and displays user and topic data correctly", async () => {
    render(<Performance />, { wrapper: Wrapper });

    // Wait for the users to be displayed
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.getByText("user2")).toBeInTheDocument();
    });

    // Trigger accordion click to show topic mastery levels
    const user1Accordion = screen.getByText("user1");
    userEvent.click(user1Accordion);

    // Verify that topic names are displayed
    await waitFor(() => {
      expect(screen.getByText("Topic 1")).toBeInTheDocument();
      expect(screen.getByText("Topic 2")).toBeInTheDocument();
    });
  });

  it("handles sort selection change", async () => {
    render(<Performance />, { wrapper: Wrapper });
    
    // Wait for the component to fully load
    await waitFor(() => {
      expect(screen.getByText(/All Students/i)).toBeInTheDocument();
    });

    // Change the sorting option
    userEvent.selectOptions(screen.getByLabelText(/Sort By/i), ["Last Active (Newest)"]);

    // Verify the sort option changed
    await waitFor(() => {
      expect(screen.getByLabelText(/Sort By/i)).toHaveValue("Last Active (Newest)");
    });
  });

  it("filters students needing help when checkbox is checked", async () => {
    render(<Performance />, { wrapper: Wrapper });

    // Wait for the component to fully load
    await waitFor(() => {
      expect(screen.getByLabelText(/All students who need help!/i)).toBeInTheDocument();
    });

    // Click the checkbox to filter students
    userEvent.click(screen.getByLabelText(/All students who need help!/i));

    // Wait for the state to update
    await waitFor(() => {
      expect(screen.getByLabelText(/All students who need help!/i)).toBeChecked();
    });

    // Additional assertions can be added here to verify the filtering logic
    // For example, if your mock data includes a user who needs help, check if only that user is displayed
  });

  // You can add more tests here to cover user interactions, state changes, and edge cases
});
