// ResultsPage.test.tsx
// import ShowResults from "../src/components/course/ResultsPage";
import React from "react";

import ResultsPage from "@/components/course/ResultsPage";
import {
  QueryClient,
  QueryClientProvider,
  useQueries,
} from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import ShowResults from "../src/components/course/ResultsPage";

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {
      courseSlug: 'your-mock-slug', // Set this to the desired courseSlug for testing
    },
  }),
}));



test('renders loading indicator when course is not available', () => {
  render(<ShowResults />);
  
  // Find the loading indicator element
  const loadingIndicator = screen.getByText('Loading...');
  
  // Assert that the loading indicator element is defined and not null
  expect(loadingIndicator).toBeDefined();
  expect(loadingIndicator).not.toBeNull();
});

// Create a QueryClient instance
const queryClient = new QueryClient();

describe('ResultsPage', () => {
  test('renders loading indicator when course is not available', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ResultsPage />
      </QueryClientProvider>
    );
    
    // Your test assertions here
  });
});

