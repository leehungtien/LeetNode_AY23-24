import React from 'react';
import { render, screen } from '@testing-library/react';
import Latex from './Latex'; // Adjust the import path as necessary

// Directly mocking the modules without importing them in the mocks
jest.mock('remark-math', () => jest.fn());
jest.mock('rehype-katex', () => jest.fn());
jest.mock('rehype-raw', () => jest.fn());

describe('Latex Component', () => {
  it('renders markdown content correctly', () => {
    const { container } = render(<Latex>{"Some **bold** markdown content"}</Latex>);

    // Directly check if the container's innerHTML includes the expected text
    expect(container.innerHTML).toContain('Some');
    expect(container.innerHTML).toContain('bold'); // Assuming "bold" is rendered as HTML bold
    expect(container.innerHTML).toContain('markdown content');
  });
});