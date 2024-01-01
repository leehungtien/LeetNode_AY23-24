import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Courses from './Courses'; // adjust the path based on your project structure

// Mocking the dynamic import for the CustomRichTextEditor
jest.mock('@/components/editor/CustomRichTextEditor', () => ({
  __esModule: true,
  default: () => <div>Mocked CustomRichTextEditor</div>,
}));

// Mocking the axios module
jest.mock('axios');

// Mocking the react-query hooks
jest.mock('@tanstack/react-query');

// Mocking the react-markdown module
jest.mock('react-markdown/lib/react-markdown', () => ({
  __esModule: true,
  ReactMarkdown: () => <div>Mocked ReactMarkdown</div>,
}));

// Mocking the rehype-katex module
jest.mock('rehype-katex', () => ({
  __esModule: true,
  default: () => <div>Mocked Katex</div>,
}));

// Mocking the rehype-raw module
jest.mock('rehype-raw', () => ({
  __esModule: true,
  default: () => <div>Mocked RehypeRaw</div>,
}));

// Mocking the remark-math module
jest.mock('remark-math', () => ({
    __esModule: true,
    math: () => {},
  }));

const queryClient = new QueryClient();

const mockUserData = {
    data: [
      {
        userId: 'user-1',
        masteries: [
          {
            topicSlug: 'geography',
            masteryLevel: 0.8,
          },
          {
            topicSlug: 'math',
            masteryLevel: 0.6,
          },
        ],
      },
      {
        userId: 'user-2',
        masteries: [
          {
            topicSlug: 'geography',
            masteryLevel: 0.9,
          },
          {
            topicSlug: 'math',
            masteryLevel: 0.7,
          },
        ],
      },
    ],
  };
  
  const mockCourseData = {
    data: [
      {
        courseSlug: 'course-1',
        courseName: 'Introduction to Geography',
        courseLevel: 'Intermediate',
        courseDescription: 'A comprehensive course covering geographical concepts.',
        courseMedia: [
          {
            publicId: 'public-id-1',
            courseMediaURL: 'https://example.com/image1.jpg',
            mediaName: 'Geography Slide 1',
          },
        ],
        video: 'https://example.com/intro-geography-video.mp4',
        markdown: 'Additional resources and information about the course.',
        topics: [
          {
            topicName: 'geography',
            topicSlug: 'geography',
          },
        ],
      },
      {
        courseSlug: 'course-2',
        courseName: 'Advanced Math Concepts',
        courseLevel: 'Advanced',
        courseDescription: 'A challenging course exploring advanced mathematical concepts.',
        courseMedia: [
          {
            publicId: 'public-id-2',
            courseMediaURL: 'https://example.com/image2.jpg',
            mediaName: 'Math Slide 1',
          },
        ],
        video: 'https://example.com/advanced-math-video.mp4',
        markdown: 'In-depth materials for advanced math learners.',
        topics: [
          {
            topicName: 'math',
            topicSlug: 'math',
          },
        ],
      },
    ],
  };
  
  const mockAttemptsData = {
    data: [
      {
        userId: 'user-1',
        questionWithAddedTime: {
          question: {
            questionId: 1,
          },
          addedTime: new Date('2023-01-01T12:00:00Z'),
        },
        isCorrect: true,
        courseSlug: 'course-1',
      },
      {
        userId: 'user-2',
        questionWithAddedTime: {
          question: {
            questionId: 2,
          },
          addedTime: new Date('2023-01-02T15:30:00Z'),
        },
        isCorrect: false,
        courseSlug: 'course-1',
      },
    ],
  };
  
  const mockQuestionsData = {
    data: [
      {
        questionId: 1,
        questionContent: 'What is the capital of France?',
        topicSlug: 'geography',
        variationId: 0,
        questionData: {
          variables: {},
          answers: [
            {
              key: '1',
              answerContent: 'Paris',
              isCorrect: true,
            },
            {
              key: '2',
              answerContent: 'Berlin',
              isCorrect: false,
            },
          ],
        },
      },
      {
        questionId: 2,
        questionContent: 'What is 2 + 2?',
        topicSlug: 'math',
        variationId: 0,
        questionData: {
          variables: {},
          answers: [
            {
              key: '1',
              answerContent: '3',
              isCorrect: false,
            },
            {
              key: '2',
              answerContent: '4',
              isCorrect: true,
            },
          ],
        },
      },
    ],
  };
  
  const mockData = {
    users: mockUserData,
    courses: mockCourseData,
    attempts: mockAttemptsData,
    questions: mockQuestionsData,
  };

  describe('Courses Component', () => {
    beforeAll(() => {
      // Set up mock data in the queryClient
      queryClient.setQueryData(['all-users'], mockData.users);
      queryClient.setQueryData(['all-courses'], mockData.courses);
      queryClient.setQueryData(['all-attempts'], mockData.attempts);
      queryClient.setQueryData(['all-questions'], mockData.questions);
    });
  
    test('renders Courses component', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <Courses />
        </QueryClientProvider>
      );
    });

    // test('renders Courses component with no data', async () => {
    //     render(
    //       <QueryClientProvider client={queryClient}>
    //         <Courses />
    //       </QueryClientProvider>
    //     );
    
    //     // Wait for the loading state to be resolved
    //     await waitFor(() => expect(screen.getByText(/loading editor/i)).toBeInTheDocument());
    
    //     // Assert that the component renders the appropriate message for no data
    //     expect(screen.getByText(/no courses available/i)).toBeInTheDocument();
    //   });
  });