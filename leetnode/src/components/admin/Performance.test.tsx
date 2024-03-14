import { render, screen, act, waitFor } from "@testing-library/react";
//import userEvent from "@testing-library/user-event";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Performance from "./Performance";

// Mock the axios module
jest.mock("axios");

const mockUsersData = {
  data: [
    { id: "1", username: "user1 user1", lastActive: new Date(), masteries: [] },
    { id: "2", username: "user2 user2", lastActive: new Date(), masteries: [] },
  ],
};

const mockTopicsData = [
  { topicSlug: "topic1", topicName: "Topic 1", topicLevel: 1 },
  { topicSlug: "topic2", topicName: "Topic 2", topicLevel: 2 },
];

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Performance component", () => {
  it('renders Performance component without crashing', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Performance />
      </QueryClientProvider>
    );
  });
});