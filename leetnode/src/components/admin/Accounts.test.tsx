// Import the component for testing
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useSession } from "next-auth/react";
import Accounts from "./Accounts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RoleBadge,
  QuestionDifficultyBadge,
  PostTypeBadge,
  CourseTypeBadge,
} from "@/components/misc/Badges";
import { IconJewishStar } from "@tabler/icons";

jest.mock("@/components/misc/Badges", () => ({
    ...jest.requireActual("@/components/misc/Badges"),
    RoleBadge: jest.fn(({ role }: { role: string }) => (
      <div data-testid="mock-role-badge">{role}</div>
    )),
    QuestionDifficultyBadge: jest.fn(({ questionDifficulty }: { questionDifficulty: string }) => (
      <div data-testid="mock-question-difficulty-badge">{questionDifficulty}</div>
    )),
    PostTypeBadge: jest.fn(({ postType }: { postType: string }) => (
      <div data-testid="mock-post-type-badge">{postType}</div>
    )),
    CourseTypeBadge: jest.fn(({ course }: { course: { courseName: string } }) => (
      <div data-testid="mock-course-type-badge">{course.courseName}</div>
    )),
}));

// Mock axios
jest.mock("axios", () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

// Mock next-auth/react's useSession
jest.mock("next-auth/react", () => ({
    useSession: jest.fn(),
}));

// Initialize mocks or set return values for specific tests
beforeEach(() => {
    // Example of mocking useSession response
    (useSession as jest.Mock).mockReturnValue({ data: { user: { role: "ADMIN" } } });
});

const queryClient = new QueryClient();

// Mock ResizeObserver
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
describe("Accounts Component", () => {

    // Additional test cases can include testing API calls and their responses
    it("Fetches users and displays them", async () => {
        // Mock the response of axios.get for fetching users
        const allUsersResponse = {
            data: [
                {
                    id: 1,
                    username: "John",
                    email: "john@u.nus.edu",
                    emailVerified: null,
                    isNewUser: true,
                    image: "https://lh3.googleusercontent.com/a/AAcHTteJUxmVXEuCc_d778vhrwTuO918BQutVDiVZJQ5U9OSDhg=s96-c",
                    role: "SUPERUSER"
                },
                {
                    id: 2,
                    username: "Foo",
                    email: "foo@u.nus.edu",
                    emailVerified: null,
                    isNewUser: true,
                    image: "https://lh3.googleusercontent.com/a/AAcHTteJUxmVXEuCc_d778vhrwTuO918BQutVDiVZJQ5U9OSDhg=s96-c",
                    role: "SUPERUSER"
                }
            ],
        };
        const waitListedUsersReponse = {
            data: [
                {
                    id: 1,
                    email: "Aaron@u.nus.edu"
                },
                {
                    id: 2,
                    email: "Baron@u.nus.edu"
                }
            ],
            
        };
        (axios.get as jest.Mock).mockResolvedValueOnce(allUsersResponse);
        (axios.get as jest.Mock).mockResolvedValueOnce(waitListedUsersReponse);

        render(
            <QueryClientProvider client={queryClient}>
                <Accounts />
            </QueryClientProvider>
        );

        // Wait for the API call to complete
        await waitFor(() => {

            // Add assertions to check if the users are displayed correctly
            expect(screen.getByText("John")).toBeInTheDocument();
            expect(screen.getByText("Foo")).toBeInTheDocument();
        })
     });

    // Test user interaction and state changes
    it("Handles user interaction and updates state", async () => {
        const allUsersResponse = {
            data: [
                {
                    id: 1,
                    username: "John",
                    email: "john@u.nus.edu",
                    emailVerified: null,
                    isNewUser: true,
                    image: "https://lh3.googleusercontent.com/a/AAcHTteJUxmVXEuCc_d778vhrwTuO918BQutVDiVZJQ5U9OSDhg=s96-c",
                    role: "SUPERUSER"
                },
                {
                    id: 2,
                    username: "Foo",
                    email: "foo@u.nus.edu",
                    emailVerified: null,
                    isNewUser: true,
                    image: "https://lh3.googleusercontent.com/a/AAcHTteJUxmVXEuCc_d778vhrwTuO918BQutVDiVZJQ5U9OSDhg=s96-c",
                    role: "SUPERUSER"
                }
            ],
        };
        const waitListedUsersReponse = {
            data: [
                {
                    id: 1,
                    email: "Aaron@u.nus.edu"
                },
                {
                    id: 2,
                    email: "Baron@u.nus.edu"
                }
            ],
            
        };
        (axios.get as jest.Mock).mockResolvedValueOnce(allUsersResponse);
        (axios.get as jest.Mock).mockResolvedValueOnce(waitListedUsersReponse);
        (axios.post as jest.Mock).mockResolvedValueOnce({email: "" });

        render(
            <QueryClientProvider client={queryClient}>
                <Accounts />
            </QueryClientProvider>
        );

        // Simulate user interaction, like clicking a button to add users
        const addButton = screen.getByText("Whitelist Emails");
        userEvent.click(addButton);

        // Add assertions to verify the state change after adding users
        // For instance, check if the UI displays the added users or a success message
        await waitFor(() => {
            expect(screen.getByText("Invalid email")).toBeInTheDocument();
        })
    });

    it("Handles username sorting function", async () => {
        const allUsersResponse = {
            data: [
                {
                    id: 1,
                    username: "John",
                    email: "john@u.nus.edu",
                    emailVerified: null,
                    isNewUser: true,
                    image: "https://lh3.googleusercontent.com/a/AAcHTteJUxmVXEuCc_d778vhrwTuO918BQutVDiVZJQ5U9OSDhg=s96-c",
                    role: "SUPERUSER"
                },
                {
                    id: 2,
                    username: "Foo",
                    email: "foo@u.nus.edu",
                    emailVerified: null,
                    isNewUser: true,
                    image: "https://lh3.googleusercontent.com/a/AAcHTteJUxmVXEuCc_d778vhrwTuO918BQutVDiVZJQ5U9OSDhg=s96-c",
                    role: "USER"
                },
            ],
        };
        const waitListedUsersReponse = {
            data: [
                {
                    id: 1,
                    email: "Aaron@u.nus.edu"
                },
                {
                    id: 2,
                    email: "Baron@u.nus.edu"
                }
            ],
            
        };
        (axios.get as jest.Mock).mockResolvedValueOnce(allUsersResponse);
        (axios.get as jest.Mock).mockResolvedValueOnce(waitListedUsersReponse);

        render(
            <QueryClientProvider client={queryClient}>
                <Accounts />
            </QueryClientProvider>
        );
      
        // Find the column header for 'role' and trigger a click to sort it
        const roleHeader = screen.getByText("Role");
        roleHeader.click();

        // Mock expected sorted records based on the sorting logic used in Accounts component
        const expectedSortedRoles = {
            data: [
                {
                    id: 2,
                    username: "Foo",
                    email: "foo@u.nus.edu",
                    emailVerified: null,
                    isNewUser: true,
                    image: "https://lh3.googleusercontent.com/a/AAcHTteJUxmVXEuCc_d778vhrwTuO918BQutVDiVZJQ5U9OSDhg=s96-c",
                    role: "USER"
                },
                {
                    id: 1,
                    username: "John",
                    email: "john@u.nus.edu",
                    emailVerified: null,
                    isNewUser: true,
                    image: "https://lh3.googleusercontent.com/a/AAcHTteJUxmVXEuCc_d778vhrwTuO918BQutVDiVZJQ5U9OSDhg=s96-c",
                    role: "SUPERUSER"
                },
            ],
        };

        // Check if the rendered records match the expected sorted roles
        const renderedRecords = screen.getAllByRole("row").slice(1); // Excluding header row
        renderedRecords.forEach((row, index) => {
            const cells = row.querySelectorAll("td");
            if (
                expectedSortedRoles.data.length > index &&
                expectedSortedRoles.data[index]?.role &&
                expectedSortedRoles.data[index]?.email
            ) {
                const usernameCell = cells[1];
                const roleCell = cells[3];
                const usernameContent = expectedSortedRoles.data[index]?.username;
                const roleContent = expectedSortedRoles.data[index]?.role;
                if (roleContent !== undefined && roleCell !== undefined
                    && usernameCell !== undefined) {
                    const usernameTextContent = usernameCell.querySelector('.mantine-Text-root')?.textContent;
                    expect(usernameTextContent).toEqual(usernameContent);
                }
            }
        });
    });
});
  
  