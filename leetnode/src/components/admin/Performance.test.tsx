class ResizeObserverMock {
  observe() {
    // Do nothing
  }

  unobserve() {
    // Do nothing
  }

  disconnect() {
    // Do nothing
  }

  // Add more methods if necessary
  // For example:
  takeRecords() {
    return [];
  }
}

global.ResizeObserver = ResizeObserverMock;
global.window = Object.create(window);
global.window.addEventListener = jest.fn();
global.window.removeEventListener = jest.fn();
  
  import React from 'react';
  import { render } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import Performance from './Performance'; // Adjust the path based on your project structure
  
  // Mock any dependencies or APIs used in the component
  jest.mock('axios');
  jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQueries: jest.fn(() => [
      {
        data: {
          data: [
            {
              id: '1',
              username: 'user1',
              lastActive: new Date(),
              masteries: [], // Add an empty array for masteries
              attempts: [], // Add an empty array for attempts
              // Add other necessary properties for your mock data
            },
            // Add more mock users if needed
          ],
        },
      },
      {
        data: {
          data: [
            {
              topicSlug: 'topic1',
              topicName: 'Topic 1',
              // Add other necessary properties for your mock data
            },
            // Add more mock topics if needed
          ],
        },
      },
    ]),
  }));
  
  describe('Performance Component', () => {
    afterEach(() => {
      jest.restoreAllMocks(); // Restore all mocked functions
    });
  
    test('renders without crashing', () => {
      render(<Performance />);
    });
  });
  
  
////Performance.tsx |      54 |     38.7 |    27.9 |   52.63
// class ResizeObserverMock {
//     observe() {
//       // Do nothing
//     }
  
//     unobserve() {
//       // Do nothing
//     }
  
//     disconnect() {
//       // Do nothing
//     }
//   }
  
//   global.ResizeObserver = ResizeObserverMock;
  
//   import React from 'react';
//   import { render } from '@testing-library/react';
//   import '@testing-library/jest-dom';
//   import Performance from './Performance'; // Adjust the path based on your project structure
  
//   // Mock any dependencies or APIs used in the component
//   jest.mock('axios');
//   jest.mock('@tanstack/react-query', () => ({
//     ...jest.requireActual('@tanstack/react-query'),
//     useQueries: jest.fn(() => [
//       {
//         data: {
//           data: [
//             {
//               id: '1',
//               username: 'user1',
//               lastActive: new Date(),
//               masteries: [], // Add an empty array for masteries
//               attempts: [], // Add an empty array for attempts
//               // Add other necessary properties for your mock data
//             },
//             // Add more mock users if needed
//           ],
//         },
//       },
//       {
//         data: {
//           data: [
//             {
//               topicSlug: 'topic1',
//               topicName: 'Topic 1',
//               // Add other necessary properties for your mock data
//             },
//             // Add more mock topics if needed
//           ],
//         },
//       },
//     ]),
//   }));
  
//   describe('Performance Component', () => {
//     test('renders without crashing', () => {
//       render(<Performance />);
//     });
//   });
  