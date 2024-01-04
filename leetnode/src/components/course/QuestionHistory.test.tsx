import { render, screen, waitFor } from "@/utils/test-utils";
import "@testing-library/jest-dom";
import axios from "axios";
import { useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QuestionHistory from "./QuestionHistory";

jest.mock("axios");
jest.mock("next-auth/react");
jest.mock('rehype-katex', () => {
    return function MockedRehypeKatex() {
        return
    }
});
jest.mock('rehype-raw', () => {
    return function MockedRehypeRaw() {
        return
    }
});
jest.mock('remark-math', () => {
    return function MockedRemarkMath() {
        return
    }
});

const queryClient = new QueryClient();

const mockData = [
    // Add your mock data here

];

describe("QuestionHistory Component", () => {

    beforeEach(() => {
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    id: 1,
                },
            },
        });
    });

    test("renders loading state", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QuestionHistory courseSlug="course-1" />
            </QueryClientProvider>
        );

        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    // test('renders "no attempts" message when attempts.data is empty', async () => {

    //     (axios.get as jest.Mock).mockResolvedValue({ data: { attempts: { data: [] } } });

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <QuestionHistory courseSlug="course-1" />
    //         </QueryClientProvider>
    //     );

    //     // const noAttemptsMessage = screen.getByText('You have not attempted any questions from this course yet.');
    //     // expect(noAttemptsMessage).toBeInTheDocument();
    //     // await waitFor(() => {
    //     expect(screen.queryByTestId("text")).toBeInTheDocument();
    //     // expect(screen.getByTestId("text")).toHaveTextContent("You have not attempted any questions from this course yet.");

    //     // });
    // });

    // test("render title", async () => {
    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <QuestionHistory courseSlug="course-1" />
    //         </QueryClientProvider>
    //     );


    // const title = screen.getByText('Attempt History');
    // const desc = screen.getByText('Keep practising to achieve mastery in all topics!');
    // expect(title).toBeInTheDocument();
    // expect(desc).toBeInTheDocument();
    // expect(screen.getByTestId('test')).toBeInTheDocument();

    // await waitFor(() => {
    // const title = screen.getByText('Attempt History');
    // const desc = screen.getByText('Keep practising to achieve mastery in all topics!');
    // expect(title).toBeInTheDocument();
    // expect(desc).toBeInTheDocument();
    // expect(screen.queryByTestId('test')).toBeInTheDocument();
    // })
    // });
})

// npm test QuestionHistory.test.tsx