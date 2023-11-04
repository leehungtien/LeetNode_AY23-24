import React from 'react';
import "@testing-library/jest-dom";
import { render, screen } from '@testing-library/react';
import Overview from './Overview'; // Assuming the component is in a file named Overview.js

describe('Overview Statistics Component', () => {
    const sampleMasteryData = [
        { topicName: 'Topic 1', masteryLevel: 90 },
        { topicName: 'Topic 2', masteryLevel: 70 },
        { topicName: 'Topic 3', masteryLevel: 50 },
    ];

    it('should display "No mastery found" when no data is provided', () => {
        render(<Overview masteryData={[]} />);
        const noMasteryFoundText = screen.getByText('No mastery found');
        expect(noMasteryFoundText).toBeInTheDocument();
    });

    it('should display the highest and lowest mastery levels and topic names', () => {
        render(<Overview masteryData={sampleMasteryData} />);

        const highestMasteryLabel = screen.getByText('Highest Mastery');
        const lowestMasteryLabel = screen.getByText('Lowest Mastery');

        const highestMasteryTopic = screen.getByText('Topic 1');
        const lowestMasteryTopic = screen.getByText('Topic 3');

        const highestMasteryPercentage = screen.getByText('90%');
        const lowestMasteryPercentage = screen.getByText('50%');

        expect(highestMasteryLabel).toBeInTheDocument();
        expect(lowestMasteryLabel).toBeInTheDocument();

        expect(highestMasteryTopic).toBeInTheDocument();
        expect(lowestMasteryTopic).toBeInTheDocument();

        expect(highestMasteryPercentage).toBeInTheDocument();
        expect(lowestMasteryPercentage).toBeInTheDocument();
    });

    it('should not display topics with a mastery level of 0', () => {
        const masteryDataWithZero = [
            ...sampleMasteryData,
            { topicName: 'Topic 4', masteryLevel: 0 },
        ];
        render(<Overview masteryData={masteryDataWithZero} />);

        const zeroMasteryTopic = screen.queryByText('Topic 4');

        expect(zeroMasteryTopic).not.toBeInTheDocument();
    });
});
