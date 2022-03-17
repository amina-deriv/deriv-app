import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, screen, render } from '@testing-library/react';
import AccountLimitsOverlay from '../account-limits-overlay';
import AccountLimitsContext from '../account-limits-context';
jest.mock('react', () => {
    const ActualReact = jest.requireActual('react');
    return {
        ...ActualReact,
        useContext: () => ({
            overlay_ref: <div data-testid='mocked_overlay_ref'></div>,
            toggleOverlay: jest.fn(),
        }),
    };
});

describe('<AccountLimitsOverlay/>', () => {
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(element => {
            return element;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    const Component = () => (
        <AccountLimitsContext.Provider
            value={{
                overlay_ref: <div data-testid='mocked_overlay_ref'></div>,
                toggleOverlay: jest.fn(),
            }}
        >
            <AccountLimitsOverlay />
        </AccountLimitsContext.Provider>
    );

    it('should render AccountLimitsOverlay component', () => {
        render(<Component />);
        expect(screen.getByRole('heading', { name: /account limits/i })).toBeInTheDocument();
        expect(screen.getByText(/these are default limits that we apply to your accounts\./i)).toBeInTheDocument();
    });

    it('should go to help-centre page if the Help Centre link on the text is clicked', () => {
        render(<Component />);

        expect(screen.getByText('Help Centre').closest('a')).toHaveAttribute('href', 'https://deriv.com/help-centre');
    });
    it('should show Done Button', () => {
        render(<Component />);

        const done_btn = screen.getByRole('button', {
            name: /done/i,
        });
        expect(done_btn).toBeInTheDocument();
    });
});
