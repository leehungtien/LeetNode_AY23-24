import React from 'react';
import { render } from '@testing-library/react';
import Dots, { DotPositionType } from './Dots';

describe('Dots component', () => {
  it('renders dots based on dotPositions prop', () => {
    const dotPositions: DotPositionType[] = [
    //   { top: 10, left: 10 },
    //   { top: 20, left: 20 },
    //   { top: 30, left: 30 },
    ];

    const { container } = render(<Dots dotPositions={dotPositions} />);

    const dots = container.querySelectorAll('svg.dots');
    expect(dots.length).toBe(dotPositions.length);

    dotPositions.forEach((dotPosition, index) => {
      const dot = dots[index];
      expect(dot).toHaveStyle(`top: ${dotPosition.top}px`);
      expect(dot).toHaveStyle(`left: ${dotPosition.left}px`);
    });
  });

  it('renders no dots when dotPositions prop is empty', () => {
    const dotPositions: DotPositionType[] = [];

    const { container } = render(<Dots dotPositions={dotPositions} />);

    const dots = container.querySelectorAll('svg.dots');
    expect(dots.length).toBe(0);
  });
});