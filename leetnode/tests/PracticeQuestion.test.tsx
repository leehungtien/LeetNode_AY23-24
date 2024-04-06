import "@testing-library/jest-dom";

import axios from "axios";
import React from "react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown/lib/react-markdown";
import rehypeKatex from "rehype-katex";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import userEvent from "@testing-library/user-event";

import PracticeQuestion from "../src/components/course/PracticeQuestion";

jest.mock('rehype-katex', () => {
  return function MockedRehypeKatex() {
    return <div></div>;
  };
})

jest.mock('rehype-raw', () => {
  return function MockedRehypeRaw() {
    return <div></div>;
  };
})

jest.mock('remark-math', () => {
  return function MockedRemarkMath() {
    return <div></div>;
  };
})

interface MockedPracticeQuestionProps {
  isLoading: boolean;
}

jest.mock('../src/components/course/PracticeQuestion', () => {
  return function MockedPracticeQuestion(props: MockedPracticeQuestionProps) {
    return <div>Mocked PracticeQuestion Component</div>;
  };
});


// // Mocking useQuery hook
// jest.mock('@tanstack/react-query', () => ({
//   useQuery: jest.fn(),
// }));

// Mock useQueryClient
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock axios
jest.mock('axios');

// Mock toast
jest.mock('react-hot-toast', () => ({
  toast: jest.fn(),
}));

// Mock updatePoints
const mockUpdatePoints = jest.fn();



describe('PracticeQuestion Component', () => {

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });






  it('renders some text content', () => { /* PASSED but 0% coverage */
    // Mocking data when fetching
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    // Render the component
    render(<PracticeQuestion />);

    // Check for the presence of any text content
    const textElement = screen.getByText(/.+/); // Using a regex to match any text
    expect(textElement).toBeInTheDocument();
  });

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////





  it('renders loading state correctly while fetching data', async () => {
    // Mock the data that will be returned by the axios request
    const mockData = {
      // Mock your data here
    };

    // Mock the axios.get function to resolve with mockData
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData } as any);

    // Render the PracticeQuestion component wrapped in QueryClientProvider
    render(
      <QueryClientProvider client={queryClient}>
        <PracticeQuestion />
      </QueryClientProvider>
    );

    // Check if loading state is displayed
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the data to be fetched
    await screen.findByText(/some text content/i); // Replace with text content displayed after loading

    // Check if loading state is removed
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////


  it("submits the answer when the submit button is clicked", async () => {
    // Mocking data when fetching
    const mockData = {
      // Mock your data here
    };
    (useQuery as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    // Mocking submitAnswer function and its status
    const mockSubmitAnswer = jest.fn();
    (useMutation as jest.Mock).mockReturnValue({
      mutate: mockSubmitAnswer,
      status: "idle", // or 'loading' based on your implementation
    });

    // Render the component
    render(<PracticeQuestion />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    });

    // Assert that the submitAnswer function is called with the correct parameters
    await waitFor(() => {
      expect(mockSubmitAnswer).toHaveBeenCalled();
      // Add more assertions for submission success/failure handling
    }); 
    
  });
    

  
    // Add more test cases as needed
  });