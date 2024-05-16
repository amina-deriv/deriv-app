import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import ResendCodeTimer from '../resend-code-timer';

describe('ConfirmPhoneNumber', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should disable button after its clicked', () => {
        render(
            <ResendCodeTimer
                resend_code_text='Resend code'
                count_from={60}
                setStartTimer={jest.fn()}
                start_timer
                setShouldShowDidntGetTheCodeModal={jest.fn()}
            />
        );
        const resend_button = screen.getByRole('button', { name: 'Resend code in 60s' });

        userEvent.click(resend_button);

        expect(resend_button).toBeDisabled();
    });

    it('should display correct title if value of resend_code_text is Resend code', () => {
        render(
            <ResendCodeTimer
                resend_code_text='Resend code'
                count_from={60}
                setStartTimer={jest.fn()}
                start_timer
                setShouldShowDidntGetTheCodeModal={jest.fn()}
            />
        );
        const resend_button = screen.getByRole('button', { name: 'Resend code in 60s' });
        expect(resend_button).toBeInTheDocument();
    });

    it('should display correct title if value of resend_code_text is Didn’t get the code?', () => {
        render(
            <ResendCodeTimer
                resend_code_text='Didn’t get the code?'
                count_from={60}
                setStartTimer={jest.fn()}
                start_timer
                setShouldShowDidntGetTheCodeModal={jest.fn()}
            />
        );
        const resend_button = screen.getByRole('button', { name: 'Didn’t get the code? (60s)' });
        expect(resend_button).toBeInTheDocument();
    });

    it('should check if title changes when timer expires and value of resend_code_text is Didn’t get the code?', () => {
        render(
            <ResendCodeTimer
                resend_code_text='Didn’t get the code?'
                count_from={6}
                setStartTimer={jest.fn()}
                start_timer
                setShouldShowDidntGetTheCodeModal={jest.fn()}
            />
        );
        const resend_button = screen.getByRole('button', { name: 'Didn’t get the code? (6s)' });
        userEvent.click(resend_button);

        act(() => {
            jest.advanceTimersByTime(6000); // Advance timers by 6 seconds
        });

        const resend_button_after = screen.getByRole('button', { name: 'Didn’t get the code?' });
        expect(resend_button_after).toBeInTheDocument();
    });

    it('should trigger setShouldShowDidntGetTheCodeModal when Didn`t get the code is clicked', () => {
        const setShouldShowDidntGetTheCodeModal = jest.fn();
        render(
            <ResendCodeTimer
                resend_code_text='Didn’t get the code?'
                count_from={6}
                setStartTimer={jest.fn()}
                start_timer={false}
                setShouldShowDidntGetTheCodeModal={setShouldShowDidntGetTheCodeModal}
            />
        );
        const resend_button_after = screen.getByRole('button', { name: 'Didn’t get the code?' });
        userEvent.click(resend_button_after);
        expect(setShouldShowDidntGetTheCodeModal).toHaveBeenCalled();
    });

    it('should check if title displays countdown time when timer starts and value of resend_code_text is Didn’t get the code?', async () => {
        render(
            <ResendCodeTimer
                resend_code_text='Didn’t get the code?'
                count_from={6}
                setStartTimer={jest.fn()}
                start_timer
                setShouldShowDidntGetTheCodeModal={jest.fn()}
            />
        );
        const resend_button = screen.getByRole('button', { name: 'Didn’t get the code? (6s)' });
        userEvent.click(resend_button);

        await waitFor(
            () => {
                const resend_button = screen.getByRole('button', { name: 'Didn’t get the code? (4s)' });
                expect(resend_button).toBeInTheDocument();
            },
            { timeout: 4000 }
        );
    });

    it('should check if title changes when timer expires and value of resend_code_text is Resend code', () => {
        render(
            <ResendCodeTimer
                resend_code_text='Resend code'
                count_from={6}
                setStartTimer={jest.fn()}
                start_timer
                setShouldShowDidntGetTheCodeModal={jest.fn()}
            />
        );
        const resend_button = screen.getByRole('button', { name: 'Resend code in 6s' });
        userEvent.click(resend_button);

        act(() => {
            jest.advanceTimersByTime(6000);
        });

        const resend_button_after = screen.getByRole('button', { name: 'Resend code' });
        expect(resend_button_after).toBeInTheDocument();
    });

    it('should check if title displays countdown time when timer starts and value of resend_code_text is Resend code', async () => {
        render(
            <ResendCodeTimer
                resend_code_text='Resend code'
                count_from={6}
                setStartTimer={jest.fn()}
                start_timer
                setShouldShowDidntGetTheCodeModal={jest.fn()}
            />
        );
        const resend_button = screen.getByRole('button', { name: 'Resend code in 6s' });
        userEvent.click(resend_button);

        await waitFor(
            () => {
                const resend_button = screen.getByRole('button', { name: 'Resend code in 4s' });
                expect(resend_button).toBeInTheDocument();
            },
            { timeout: 4000 }
        );
    });
});
