import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Footer from '../src/components/Footer';

describe('Render Footer,tsx', () => {
  it('Checks that the phrase "Leetnode. All rights reserved." is on the page"', () => {
    render(<Footer />);
    const textElement = screen.getByText(/LeetNode\. All rights reserved\./i);
    expect(textElement).toBeInTheDocument();
  });
});