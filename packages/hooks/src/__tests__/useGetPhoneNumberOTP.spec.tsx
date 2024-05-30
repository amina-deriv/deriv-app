import { act, renderHook } from '@testing-library/react-hooks';
import { useMutation } from '@deriv/api';
import useGetPhoneNumberOTP from '../useGetPhoneNumberOTP';
import React from 'react';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMutation: jest.fn(),
}));

const mock_response = {
    data: {
        phone_number_challenge: 1,
    },
    mutate: jest.fn(),
};

describe('useGetPhoneNumberOTP', () => {
    it('should validate a correct phone number', async () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useGetPhoneNumberOTP());

        await act(async () => {
            result.current.validatePhoneNumber('+1234567890');
        });

        expect(result.current.error_message).toBe('');
    });

    it('should return error when given an incorrect phone number', async () => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        const { result } = renderHook(() => useGetPhoneNumberOTP());

        await act(async () => {
            result.current.validatePhoneNumber('invalid');
        });

        expect(result.current.error_message).toStrictEqual(['Please enter a valid phone number.']);
    });

    it('should call mutate with correct payload for SMS request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useGetPhoneNumberOTP());

        result.current.requestOnSMS();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(result.current.mutate).toHaveBeenCalledWith({ payload: { carrier: 'sms' } });
        expect(result.current.data).toEqual(1);
    });

    it('should call mutate with correct payload for WhatsApp request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useGetPhoneNumberOTP());

        result.current.requestOnWhatsApp();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(result.current.mutate).toHaveBeenCalledWith({ payload: { carrier: 'whatsapp' } });
        expect(result.current.data).toEqual(1);
    });

    it('should return Localized error message when PhoneNumberTaken error code is passed inside', () => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        const { result } = renderHook(() => useGetPhoneNumberOTP());

        act(() => {
            result.current.handleError({ code: 'PhoneNumberTaken', message: '' });
        });

        if (result.current?.error_message && React.isValidElement(result.current?.error_message))
            expect(result.current?.error_message?.props.i18n_default_text).toBe(
                "This number is in use. Enter a new one or contact <0>live chat</0> if you think there's a mistake."
            );
    });

    it('should return given error message when Other error code is passed inside', () => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        const { result } = renderHook(() => useGetPhoneNumberOTP());

        act(() => {
            result.current.handleError({ code: 'OtherError', message: 'This is an error message' });
        });

        if (result.current?.error_message) expect(result.current?.error_message).toBe('This is an error message');
    });
});
