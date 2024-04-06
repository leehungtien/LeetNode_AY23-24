import "@testing-library/jest-dom"; // For additional matchers

import axios from "axios";
import { SessionProvider, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";

import ForumPost from "@/components/course/ForumPost";
import { fireEvent, render, screen } from "@testing-library/react";

const mockSetRedirect = jest.fn();

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => [null, false],
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock the dynamic import of CustomRichTextEditor
jest.mock('next/dynamic', () => () => {
  const Editor = () => <p>Loading Editor...</p>;
  return { default: Editor };
});

// Mock axios
jest.mock('axios');

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
}));




///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////




describe('ForumPost component', () => {

  const mockSetRedirect = jest.fn();
  const mockSession = {
    data: {
      user: {
        id: 'user_id', // Replace with your user ID mock
      },
    },
    status: 'authenticated',
  };

  beforeEach(() => {
    // Mock useSession hook response
    (useSession as jest.Mock).mockReturnValue(mockSession);
  });







  // TEST 1:
  test('renders ForumPost component with initial state', () => {
    render(
        <SessionProvider session={null}>
          <ForumPost setRedirect={() => {}} />
        </SessionProvider>
      );
  
    // You can make assertions about the initial state or elements being rendered
    expect(screen.getByText('Loading Editor...')).toBeInTheDocument();
    expect(screen.queryByText('Edit message')).not.toBeInTheDocument();
    // Add more assertions as needed
    expect(screen.getByTestId('your-editor-testid')).toBeInTheDocument();
  
    fireEvent.click(screen.getByText('Your Button Text'));
  });
  
  test('should update voted state and call axios.post', async () => {
    const mockedAxiosPost = jest.fn(); // Mocking axios.post function
    const mockedSetVoted = jest.fn(); // Mocking setVoted function
    const mockedSetDisplayLikes = jest.fn(); // Mocking setDisplayLikes function
    const axiosReturnValue = Promise.resolve(); // Mocking the return value of axios.post
  
    // Mocking axios.post to return axiosReturnValue
    jest.spyOn(axios, 'post').mockImplementation(mockedAxiosPost);
    
    // Mocking useState hooks
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, mockedSetVoted]); // Mocking voted state
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, mockedSetDisplayLikes]); // Mocking displayLikes state
  
    // Mocking session data
    const mockSession = {
      data: {
        user: {
          id: 'user_id', // Replace with your user ID mock
        },
      },
      status: 'authenticated',
      expires: new Date().toISOString(), // Convert the Date to a string
    };
  
    // Render the ForumPost component
    render(
      <SessionProvider session={mockSession}>
        <ForumPost setRedirect={mockSetRedirect} />
      </SessionProvider>
    );
  
    // Simulate the user clicking on an element that triggers handleVote
    fireEvent.click(screen.getByTestId('your-element-testid')); // Replace 'your-element-testid' with the actual test ID of the element
    
    // Assertions
    expect(mockedSetVoted).toHaveBeenCalledWith(1); // Should update voted state
    expect(mockedAxiosPost).toHaveBeenCalledWith('/api/forum/changeLikes', {
      userId: 'user_id',
      postId: undefined, // Replace with the expected post ID
      likes: 1,
      newLikes: 0, // Replace with the expected value of newLikes
    }); // Should call axios.post
  });


});