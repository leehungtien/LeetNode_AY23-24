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

  test('renders student performance data correctly', async () => {
    // Mock data for users and topics
    const mockUsers = {
      data: [
        {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          lastActive: new Date('2022-01-01'),
          image: 'john_avatar.jpg',
          attempts: [],
          masteries: [],
        },
        // Add more mock user data as needed
      ],
    };
  
    const mockTopics = {
      data: [
        {
          topicSlug: 'topic1',
          topicName: 'Topic 1',
          topicLevel: 1,
        },
        // Add more mock topic data as needed
      ],
    };
  
    // Mock the axios.get function used by the component
    jest.mock('axios');
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/user/admin') {
        return Promise.resolve({ data: mockUsers });
      } else if (url === '/api/topic') {
        return Promise.resolve({ data: mockTopics });
      }
      throw new Error('Unexpected URL');
    });
  
    // Render the component
    render(
      <QueryClientProvider client={queryClient}>
        <Performance />
      </QueryClientProvider>
    );
  
    // Wait for data loading and rendering
    await waitFor(() => {
      // Example assertion: Check if a student's username is displayed
      const usernameElement = screen.getByText('john_doe');
      expect(usernameElement).toBeInTheDocument();
  
      // Example assertion: Check if the overall correct percentage is displayed
      const correctPercentageElement = screen.getByText(/Overall correct %/);
      expect(correctPercentageElement).toBeInTheDocument();
  
      // Add more assertions based on your component's structure and expected UI
    });
  });
});






































function getAllUsers() {
  throw new Error("Function not implemented.");
}
// import React from 'react';
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import Performance from './Performance';
// import { DateDiffCalc } from '@/utils/DateDiffCalc';
// import userEvent from '@testing-library/user-event';

// const queryClient = new QueryClient();
// const mock = new MockAdapter(axios);

// describe('Performance Component', () => {
//   beforeEach(() => {
//     mock.reset();
//   });

//   it('renders Performance component without crashing', async () => {
//     const mockUsers = {
//       data: [
//         {
//           id: '1',
//           username: 'john_doe',
//           email: 'john.doe@example.com',
//           lastActive: '2022-01-12T12:00:00.000Z',
//           image: 'john_doe.jpg',
//           attempts: [],
//           masteries: [],
//         },
//       ],
//     };

//     const mockTopics = {
//       data: [
//         {
//           topicSlug: 'math',
//           topicName: 'Mathematics',
//           topicLevel: 'Intermediate',
//         },
//       ],
//     };

//     mock.onGet('/api/user/admin').reply(200, mockUsers);
//     mock.onGet('/api/topic').reply(200, mockTopics);

//     render(
//       <QueryClientProvider client={queryClient}>
//         <Performance />
//       </QueryClientProvider>
//     );
//   });


//   it('DateDiffCalc returns correct date difference', () => {
//     const currentDate = new Date();
//     const pastDate = new Date(currentDate);
//     pastDate.setDate(currentDate.getDate() - 5);
  
//     const result = DateDiffCalc(pastDate);
  
//     expect(result).toEqual('5 days ago');
//   });  
// });
  




























