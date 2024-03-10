import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SessionProvider } from 'next-auth/react';

import Navbar from './Navbar';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    query: { callbackUrl: '/mock-callback-url' },
  }),
}));

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  useMantineColorScheme: jest.fn(() => ({ colorScheme: 'light', toggleColorScheme: jest.fn() })),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn((queryKey, queryFn, options) => {
    if (queryKey[0] === 'userInfo' && queryKey[1] === 1) {
      return {
        data: {
          id: 1,
          username: 'mockuser',
          email: 'mockuser@example.com',
          role: 'user',
        },
        isLoading: false,
        isError: false,
      };
    }
    return {
      data: null,
      isLoading: false,
      isError: false,
    };
  }),
}));

describe('Navbar component', () => {
  test('render Navbar component', async () => {
    const queryClient = new QueryClient();
    const setSidebarOpenedMock = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider
          session={{
            user: {
              id: '1',
              username: 'mockuser',
              email: 'mockuser@example.com',
              role: 'USER',
            },
            expires: '1234567890',
          }}
        >
          <Navbar setSidebarOpened={setSidebarOpenedMock} />
        </SessionProvider>
      </QueryClientProvider>
    );
  });
});