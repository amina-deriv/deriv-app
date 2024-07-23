import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WS } from '@deriv/shared';
import ResetPasswordModal from '../reset-password-modal';
import { StoreProvider, mockStore } from '@deriv/stores';
import { APIProvider } from '@deriv/api';
import { TStores } from '@deriv/stores/types';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        resetPassword: jest.fn(() => Promise.resolve()),
    },
    useWS: () => undefined,
    getErrorMessages: jest.fn(() => ({
        password_warnings: jest.fn(() => 'common password .'),
        password: jest.fn(() => 'Invalid password.'),
    })),
    redirectToLogin: jest.fn(),
}));

const mock = {
    ui: {
        is_reset_password_modal_visible: true,
        is_loading: false,
    },
    client: {
        verification_code: {
            reset_password: '@rnv!sv',
        },
        setVerificationCode: jest.fn(),
        logout: jest.fn(() => Promise.resolve()),
    },
};

describe('ResetPasswordModal', () => {
    let store = mockStore({});

    beforeEach(() => {
        store = mockStore(mock);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (store: TStores) => {
        render(
            <StoreProvider store={store}>
                <BrowserRouter>
                    <APIProvider>
                        <ResetPasswordModal />
                    </APIProvider>
                </BrowserRouter>
            </StoreProvider>
        );
    };

    it('should not render the reset password modal if is_reset_password_modal_visible is false ', () => {
        store = mockStore({
            ...mock,
            ui: {
                ...mock.ui,
                is_reset_password_modal_visible: false,
            },
        });
        renderComponent(store);
        expect(screen.queryByText('Reset your password')).not.toBeInTheDocument();
    });

    it('should render the reset password modal', () => {
        renderComponent(store);
        expect(screen.getByText('Reset your password')).toBeInTheDocument();
        expect(
            screen.getByText(
                /strong passwords contain at least 8 characters\. combine uppercase and lowercase letters, numbers, and symbols\./i
            )
        ).toBeInTheDocument();
    });

    it('should change input of password and trigger change password button', async () => {
        const TEST_PASSWORD = 'hN795jCWkDtPy5@';
        WS.resetPassword.mockReturnValue(Promise.resolve({ reset_password: 1 }));

        renderComponent(store);

        await waitForElementToBeRemoved(() => screen.getByTestId('dt_initial_loader'));

        const new_input = screen.getByLabelText('Create a password', { selector: 'input' });

        fireEvent.change(new_input, {
            target: { value: TEST_PASSWORD },
        });
        expect(new_input).toHaveValue(TEST_PASSWORD);

        expect(screen.getByRole('button', { name: /Reset my password/i })).toBeEnabled();

        fireEvent.click(
            screen.getByRole('button', {
                name: /reset my password/i,
            })
        );

        await waitFor(() => {
            expect(WS.resetPassword).toHaveBeenCalled();
        });

        expect(store.client.setVerificationCode).toHaveBeenCalledTimes(1);
        expect(store.client.logout).toHaveBeenCalledTimes(1);

        expect(screen.getByText('Your password has been changed')).toBeInTheDocument();
    });
});
