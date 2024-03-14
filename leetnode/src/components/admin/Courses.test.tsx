// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    callback: any;
    constructor(callback: any) {
      this.callback = callback;
    }
    observe() {
      // Do nothing
    }
    unobserve() {
      // Do nothing
    }
    disconnect() {
      // Do nothing
    }
  };
  import { render, screen, waitFor } from '@testing-library/react';
  import axios from 'axios';
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import Courses from './Courses';
  // Mock axios and external libraries
  jest.mock('axios');
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  jest.mock('rehype-katex', () => () => 'katex');
  jest.mock('rehype-raw', () => () => 'raw');
  jest.mock('remark-math', () => () => 'math');
  // At the top of your test file, before any test definitions
  jest.mock('@/components/editor/CustomRichTextEditor', () => {
    return {
      __esModule: true,
      default: () => <div>Mocked Editor Content</div>,
    };
  });

  // Setup QueryClient for tests
  const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  // Utility function to wrap component with necessary providers
  const renderWithProviders = (component: React.ReactElement) => {
    const TestQueryClient = createTestQueryClient();
    return render(
      <QueryClientProvider client={TestQueryClient}>
        {component}
      </QueryClientProvider>
    );
  };
  describe('Courses Component', () => {
    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();
      // Mock API calls
      mockedAxios.get.mockImplementation(url => {
        switch (url) {
          case "/api/course":
            return Promise.resolve({ data: [{ courseSlug: "course-1", courseName: "Course 1", courseDescription: "Description for Course 1", courseLevel: "Beginner" }] });
          case "/api/user/admin":
          case "/api/attempt/admin":
          case "/api/question/admin":
            return Promise.resolve({ data: [] });
          default:
            return Promise.reject(new Error("not found"));
        }
      });
    });
    
    it('renders correctly', async () => {
      renderWithProviders(<Courses />);
      // Await the removal of the progress bar, which indicates loading has finished
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
      // Then check for static text known to be in the component to verify render
      await waitFor(() => expect(screen.getByText("All Courses")).toBeInTheDocument());
      // Check for dynamically loaded content
      await waitFor(() => expect(screen.getByText("Course 1")).toBeInTheDocument());
      // Check if axios was called correctly
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/course");
    });

    it('displays static text correctly', async () => {
      renderWithProviders(<Courses />);
    
      await waitFor(() => {
        expect(screen.getByText("All Courses")).toBeInTheDocument();
        expect(screen.getByText("Course 1")).toBeInTheDocument();
      });
    });
    
    it('debugs the component', async () => {
      renderWithProviders(<Courses />);
      screen.debug();
    });
    
  });
  