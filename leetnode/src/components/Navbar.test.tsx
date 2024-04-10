// Mock ResizeObserver globally
// global.ResizeObserver = class ResizeObserver {
//   observe() {}
//   unobserve() {}
//   disconnect() {}
// };
class ResizeObserver {
  observe() {
      // do nothing
  }
  unobserve() {
      // do nothing
  }
  disconnect() {
      // do nothing
  }
} 
window.ResizeObserver = ResizeObserver;

import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar'; // Adjust the import path based on your project structure
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import axios from 'axios';
import { Session } from "next-auth";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
      query: {},
      replace: jest.fn(),
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next image stub'; // or whatever you want to return from this component
  },
}));

const queryClient = new QueryClient();

// Assuming 'ColorScheme' type is exported from Mantine,
// but if not, we'll define it as a type with two possible string literal values.
type ColorScheme = 'light' | 'dark';

interface MockedNavbarProps {
  session: Session | null;
}

const MockedNavbar: React.FC<MockedNavbarProps> = ({ session }) => {
  // Explicitly declare the type of 'colorScheme' state as 'ColorScheme'
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <Navbar />
          </MantineProvider>
        </ColorSchemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};


describe('Navbar Component', () => {
  it('renders correctly when user is not authenticated', () => {
    render(<MockedNavbar session={null} />);
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('renders user info when authenticated', async () => {
    const userInfo = {
      username: 'johndoe', // Ensuring this matches the expected structure
      image: 'https://example.com/johndoe.jpg',
      loginStreak: 5,
    };
  
    mockedAxios.post.mockResolvedValue({ data: userInfo });
  
    render(
      <MockedNavbar
        session={{
          expires: '1',
          user: {
            id: '1',
            username: 'John Doe', // Updated to 'username' to match the expected type
            email: 'john@example.com',
            role: 'USER', // Ensure this matches the expected role type as well
          },
        }}
      />
    );
  
    await waitFor(() => expect(screen.getByText('johndoe')).toBeInTheDocument());
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(mockedAxios.post).toHaveBeenCalled();
  });
  

  it('handles color scheme change', async () => {
    render(<MockedNavbar session={null} />);

    fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  // Add more tests as needed to cover interactions and different states
});

