import React from 'react';
import "@testing-library/jest-dom";
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Overview from './Overview';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a mock Axios instance
const mockAxios = new MockAdapter(axios);

describe('Overview Admin Component', () => {
    beforeEach(() => {
        mockAxios.reset(); // Reset mock Axios before each test
    });

    // it('renders loading indicator when data is not available', async () => {
    //     const queryClient = new QueryClient();
    //     // Mock the Axios get calls to return a response with data as null
    //     mockAxios.onGet('/api/user/admin').reply(200, null);
    //     mockAxios.onGet('/api/course').reply(200, null);
    //     mockAxios.onGet('/api/attempt/admin').reply(200, null);

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <Overview />
    //         </QueryClientProvider>
    //     );

    //     // Use data-testid to target the Loader component
    //     const loader = screen.getByTestId("loader");
    //     expect(loader).toBeInTheDocument();
    // });

    it('renders performance data when data is available', async () => {
        const queryClient = new QueryClient();
        // Mock the Axios get calls to return sample data for users, courses, and attempts
        // mockAxios.onGet('/api/user/admin').reply(200, { data: { students: "Tom" } });
        // mockAxios.onGet('/api/course').reply(200, /* Mocked courses data */);
        // mockAxios.onGet('/api/attempt/admin').reply(200, /* Mocked attempts data */);

        const users = {
            data: [
                {
                    id: 1,
                    masteries: [
                        {
                            topicPing: true,
                        },
                        {
                            topicPing: false,
                        },
                    ],
                },
                {
                    id: 2,
                    masteries: [
                        {
                            topicPing: false,
                        },
                        {
                            topicPing: true,
                        },
                    ],
                },
            ],
        };

        // Render the component with the mock data
        render(
            <QueryClientProvider client={queryClient}>
                <Overview />
            </QueryClientProvider>
        );

        // Use text matchers to locate the elements
        const studentsToHelp = screen.getByTestId("studentsToHelp");
        // const numStudentsWithTopicPing = screen.getByText(`${users.data.length - 1}/${users.data.length}`);

        // Assert that the elements are in the document
        expect(studentsToHelp).toBeInTheDocument();
        // expect(numStudentsWithTopicPing).toBeInTheDocument();
    });

    // it('handles user interaction correctly', async () => {
    //     const queryClient = new QueryClient();
    //     // Mock the Axios post call
    //     mockAxios.onPost('/api/your-endpoint').reply(200, /* Mocked response data */);

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <Overview />
    //         </QueryClientProvider>
    //     );

    //     // Simulate user interaction and check the component's behavior
    // });
});
