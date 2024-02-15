import "@testing-library/jest-dom";
import { render, screen, waitFor } from '@testing-library/react';
import Account from './Account';
import { $Enums } from '../../../node_modules/.prisma/client/index';
import { useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import userEvent from "@testing-library/user-event";
import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import { act } from 'react-dom/test-utils';

// Mock necessary dependencies or setup as needed
jest.mock("next-auth/react");
jest.mock('axios');
// jest.mock('@tanstack/react-query', () => ({
//     useMutation: () => ({
//         mutate: jest.fn(),
//         isLoading: false,
//     }),
// }));

const userInfo = {
    id: 'user123',
    username: 'TestUser',
    email: 'test@example.com',
    emailVerified: new Date(),
    isNewUser: false,
    image: 'test.jpg',
    role: $Enums.Role.USER,
    name: 'John Doe',
    nusnetId: 'NUS1234',
    consentDate: new Date(),
    lastActive: new Date(),
    loginStreak: 5,
    points: 100,
    emailFrequency: $Enums.Frequency.Daily,
};

const queryClient = new QueryClient();

describe('Account Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        const mocksession = {
            user: {
                userInfo
            },
            expires: '2023-11-30T23:59:59', // ISO 8601 formatted date and time
        };

        (useSession as jest.Mock).mockReturnValue(mocksession);
    });

    it('H1 + all inputs present in DOM', () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Account userInfo={userInfo} />
            </QueryClientProvider>
        );

        const h1 = screen.getByText("Account Settings");
        expect(h1).toBeInTheDocument();

        const hr = screen.getByTestId("hr");
        expect(hr).toBeInTheDocument();

        const avatar = screen.getByTestId("avatar");
        expect(avatar).toBeInTheDocument();

        const image = screen.getByLabelText("Change profile picture");
        expect(image).toBeInTheDocument();

        const username = screen.getByLabelText("Username (Visible to everyone)");
        expect(username).toBeInTheDocument();

        const NUSNETID = screen.getByLabelText("NUSNET ID");
        expect(NUSNETID).toBeInTheDocument();

        const confirm = screen.getByText("Confirm");
        expect(confirm).toBeInTheDocument();

        const reset = screen.getByText("Reset");
        expect(reset).toBeInTheDocument();
    });


    it('form username & nusID inputs', async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Account userInfo={userInfo} />
            </QueryClientProvider>
        );
        const userNameInput = screen.getByLabelText('Username (Visible to everyone)');
        const userNusnetIdInput = screen.getByLabelText('NUSNET ID');

        await waitFor(() => {
            userEvent.type(userNameInput, userInfo.username);
            userEvent.type(userNusnetIdInput, userInfo.nusnetId);
            expect(screen.getByLabelText('Username (Visible to everyone)')).toHaveValue('TestUser');
            expect(screen.getByLabelText('NUSNET ID')).toHaveValue('NUS1234');
        });

    });

    // it('form image inputs', async () => {

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <Account userInfo={userInfo} />
    //         </QueryClientProvider>
    //     );
    // const file = new File([""], "test.jpg", { type: "image/jpeg" });
    // const fileInput = screen.getByLabelText('Change profile picture') as HTMLInputElement;

    // await waitFor(() => {
    //     userEvent.upload(fileInput, file);
    //     expect(fileInput.files).toHaveLength(1);
    //     expect(fileInput.files?.[0]).toEqual(file);
    // });
    // });

    // it('avatar', async () => {
    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <Account userInfo={userInfo} />
    //         </QueryClientProvider>
    //     );

    //     const avatarElement = screen.queryByTestId("avatar");

    //     expect(avatarElement).toHaveAttribute("src", userInfo.image);
    //     // await waitFor(() => {
    //     // });
    // })
});

// npm test Account.test.tsx