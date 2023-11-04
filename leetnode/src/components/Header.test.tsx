import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import axios from 'axios';

// Mock the NextAuth and axios modules as required
jest.mock('next-auth/react', () => ({
    useSession: () => ({ data: { user: { id: 'mockedUserId' } } }),
}));

jest.mock('axios');

jest.mock('next/head', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: Array<React.ReactElement> }) => {
            return <>{children}</>;
        },
    };
});

describe('Header Component', () => {
    it('check for head title', async () => {
        const queryClient = new QueryClient();
        const title = 'Personalized Path Mastery';

        render(
            <QueryClientProvider client={queryClient}>
                <Header title={title} />
            </QueryClientProvider>
        );

        expect(screen.getByText(document.title)).toBeInTheDocument();
    });

    it('check for meta description', async () => {
        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <Header />
            </QueryClientProvider>
        );

        const metaDescription = document.querySelector('meta[name="description"]');
        expect(metaDescription).toBeInTheDocument();
        expect(metaDescription?.getAttribute('content')).toEqual(
            "Achieve mastery in concepts by doing questions tailored to your skill level. Receive feedback on your progression and challenge yourself as you advance through progressively more advanced questions for each individual topic."
        );
    });

    // it('post & log lastActive', async () => {
    //     const queryClient = new QueryClient();
    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <Header />
    //         </QueryClientProvider>
    //     );

    //     // Mock the axios.post method to resolve with a response
    //     (axios.post as jest.Mock).mockResolvedValueOnce({ data: { lastActive: '2023-10-30T12:00:00Z' } });

    //     // Verify the axios.post method was called with the correct parameters
    //     expect(axios.post).toHaveBeenCalledWith('/api/admin/updateLastActive', {
    //         id: 'mockedUserId',
    //     });

    //     // Verify the console output
    //     expect(console.log).toHaveBeenCalledWith('Last Active Updated @', expect.any(Date));
    // });
});
