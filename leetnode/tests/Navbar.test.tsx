import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Navbar from '../src/components/Navbar'; // Import the component you want to test


describe('Navbar', () => {
  // Test case 1: Check if the component renders a FullLogo when sidebarOpened is undefined
  it('renders FullLogo when sidebarOpened is undefined', () => {
    const { getByTestId } = render(<Navbar sidebarOpened={undefined} />);
    const fullLogo = getByTestId('full-logo'); // You may need to set a test ID for the FullLogo component
    expect(fullLogo).toBeInTheDocument();
  });
});