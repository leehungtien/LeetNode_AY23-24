import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Statistics from "./Statistics";
import "@testing-library/jest-dom";

jest.mock("axios");
jest.mock("next-auth/react");

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

const mockData = [
    // Add your mock data here
    { topicName: 'Topic 1', masteryLevel: 90 },
    { topicName: 'Topic 2', masteryLevel: 70 },
    { topicName: 'Topic 3', masteryLevel: 50 },
];

const queryClient = new QueryClient();

describe("Statistics Component", () => {
    window.ResizeObserver = ResizeObserver;

    beforeEach(() => {
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    id: 1,
                },
            },
        });

        (axios.post as jest.Mock).mockResolvedValue({ data: mockData, isLoading: true, isError: true });
    });

    test("renders loading state", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Statistics />
            </QueryClientProvider>
        );

        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    test("renders data after successful API call", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Statistics />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Statistics")).toBeInTheDocument();
            expect(screen.queryByTestId("bar")).toBeInTheDocument();
        });
    });

    test("handles period change", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Statistics />
            </QueryClientProvider>
        );

        await waitFor(() => {
            userEvent.click(screen.getByText("Previous Week"));
            expect(axios.post).toHaveBeenCalledWith("/api/user/getMastery", {
                id: 1,
                period: "week",
            });
        });

    });

    test("handles view change", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Statistics />
            </QueryClientProvider>
        );

        await waitFor(() => {
            userEvent.click(screen.getByText("Radar"));
            expect(screen.queryByTestId("radar")).toBeInTheDocument();
        });

    });
});
