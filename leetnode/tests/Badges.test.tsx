import React from 'react';
import { render } from '@testing-library/react';
import {
  RoleBadge,
  QuestionDifficultyBadge,
  PostTypeBadge,
  CourseTypeBadge,
} from '../src/components/misc/Badges'; // Import your badge components
import { Level, CourseType } from '@prisma/client';

describe('RoleBadge', () => {
  it('renders RoleBadge component with a role of SUPERUSER', () => {
    const { getByText } = render(<RoleBadge role="SUPERUSER" />);
    expect(getByText('SUPERUSER')).toBeInTheDocument();
  });

  it('renders RoleBadge component with a role of ADMIN', () => {
    const { getByText } = render(<RoleBadge role="ADMIN" />);
    expect(getByText('ADMIN')).toBeInTheDocument();
  });

  it('renders RoleBadge component with an undefined role', () => {
    const { getByText } = render(<RoleBadge role={undefined} />);
    expect(getByText('')).toBeInTheDocument();
  });
});

describe('QuestionDifficultyBadge', () => {
  it('renders QuestionDifficultyBadge component with difficulty Easy', () => {
    const { getByText } = render(
      <QuestionDifficultyBadge questionDifficulty="Easy" />
    );
    expect(getByText('Easy Difficulty')).toBeInTheDocument();
  });

  it('renders QuestionDifficultyBadge component with difficulty Medium', () => {
    const { getByText } = render(
      <QuestionDifficultyBadge questionDifficulty="Medium" />
    );
    expect(getByText('Medium Difficulty')).toBeInTheDocument();
  });

  it('renders QuestionDifficultyBadge component with difficulty Hard', () => {
    const { getByText } = render(
      <QuestionDifficultyBadge questionDifficulty="Hard" />
    );
    expect(getByText('Hard Difficulty')).toBeInTheDocument();
  });
});

describe('PostTypeBadge', () => {
  it('renders PostTypeBadge component with PostType Content', () => {
    const { getByText } = render(<PostTypeBadge postType="Content" />);
    expect(getByText('Content')).toBeInTheDocument();
  });

  it('renders PostTypeBadge component with PostType Quiz', () => {
    const { getByText } = render(<PostTypeBadge postType="Quiz" />);
    expect(getByText('Quiz')).toBeInTheDocument();
  });

  it('renders PostTypeBadge component with an undefined post type', () => {
    const { getByText } = render(<PostTypeBadge postType={undefined} />);
    expect(getByText('')).toBeInTheDocument();
  });
});

describe('CourseTypeBadge', () => {
  it('renders CourseTypeBadge component with CourseType Content and Level Foundational', () => {
    const course = {
      courseName: 'Example Course',
      courseLevel: Level.Foundational,
      type: CourseType.Content,
    };

    const { getByText } = render(<CourseTypeBadge course={course} />);
    expect(getByText('Example Course')).toBeInTheDocument();
  });

  it('renders CourseTypeBadge component with CourseType Content and Level Intermediate', () => {
    const course = {
      courseName: 'Example Course',
      courseLevel: Level.Intermediate,
      type: CourseType.Content,
    };

    const { getByText } = render(<CourseTypeBadge course={course} />);
    expect(getByText('Example Course')).toBeInTheDocument();
  });

  it('renders CourseTypeBadge component with CourseType Quiz', () => {
    const course = {
      courseName: 'Example Course',
      courseLevel: Level.Intermediate,
      type: CourseType.Quiz,
    };

    const { getByText } = render(<CourseTypeBadge course={course} />);
    expect(getByText('Example Course')).toBeInTheDocument();
  });
});