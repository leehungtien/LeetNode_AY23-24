import { render, screen, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QuestionViewer from "./QuestionViewer";

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

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

const mockQn = [{
    data: [
        {
            questionId: 1,
            variationId: 1,
            questionDifficulty: 'easy',
            questionTitle: 'Question 1',
            questionContent: 'Question content 1',
            topic: { topicId: 3, topicName: 'Topic 1' },
        },
        {
            questionId: 2,
            variationId: 2,
            questionDifficulty: 'easy',
            questionTitle: 'Question 2',
            questionContent: 'Question content 2',
            topic: { topicId: 3, topicName: 'Topic 2' },
        },
        {
            questionId: 3,
            variationId: 3,
            questionDifficulty: 'easy',
            questionTitle: 'Question 3',
            questionContent: 'Question content 3',
            topic: { topicId: 3, topicName: 'Topic 3' },
        }
    ]
}];

const queryClient = new QueryClient();

describe("QuestionViewer Component", () => {
    window.ResizeObserver = ResizeObserver;

    beforeEach(() => {
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    id: 1,
                },
            },
        });

        (axios.get as jest.Mock).mockResolvedValue({ data: mockQn, isFetching: true });
    });

    test("onchange text input", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QuestionViewer />
            </QueryClientProvider>
        );

        await waitFor(() => {
            userEvent.type(screen.getByPlaceholderText("Search Question..."), '1');
            expect(screen.getByPlaceholderText("Search Question...")).toHaveValue('1');
        })
    });

    test("add-modal open", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QuestionViewer />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('addbtn')).toBeInTheDocument();
            expect(screen.queryByTestId('addModal')).toBeNull();
            // userEvent.click(screen.getByTestId('addbtn'));
            // expect(screen.queryByTestId('addModal')).toBeInTheDocument();
        })
    });

    test("data table", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QuestionViewer />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('dataTable')).toBeInTheDocument();
        })
    });

    // test("view-modal open", async () => {

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <QuestionViewer />
    //         </QueryClientProvider>
    //     );

    //     await waitFor(() => {
    //         // userEvent.click(screen.getByTestId('view&edit-btn'));
    //         expect(screen.getByTestId('viewModal')).toBeFalsy();
    //     })
    // });

    // test("edit-modal open", async () => {
    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <QuestionViewer />
    //         </QueryClientProvider>
    //     );

    //     await waitFor(() => {
    //         // userEvent.click(screen.getByTestId('view&edit-btn'));
    //         expect(screen.getByTestId('editModal')).toBeFalsy();
    //     })
    // });

})

// npm test QuestionViewer.test.tsx