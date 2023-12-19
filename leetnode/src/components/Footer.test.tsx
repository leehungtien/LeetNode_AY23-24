import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Footer from './Footer';

describe('Render Footer.tsx', () => {
  it('Check if the phrase "Leetnode. All rights reserved." is at the footer', () => {
    render(<Footer />);
    const textElement = screen.getByText(/LeetNode\. All rights reserved\./i);
    expect(textElement).toBeInTheDocument();
  });
});
