import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CourseDiscussion from './CourseDiscussion';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedPosts = [
    {
      postId: 1,
      title: 'Sample Post 1',
      // Other fields...
    },
    {
      postId: 2,
      title: 'Sample Post 2',
      // Other fields...
    },
    // Add more mocked post data as needed
];

const mockedCourses = [
    {
        courseName: 'Course 1',
        type: 'Type A',
        courseSlug: 'course-1',
        topics: ['Topic A', 'Topic B'],
        courseLevel: 'Beginner',
        // Other fields...
    },
    {
        courseName: 'Course 2',
        type: 'Type B',
        courseSlug: 'course-2',
        topics: ['Topic C', 'Topic D'],
        courseLevel: 'Intermediate',
        // Other fields...
    },
    // Add more mocked course data as needed
];

const mockedTopics = [
    {
        topicName: 'Topic A',
        // Other fields...
    },
    {
        topicName: 'Topic B',
        // Other fields...
    },
    // Add more mocked topic data as needed
];

// Mock axios to simulate API calls
jest.mock('axios', () => ({
    get: jest.fn((url) => {
      if (url === '/api/forum/getAllPosts') {
        return Promise.resolve({ data: mockedPosts });
      }
      if (url === '/api/forum/getAllCourseNames') {
        return Promise.resolve({ data: mockedCourses });
      }
      if (url === '/api/forum/getAllTopicNames') {
        return Promise.resolve({ data: mockedTopics });
      }
      return Promise.reject(new Error('Not Found'));
    }),
    post: jest.fn(() => Promise.resolve({})),
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

window.ResizeObserver = ResizeObserver;

describe('CourseDiscussion component', () => {
  it('renders without crashing', () => {
    <QueryClientProvider client={queryClient}>
        <CourseDiscussion courseName="Course 1" />
    </QueryClientProvider>
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <QueryClientProvider client={queryClient}>
        <CourseDiscussion courseName="Course 1" />
      </QueryClientProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
