import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MasteryBar from './MasteryBar';

// Sample data for testing
const sampleData = [
  {
    topicName: 'Topic 1',
    masteryLevel: 75,
  },
  {
    topicName: 'Topic 2',
    masteryLevel: 60,
  },
  // Add more sample data as needed
];

// Mock ResizeObserver
class ResizeObserver {
    observe() {
        // do nothing
    }
    unobserve() {
        // do nothing
    }
    disconnect() {
        // do nothing
    }
}

window.ResizeObserver = ResizeObserver;

test('renders MasteryBar component', () => {
  render(<MasteryBar data={sampleData} />);

  // Initial render checks
  expect(screen.getByPlaceholderText('Search Topic or Mastery...')).toBeInTheDocument();
  expect(screen.getByText('Topic')).toBeInTheDocument();
  expect(screen.getByText('Mastery')).toBeInTheDocument();

  // Check if the sample data is displayed
  expect(screen.getByText('Topic 1')).toBeInTheDocument();
  expect(screen.getByText('75%')).toBeInTheDocument();
  expect(screen.getByText('Topic 2')).toBeInTheDocument();
  expect(screen.getByText('60%')).toBeInTheDocument();
});

test('handles search correctly', () => {
  render(<MasteryBar data={sampleData} />);

  // Enter text in the search input
  const searchInput = screen.getByPlaceholderText('Search Topic or Mastery...');
  fireEvent.change(searchInput, { target: { value: 'Topic 1' } });

  // Check if the filtered results are displayed
  expect(screen.getByText('Topic 1')).toBeInTheDocument();
  expect(screen.queryByText('Topic 2')).not.toBeInTheDocument();

  // Clear the search input
  fireEvent.change(searchInput, { target: { value: '' } });

  // Check if all results are displayed
  expect(screen.getByText('Topic 1')).toBeInTheDocument();
  expect(screen.getByText('Topic 2')).toBeInTheDocument();
});

test('handles sorting correctly', () => {
  render(<MasteryBar data={sampleData} />);

  // Sort by 'Topic'
  fireEvent.click(screen.getByText('Topic'));

  // Check if the data is sorted by 'Topic' ascending
  const topicRows = screen.getAllByTestId('topic-row');
  const topics = topicRows.map((row) => row.querySelector('.topic-cell')!.textContent);
  expect(topics).toEqual(topics.slice().sort());

  // Sort by 'Mastery'
  fireEvent.click(screen.getByText('Mastery'));

  // Check if the data is sorted by 'Mastery' ascending
  const masteryRows = screen.getAllByTestId('topic-row');
  const masteries = masteryRows.map((row) => row.querySelector('.mastery-cell')!.textContent);
  expect(masteries).toEqual(masteries.slice().sort());
});
