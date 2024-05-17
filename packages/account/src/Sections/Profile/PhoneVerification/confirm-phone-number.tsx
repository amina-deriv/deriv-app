import React from 'react';
import PhoneVerificationCard from './phone-verification-card';
import { Button, Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { Input } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useGetPhoneNumberOTP } from '@deriv/hooks';
import { VERIFICATION_SERVICES } from '@deriv/shared';

type TConfirmPhoneNumber = {
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
};

const ConfirmPhoneNumber = observer(({ setOtpVerification }: TConfirmPhoneNumber) => {
    const { requestOnSMS, requestOnWhatsApp, ...rest } = useGetPhoneNumberOTP();
    const { client, ui } = useStore();
    const { account_settings } = client;
    const { setShouldShowPhoneNumberOTP } = ui;
    const phone_number = account_settings.phone || '';
    const handleSubmit = (phone_verification_type: string) => {
        phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnSMS() : requestOnWhatsApp();
        setOtpVerification({ show_otp_verification: true, phone_verification_type });
        setShouldShowPhoneNumberOTP(true);
    };

    return (
        <PhoneVerificationCard>
            <Text bold>
                <Localize i18n_default_text='Confirm your phone number' />
            </Text>
            <Input label={localize('Phone number')} value={phone_number} />
            <div className='phone-verification__card--buttons_container'>
                <Button
                    variant='secondary'
                    color='black'
                    fullWidth
                    size='lg'
                    onClick={() => handleSubmit(VERIFICATION_SERVICES.SMS)}
                >
                    <Text bold>
                        <Localize i18n_default_text='Get code via SMS' />
                    </Text>
                </Button>
                <Button color='black' fullWidth size='lg' onClick={() => handleSubmit(VERIFICATION_SERVICES.WHATSAPP)}>
                    <Text color='white' bold>
                        <Localize i18n_default_text='Get code via WhatsApp' />
                    </Text>
                </Button>
            </div>
        </PhoneVerificationCard>
    );
});

export default ConfirmPhoneNumber;
