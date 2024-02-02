// import { render, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import PracticeQuestion from './PracticeQuestion';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// jest.mock('axios'); // Mock external dependencies
// jest.mock('next-auth/react', () => ({
//     useSession: () => ({ data: { user: {} } }), // Mock session data
// }));

// jest.mock('rehype-katex', () => {
//     return function MockedRehypeKatex() {
//         return
//     }
// });
// jest.mock('rehype-raw', () => {
//     return function MockedRehypeRaw() {
//         return
//     }
// });
// jest.mock('remark-math', () => {
//     return function MockedRemarkMath() {
//         return
//     }
// });

// const queryClient = new QueryClient();

// describe('PracticeQuestion component', () => {
//     // test('renders question content and options', async () => {
//     //     render(
//     //         <QueryClientProvider client={queryClient}>
//     //             <PracticeQuestion />
//     //         </QueryClientProvider>
//     //     );

//     //     const questionContent = await screen.findByText(MOCK_UCQAT_DATA.question.questionContent);
//     //     expect(questionContent).toBeInTheDocument();

//     //     const answerOptions = screen.getAllByRole('radio'); // Assuming single-choice questions
//     //     expect(answerOptions).toHaveLength(MOCK_UCQAT_DATA.answers.length);
//     // });

//     // test('handles multiple-choice questions with checkboxes', async () => {
//     //     // Update MOCK_UCQAT_DATA to have multiple correct answers
//     //     render(
//     //         <QueryClientProvider client={queryClient}>
//     //             <PracticeQuestion />
//     //         </QueryClientProvider>
//     //     );

//     //     const answerOptions = screen.getAllByRole('checkbox');
//     //     expect(answerOptions).toHaveLength(MOCK_UCQAT_DATA.answers.length);
//     // });

//     // test('submits answers and displays toasts', async () => {
//     //     const submitAnswer = jest.fn();
//     //     render(
//     //         <QueryClientProvider client={queryClient}>
//     //             <PracticeQuestion />
//     //         </QueryClientProvider>
//     //     );

//     //     const correctOption = screen.getAllByRole('radio')[0]; // Assuming a single-choice question
//     //     userEvent.click(correctOption);
//     //     userEvent.click(screen.getByRole('button', { name: /submit/i }));

//     //     expect(submitAnswer).toHaveBeenCalledWith({
//     //         qatId: MOCK_UCQAT_DATA.qatId,
//     //         courseSlug: MOCK_UCQAT_DATA.question.topicSlug,
//     //     });

//     //     // Ensure toasts are displayed correctly
//     // });

//     test('submit button working', async () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <PracticeQuestion />
//             </QueryClientProvider>
//         );

//         const submitButton = screen.getByTestId("submitBtn");

//         await waitFor(() => {
//             userEvent.click(submitButton);
//             expect(screen.getByText("Submitting...")).toBeInTheDocument();
//         });

//     });

//     test('handles hints modal', async () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <PracticeQuestion />
//             </QueryClientProvider>
//         );

//         const hintButton = screen.getByRole('button', { name: /hints/i });
//         userEvent.click(hintButton);

//         const hintModal = screen.getByRole('dialog');
//         expect(hintModal).toBeInTheDocument();

//     });

// });

// // npm test PracticeQuestion.test.tsx
