import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './Header';
import axios from 'axios';
import { useSession } from "next-auth/react";


jest.mock('axios');
jest.mock("next-auth/react");
jest.mock('timers/promises');

jest.mock('next/head', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: Array<React.ReactElement> }) => {
            return <>{children}</>;
        },
    };
});

const mockData = {
    id: 1,
    lastActive: '2024-01-31T23:59:59',
    loginStreak: 2,
    points: 10,
};

describe('Header Component', () => {
    beforeEach(() => {
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    id: 1,
                },
            },
        });

        (axios.post as jest.Mock).mockResolvedValue({ data: mockData, isLoading: false, isError: false });
    });

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

    test('Fetches user info and calls updateActive for consecutive days', async () => {
        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <Header />
            </QueryClientProvider>
        );

        await Promise.resolve();
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/user', { id: 1 });
        });
    });
});

// npm test Header.test.tsx
