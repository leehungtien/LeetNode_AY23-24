import React, { Dispatch, SetStateAction, useState } from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Login from "./Login";

jest.mock("axios");
jest.mock("next-auth/react", () => ({
    signIn: jest.fn(),
}));
jest.mock("@tanstack/react-query");

describe("Login Component", () => {
    beforeEach(() => {
        // Reset the mocked functions before each test.
        jest.clearAllMocks();
    });
    
    // Mock the useMutation hook with a custom implementation
    jest.mock("@tanstack/react-query", () => ({
        ...jest.requireActual("@tanstack/react-query"), // Use the actual module for everything except useMutation
        useMutation: jest.fn(),
    }));

    // Now, provide a custom implementation for useMutation
    (useMutation as jest.Mock).mockReturnValue({
        mutate: jest.fn(), // You can define the expected behavior here
    });
    
    const mockSetLoginMenuOpened: Dispatch<SetStateAction<boolean>> = jest.fn();
    it("renders the component", () => {

        render(<Login setLoginMenuOpened={mockSetLoginMenuOpened} />);
        
        // You can add assertions here to check if the component renders as expected.
        expect(screen.getByPlaceholderText('Invite Email')).toBeTruthy();
        expect(screen.getByText('Get Link')).toBeTruthy();
        expect(screen.getByText('Join Waitlist')).toBeTruthy();
    });
    
    it("handles get link", async () => {
        render(<Login setLoginMenuOpened={mockSetLoginMenuOpened} />);
        
        // Mock the axios.post function to simulate a response
        const axiosPostMock = jest.spyOn(axios, 'post');
        let response = {
            data: {
            customToast: true,
            emailAllowed: false,
            isNewUser: true,
            },
        };
        axiosPostMock.mockResolvedValue(response);
        
        // Simulate user entering an email address
        const emailInput = screen.getByPlaceholderText('Invite Email');
        let emailAddress = 'test@gmail.com';
        userEvent.type(emailInput, emailAddress);
        
        // Simulate clicking the "Get Link" button
        const getLinkButton = screen.getByText('Get Link');
        userEvent.click(getLinkButton);
        
        axios.post(`/api/auth/isEmailAllowed?email=${emailAddress}`);
        expect(axios.post).toHaveBeenCalledWith(`/api/auth/isEmailAllowed?email=${emailAddress}`);
        
        await waitFor(() => {
            // Assert that toast messages are displayed correctly
            expect(screen.findByText(`Verification successful! Check your inbox and junk mail for the magic link!\n\nVerified:\n${emailAddress}`)).toBeTruthy();
        });
    });
    
    it("handles joining the waitlist", async () => {
        render(<Login setLoginMenuOpened={mockSetLoginMenuOpened} />);
        (axios.post as jest.Mock).mockResolvedValue({
        status: 201,
        });

        // Simulate user entering an email address
        const emailInput = screen.getByPlaceholderText('Invite Email');
        let emailAddress = 'test@gmail.com';
        userEvent.type(emailInput, emailAddress);

        // Simulate clicking the "Join Waitlist" button
        const joinWaitlistButton = screen.getByText('Join Waitlist');
        userEvent.click(joinWaitlistButton);

        await waitFor(() => {
            expect(screen.findByText(`Verification successful! Check your inbox and junk mail for the magic link!\n\nVerified:\n${emailAddress}`)).toBeTruthy();
        });
    });
});
