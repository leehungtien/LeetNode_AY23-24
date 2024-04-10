import { render, screen, waitFor } from '@testing-library/react';
import Overview from './Overview';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockUsers = [
  {
    username: 'user1',
    masteries: [
      { topicPing: true, masteryLevel: 80 },
      { topicPing: false, masteryLevel: 60 },
    ],
  },
  {
    username: 'user2',
    masteries: [
      { topicPing: true, masteryLevel: 70 },
      { topicPing: true, masteryLevel: 90 },
    ],
  },
  // Add more mock users as needed
];

const mockCourses = [
  {
    courseId: 1,
    courseName: 'Course A',
    // Add other course details as needed
  },
  {
    courseId: 2,
    courseName: 'Course B',
    // Add other course details as needed
  },
  // Add more mock courses as needed
];

const mockAttempts = [
  {
    questionWithAddedTime: {
      question: {
        topicSlug: 'topic-1',
        topic: { topicName: 'Topic 1' },
      },
    },
    isCorrect: true,
  },
  {
    questionWithAddedTime: {
      question: {
        topicSlug: 'topic-2',
        topic: { topicName: 'Topic 2' },
      },
    },
    isCorrect: false,
  },
  // Add more mock attempts as needed
];

jest.mock('axios', () => ({
  get: jest.fn((url) => {
    if (url === '/api/user/admin') {
      return Promise.resolve({ data: mockUsers });
    } else if (url === '/api/course') {
      return Promise.resolve({ data: mockCourses });
    } else if (url === '/api/attempt/admin') {
      return Promise.resolve({ data: mockAttempts });
    }
    return Promise.reject(new Error('Invalid URL'));
  }),
}));

jest.mock('react-chartjs-2', () => ({
  Bar: () => null, // Mock the Bar chart component to render nothing during tests
}));

const queryClient = new QueryClient();

// Mock ResizeObserver
class ResizeObserver {
  observe() {
      // do nothing
  }
  unobserve() {
      // do nothing
  }
  disconnect() {
      // do nothing
  }
}

describe('Overview component', () => {
  it('renders statistics after data fetching', async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Overview />
        </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Students to help')).toBeInTheDocument();
      expect(screen.getByText('Best Student')).toBeInTheDocument();
      expect(screen.getByText('Weakest Student')).toBeInTheDocument();

    })
  });
});
