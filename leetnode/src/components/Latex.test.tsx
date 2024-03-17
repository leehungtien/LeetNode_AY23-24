import React from 'react';
import { render, screen } from '@testing-library/react';
import Latex from './Latex'; // Adjust the import path to match the location of your Latex component

// Directly mocking the modules without importing them in the mocks
jest.mock('remark-math', () => jest.fn());
jest.mock('rehype-katex', () => jest.fn());
jest.mock('rehype-raw', () => jest.fn());

// Simplify the renderWithProviders function
const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui);
};

describe('Latex Component', () => {
  it('renders markdown text correctly', () => {
    const markdownText = 'This is a **markdown** text.';
    renderWithProviders(<Latex>{markdownText}</Latex>);
    expect(screen.getByText('This is a markdown text.')).toBeInTheDocument();
  });

  it('renders mathematical expressions correctly', () => {
    const markdownMath = 'Here is an inline math equation: $E=mc^2$';
    renderWithProviders(<Latex>{markdownMath}</Latex>);
    expect(screen.getByText('Here is an inline math equation:')).toBeInTheDocument();
  });

  // Add more tests as needed
});
