import React, { Dispatch, SetStateAction, useState } from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import Login from "./Login";
// At the top of your test file, add the following import:
import { UseMutationResult, UseMutationOptions } from "@tanstack/react-query";

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
        (axios.post as jest.Mock).mockResolvedValue({
            data: {
            customToast: true,
            emailAllowed: true,
            isNewUser: true,
            },
        });
    
        // Simulate user entering an email address
        const emailInput = screen.getByPlaceholderText('Invite Email');
        userEvent.type(emailInput, 'test@gmail.com');
        
        // Simulate clicking the "Get Link" button
        const getLinkButton = screen.getByText('Get Link');
        userEvent.click(getLinkButton);
        
        // Use waitFor to check if loading is displayed and the form is reset
        // await waitFor(() => {
        //     expect(screen.getByText('Loading...')).toBeTruthy();
        //     // expect(emailInput).toHaveValue('');
        // });
    });
    
    it("handles joining the waitlist", async () => {
        render(<Login setLoginMenuOpened={mockSetLoginMenuOpened} />);
        (axios.post as jest.Mock).mockResolvedValue({
        status: 201,
        });

        // Simulate user entering an email address
        const emailInput = screen.getByPlaceholderText('Invite Email');
        userEvent.type(emailInput, 'test@gmail.com');

        // Simulate clicking the "Join Waitlist" button
        const joinWaitlistButton = screen.getByText('Join Waitlist');
        userEvent.click(joinWaitlistButton);

        // // Use waitFor to check if loading is displayed and the form is reset
        // await waitFor(() => {
        // expect(screen.getByText('Loading...')).toBeInTheDocument();
        // expect(emailInput).toHaveValue('');
        // });
    });
});
