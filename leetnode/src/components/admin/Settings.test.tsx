// settings.test.tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, useSession as mockUseSession } from 'next-auth/react';
import Settings from './Settings';
import { describe } from 'node:test';

const queryClient = new QueryClient();

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: jest.fn(),
}));
describe('Settings Component', () => {
    test('renders Settings component', async () => {
    // Set up a mock session with the required properties
    mockUseSession.mockReturnValue({
        data: {
        user: { id: 'mockUserId', email: 'mock@example.com' },
        expires: new Date().toISOString(), // Include expires property
        },
        status: 'authenticated',
    });

    render(
        <QueryClientProvider client={queryClient}>
        <SessionProvider session={mockUseSession()}>
            <Settings />
        </SessionProvider>
        </QueryClientProvider>
    );
});
});
