import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SessionProvider } from 'next-auth/react';

import Navbar from './Navbar';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    query: { callbackUrl: '/mock-callback-url' },
  }),
}));

jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  useMantineColorScheme: jest.fn(() => ({ colorScheme: 'light', toggleColorScheme: jest.fn() })),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn((queryKey, queryFn, options) => {
    if (queryKey[0] === 'userInfo' && queryKey[1] === 1) {
      return {
        data: {
          id: 1,
          username: 'mockuser',
          email: 'mockuser@example.com',
          role: 'user',
        },
        isLoading: false,
        isError: false,
      };
    }
    return {
      data: null,
      isLoading: false,
      isError: false,
    };
  }),
}));

describe('Navbar component', () => {
  test('render Navbar component', async () => {
    const queryClient = new QueryClient();
    const setSidebarOpenedMock = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionProvider
          session={{
            user: {
              id: '1',
              username: 'mockuser',
              email: 'mockuser@example.com',
              role: 'USER',
            },
            expires: '1234567890',
          }}
        >
          <Navbar setSidebarOpened={setSidebarOpenedMock} />
        </SessionProvider>
      </QueryClientProvider>
    );
  });
  
  // test('Burger button is present in the DOM', async () => {
  //   const queryClient = new QueryClient();
  //   const setSidebarOpenedMock = jest.fn();

  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <SessionProvider
  //         session={{
  //           user: {
  //             id: '1',
  //             username: 'mockuser',
  //             email: 'mockuser@example.com',
  //             role: 'USER',
  //           },
  //           expires: '1234567890',
  //         }}
  //       >
  //         <Navbar setSidebarOpened={setSidebarOpenedMock} />
  //       </SessionProvider>
  //     </QueryClientProvider>
  //   );
  
  //   // Wait for the element to be present in the DOM
  //   await waitFor(() => {
  //     const burgerButton = screen.queryByTestId('burger');
  //     expect(burgerButton).toBeInTheDocument();
  //   });
  // });

  // test('toggle sidebar when burger icon is clicked', async () => {
  //   const queryClient = new QueryClient();
  //   const setSidebarOpenedMock = jest.fn();
  
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <SessionProvider
  //         session={{
  //           user: {
  //             id: '1',
  //             username: 'mockuser',
  //             email: 'mockuser@example.com',
  //             role: 'USER',
  //           },
  //           expires: '1234567890',
  //         }}
  //       >
  //         <Navbar setSidebarOpened={setSidebarOpenedMock} />
  //       </SessionProvider>
  //     </QueryClientProvider>
  //   ); 

  //   // Ensure that the Burger component is present in the DOM
  //   const burgerButton = await screen.findByTestId('burger');
  //   console.log('Burger Button:', burgerButton);

  //   // Find the burger button and click it
  //   fireEvent.click(burgerButton);

  //   // Expect setSidebarOpened to be called with true
  //   expect(setSidebarOpenedMock).toHaveBeenCalledWith(true);

  //   // Click again to close the sidebar
  //   fireEvent.click(burgerButton);

  //   // Expect setSidebarOpened to be called with false
  //   expect(setSidebarOpenedMock).toHaveBeenCalledWith(false);
  // });

  // test('log out user when logout button is clicked', async () => {
  //   const queryClient = new QueryClient();
  //   const setSidebarOpenedMock = jest.fn();
  
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <SessionProvider
  //         session={{
  //           user: {
  //             id: '1',
  //             username: 'mockuser',
  //             email: 'mockuser@example.com',
  //             role: 'USER',
  //           },
  //           expires: '1234567890',
  //         }}
  //       >
  //         <Navbar setSidebarOpened={setSidebarOpenedMock} />
  //       </SessionProvider>
  //     </QueryClientProvider>
  //   );
  
  //   // Wait for the Burger component to be present in the DOM
  //   await waitFor(() => screen.findByTestId('burger'));
  
  //   // Find the logout button and click it
  //   const logoutButton = screen.getByTestId('logout-button');
  //   fireEvent.click(logoutButton);
  
  //   // Expect setSidebarOpened to be called with true (if the logout action involves opening the sidebar)
  //   expect(setSidebarOpenedMock).toHaveBeenCalledWith(true);
  
  //   // Add more expectations based on your logout implementation
  // });
  
  // test('change color scheme when color scheme toggle button is clicked', async () => {
  //   const queryClient = new QueryClient();
  //   const setSidebarOpenedMock = jest.fn();
  
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <SessionProvider
  //         session={{
  //           user: {
  //             id: '1',
  //             username: 'mockuser',
  //             email: 'mockuser@example.com',
  //             role: 'USER',
  //           },
  //           expires: '1234567890',
  //           //isLoggedIn: true,
  //         }}
  //       >
  //         <Navbar setSidebarOpened={setSidebarOpenedMock} />
  //       </SessionProvider>
  //     </QueryClientProvider>
  //   );
  
  //   // Wait for the Burger component to be present in the DOM
  //   await waitFor(() => screen.findByTestId('burger'));
  
  //   // Find the color scheme toggle button and click it
  //   const colorSchemeToggle = screen.getByTestId('color-scheme-toggle');
  //   fireEvent.click(colorSchemeToggle);
  
  //   // Expect color scheme to change
  //   expect(screen.getByTestId('color-scheme-light')).toBeInTheDocument();
  
  //   // Click again to revert the color scheme
  //   fireEvent.click(colorSchemeToggle);
  
  //   // Expect color scheme to revert
  //   expect(screen.getByTestId('color-scheme-dark')).toBeInTheDocument();
  // });
  
});


// //Navbar.tsx     |      35 |    34.84 |   22.22 |   34.48 | 62,105-137,149-152,158-171,192-421/////////////
// import React from 'react';
// import { render } from '@testing-library/react';
// import { QueryClient, QueryClientProvider } from 'react-query';
// import { SessionProvider } from 'next-auth/react';

// import Navbar from './Navbar';

// jest.mock('next/router', () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//     replace: jest.fn(),
//     query: { callbackUrl: '/mock-callback-url' },
//   }),
// }));

// jest.mock('@mantine/core', () => ({
//   ...jest.requireActual('@mantine/core'),
//   useMantineColorScheme: jest.fn(() => ({ colorScheme: 'light', toggleColorScheme: jest.fn() })),
// }));

// jest.mock('@tanstack/react-query', () => ({
//   useQuery: jest.fn((queryKey, queryFn, options) => {
//     if (queryKey[0] === 'userInfo' && queryKey[1] === 1) {
//       return {
//         data: {
//           id: 1,
//           username: 'mockuser',
//           email: 'mockuser@example.com',
//           role: 'user',
//         },
//         isLoading: false,
//         isError: false,
//       };
//     }
//     return {
//       data: null,
//       isLoading: false,
//       isError: false,
//     };
//   }),
// }));

// describe('Navbar component', () => {
//   test('render Navbar component successfully', async () => {
//     const queryClient = new QueryClient();
//     const setSidebarOpenedMock = jest.fn();

//     render(
//       <QueryClientProvider client={queryClient}>
//         <SessionProvider
//           session={{
//             user: {
//               id: '1',
//               username: 'mockuser',
//               email: 'mockuser@example.com',
//               role: 'USER',
//             },
//             expires: '1234567890',
//           }}
//         >
//           <Navbar setSidebarOpened={setSidebarOpenedMock} />
//         </SessionProvider>
//       </QueryClientProvider>
//     );
//   });
// });
