import React from 'react';
import { render, screen } from '@testing-library/react';
import RadarChart from './RadarChart';
import { Radar } from 'react-chartjs-2';
import { useMantineTheme } from '@mantine/core';

// Mock the useMantineTheme hook
jest.mock('@mantine/core', () => ({
  useMantineTheme: jest.fn(),
}));

// Mocking Radar from react-chartjs
jest.mock('react-chartjs-2', () => ({
  Radar: jest.fn(() => null),
}));

const mockData = [
  {
    topicName: 'Topic 1',
    masteryLevel: 75,
  },
  {
    topicName: 'Topic 2',
    masteryLevel: 60,
  }
];

// Mock the useMantineTheme result
beforeEach(() => {
  const mockTheme = {
    colors: {
      cyan: {
        2: 'cyan-color-2',
        4: 'cyan-color-4',
      },
      gray: {
        0: 'gray-color-0',
        3: 'gray-color-3',
        8: 'gray-color-8',
      },
    },
    fn: {
      rgba: (color: any, opacity: any) => `${color}-${opacity}`,
    },
    colorScheme: 'light',
  };

  (useMantineTheme as jest.Mock).mockReturnValue(mockTheme);
});

it("renders the RadarChart component", () => {
  const { container } = render(<RadarChart data={mockData} />);
  expect(container).toBeInTheDocument();
});

test('matches snapshot [Snapshot Testing]', () => {
  const { asFragment } = render(<RadarChart data={mockData} />);
  expect(asFragment()).toMatchSnapshot();
});

test('RadarChart passes correct data to Radar', () => {
  render(<RadarChart data={mockData} />);

  expect(Radar).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        labels: [['Topic 1'], ['Topic 2']],
        datasets: expect.arrayContaining([
          expect.objectContaining({
            data: [75, 60],
          }),
        ]),
      }),
    }),
    {}
  );
});
