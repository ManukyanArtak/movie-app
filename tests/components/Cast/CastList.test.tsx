import React from 'react';
import { render, screen } from '@testing-library/react';
import { CastList } from '../../../src/components/Cast/CastList/CastList';
import type { Cast } from '../../../src/types/tmdb';

jest.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon">User Icon</div>,
}));

jest.mock('../../../src/services/tmdb', () => ({
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  BACKDROP_BASE_URL: 'https://image.tmdb.org/t/p/original',
}));

describe('<CastList />', () => {
  const mockCast: Cast[] = [
    {
      id: 1,
      name: 'Robert Downey Jr.',
      character: 'Tony Stark / Iron Man',
      profile_path: '/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg',
      order: 0,
    },
    {
      id: 2,
      name: 'Chris Evans',
      character: 'Steve Rogers / Captain America',
      profile_path: '/3bOGNsHlrswhyW79uvIHH1V43JI.jpg',
      order: 1,
    },
    {
      id: 3,
      name: 'Scarlett Johansson',
      character: 'Natasha Romanoff / Black Widow',
      profile_path: null,
      order: 2,
    },
  ];

  test('renders section title', () => {
    render(<CastList cast={mockCast} />);
    
    expect(screen.getByText('Cast')).toBeInTheDocument();
  });

  test('renders all cast members', () => {
    render(<CastList cast={mockCast} />);
    
    expect(screen.getByText('Robert Downey Jr.')).toBeInTheDocument();
    expect(screen.getByText('Chris Evans')).toBeInTheDocument();
    expect(screen.getByText('Scarlett Johansson')).toBeInTheDocument();
  });

  test('renders all character names', () => {
    render(<CastList cast={mockCast} />);
    
    expect(screen.getByText('Tony Stark / Iron Man')).toBeInTheDocument();
    expect(screen.getByText('Steve Rogers / Captain America')).toBeInTheDocument();
    expect(screen.getByText('Natasha Romanoff / Black Widow')).toBeInTheDocument();
  });

  test('renders correct number of cast cards', () => {
    render(<CastList cast={mockCast} />);
    
    const actorNames = [
      screen.getByText('Robert Downey Jr.'),
      screen.getByText('Chris Evans'),
      screen.getByText('Scarlett Johansson'),
    ];
    
    expect(actorNames).toHaveLength(3);
  });

  test('renders empty cast list', () => {
    render(<CastList cast={[]} />);
    
    expect(screen.getByText('Cast')).toBeInTheDocument();
    
    expect(screen.queryByText('Robert Downey Jr.')).not.toBeInTheDocument();
  });

  test('renders single cast member', () => {
    const singleCast: Cast[] = [mockCast[0]];
    
    render(<CastList cast={singleCast} />);
    
    expect(screen.getByText('Cast')).toBeInTheDocument();
    expect(screen.getByText('Robert Downey Jr.')).toBeInTheDocument();
    expect(screen.queryByText('Chris Evans')).not.toBeInTheDocument();
  });

  test('handles cast members with and without photos', () => {
    render(<CastList cast={mockCast} />);
    
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(2);
    
    const placeholderIcon = screen.getByTestId('user-icon');
    expect(placeholderIcon).toBeInTheDocument();
  });

  test('renders cast members in correct order', () => {
    render(<CastList cast={mockCast} />);
    
    const actorNames = screen.getAllByRole('paragraph').filter((el) =>
      ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'].includes(el.textContent || '')
    );
    
    expect(actorNames[0]).toHaveTextContent('Robert Downey Jr.');
    expect(actorNames[1]).toHaveTextContent('Chris Evans');
    expect(actorNames[2]).toHaveTextContent('Scarlett Johansson');
  });

  test('each cast card has unique key', () => {
    const { container } = render(<CastList cast={mockCast} />);
    
    expect(screen.getByText('Robert Downey Jr.')).toBeInTheDocument();
    expect(screen.getByText('Chris Evans')).toBeInTheDocument();
    expect(screen.getByText('Scarlett Johansson')).toBeInTheDocument();
  });

  test('handles large cast list', () => {
    const largeCast: Cast[] = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      name: `Actor ${index + 1}`,
      character: `Character ${index + 1}`,
      profile_path: index % 2 === 0 ? `/path${index}.jpg` : null,
      order: index,
    }));

    render(<CastList cast={largeCast} />);
    
    expect(screen.getByText('Actor 1')).toBeInTheDocument();
    expect(screen.getByText('Actor 20')).toBeInTheDocument();
  });
});

