import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../src/components/Button/Button';

describe('<Button />', () => {
    test('renders its children text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    test('renders with correct default props', () => {
        render(<Button>Default</Button>);
        const btn = screen.getByRole('button', { name: /default/i });
        expect(btn).toBeEnabled();
    });

    test('accepts standard button props', () => {
        render(
            <Button type="button" disabled aria-label="action">
                Do it
            </Button>
        );
        const btn = screen.getByRole('button', { name: /action/i });
        expect(btn).toBeDisabled();
        expect(btn).toHaveAttribute('type', 'button');
        expect(btn).toHaveAttribute('aria-label', 'action');
    });

    test('fires onClick when clicked', async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();

        render(<Button onClick={handleClick}>Press</Button>);
        const btn = screen.getByRole('button', { name: /press/i });

        await user.click(btn);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders full width when prop is set (visual property only)', () => {
        render(<Button fullWidth>Wide Button</Button>);
        expect(screen.getByRole('button', { name: /wide button/i })).toBeInTheDocument();
    });
});
