import React from 'react';
import { render, screen } from '@testing-library/react';
import { CastCard } from '../../../src/components/Cast/CastCard/CastCard';
import type { Cast } from '../../../src/types/tmdb';

jest.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon">User Icon</div>,
}));

jest.mock('../../../src/services/tmdb', () => ({
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  BACKDROP_BASE_URL: 'https://image.tmdb.org/t/p/original',
}));

describe('<CastCard />', () => {
  const mockActorWithPhoto: Cast = {
    id: 1,
    name: 'Robert Downey Jr.',
    character: 'Tony Stark / Iron Man',
    profile_path: '/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg',
    order: 0,
  };

  const mockActorWithoutPhoto: Cast = {
    id: 2,
    name: 'Chris Evans',
    character: 'Steve Rogers / Captain America',
    profile_path: null,
    order: 1,
  };

  test('renders actor name and character', () => {
    render(<CastCard actor={mockActorWithPhoto} />);
    
    expect(screen.getByText('Robert Downey Jr.')).toBeInTheDocument();
    expect(screen.getByText('Tony Stark / Iron Man')).toBeInTheDocument();
  });

  test('renders actor photo when profile_path exists', () => {
    render(<CastCard actor={mockActorWithPhoto} />);
    
    const img = screen.getByAltText('Robert Downey Jr.');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining(mockActorWithPhoto.profile_path!));
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  test('renders placeholder icon when profile_path is null', () => {
    render(<CastCard actor={mockActorWithoutPhoto} />);
    
    const placeholderIcon = screen.getByTestId('user-icon');
    expect(placeholderIcon).toBeInTheDocument();
    expect(screen.queryByAltText('Chris Evans')).not.toBeInTheDocument();
  });

  test('renders correct character name for actor without photo', () => {
    render(<CastCard actor={mockActorWithoutPhoto} />);
    
    expect(screen.getByText('Chris Evans')).toBeInTheDocument();
    expect(screen.getByText('Steve Rogers / Captain America')).toBeInTheDocument();
  });

  test('renders with empty character string', () => {
    const actorWithNoCharacter: Cast = {
      ...mockActorWithPhoto,
      character: '',
    };

    render(<CastCard actor={actorWithNoCharacter} />);
    
    expect(screen.getByText('Robert Downey Jr.')).toBeInTheDocument();
    const characterElements = screen.getAllByText('', { selector: 'p' });
    expect(characterElements.length).toBeGreaterThan(0);
  });

  test('handles special characters in actor name', () => {
    const actorWithSpecialChars: Cast = {
      ...mockActorWithPhoto,
      name: "O'Connor-Smith Jr.",
      character: 'Test Character',
    };

    render(<CastCard actor={actorWithSpecialChars} />);
    
    expect(screen.getByText("O'Connor-Smith Jr.")).toBeInTheDocument();
  });
});

