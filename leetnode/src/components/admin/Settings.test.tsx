// Settings.test.js or Settings.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from './Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

describe('Settings Component', () => {
  test('renders without crashing', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={{ expires: '2024-12-31T23:59:59.999Z' }}>
          <Settings />
        </SessionProvider>
      </QueryClientProvider>
    );
  });
});
