import { render, screen } from '@testing-library/react';
import Streak from './Streak';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: { id: 'mockUserId' },
    },
  })),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: {
      loginStreak: 5,
      attempts: {
        [new Date().toDateString()]: 1,
        [new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toDateString()]: 1,
        [new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toDateString()]: 1,
        [new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toDateString()]: 1,
        [new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000).toDateString()]: 1,
      },
    },
    isLoading: false,
    isError: false,
  })),
}));

describe('Streak Component', () => {
  test('display the word: daily streak', () => {
    render(<Streak />);
  
    const dailyStreakElement = screen.getByText(/Login Streak/i);
    
    // Assert that the content is a number
    expect(dailyStreakElement).toHaveTextContent(/Login Streak/i);
    // You can add more specific assertions based on your component's behavior
  });

  test('display the word: leaderboard', () => {
    render(<Streak />);
  
    // Assuming your component renders leaderboard information
    const leaderboardElement = screen.getByText(/Leaderboard/i);
    
    // Assert that the leaderboard information is rendered
    expect(leaderboardElement).toBeInTheDocument();
    // Add more specific assertions as needed
  });

  test('display the word: attempted today', () => {
    render(<Streak />);
  
    // Assuming your component renders attempted today information
    const attemptedTodayElement = screen.getByText(/Attempted Today/i);
    
    // Assert that the attempted today information is rendered
    expect(attemptedTodayElement).toBeInTheDocument();
    // Add more specific assertions as needed
  });
});
