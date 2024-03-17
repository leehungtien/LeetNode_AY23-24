import React from 'react';
import { render } from '@testing-library/react';
import VariablesBox from './VariablesBox'; // Update the path accordingly

// Mocking dependencies if necessary
jest.mock('@/components/Latex', () => {
  return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

// Mocking the useMantineTheme hook
jest.mock('@mantine/core', () => ({
    ...jest.requireActual('@mantine/core'),
    useMantineTheme: () => ({ colorScheme: 'light' }), // Provide a mock theme object with colorScheme property
  }));

describe('VariablesBox component', () => {
    test('renders without crashing', () => {
      const variables = [
        { 
          key: 'variable1', // Add key property
          encoded: 'encoded1', // Add encoded property
          name: 'variable1', 
          randomize: true, // Add randomize property
          isFinalAnswer: false,
          unit: 'unit1', 
          default: '10', // Make sure default is a string as expected
          decimalPlaces: 2
        },
        { 
          key: 'variable2', // Add key property
          encoded: 'encoded2', // Add encoded property
          name: 'variable2', 
          randomize: true, // Add randomize property
          isFinalAnswer: false,
          unit: 'unit2', 
          default: '20', // Make sure default is a string as expected
          decimalPlaces: 3
        },
        // Add more sample variables as needed
      ];
  
      render(<VariablesBox variables={variables} />);
    });
  });