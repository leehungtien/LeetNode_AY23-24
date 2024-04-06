import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

import ShowResults from "../src/components/course/ResultsPage";

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {
      courseSlug: 'your-mock-slug', // Set this to the desired courseSlug for testing
    },
  }),
}));

describe('ResultsPage', () => {
  test('renders loading indicator when course is not available', async () => {
    // Create a QueryClient instance
    const queryClient = new QueryClient();

    // Render the component within QueryClientProvider
    render(
      <QueryClientProvider client={queryClient}>
        <ShowResults />
      </QueryClientProvider>
    );

    await waitFor(() => {
      const loadingIndicator = screen.getByText('Loading...', { exact: false });
      expect(loadingIndicator).toBeDefined();
      expect(loadingIndicator).not.toBeNull();
    });

    // Find the loading indicator element
    const loadingIndicator = screen.getByText('Loading...', { exact: false });
  
    // Assert that the loading indicator element is defined and not null
    expect(loadingIndicator).toBeDefined();
    expect(loadingIndicator).not.toBeNull();
  });
});
