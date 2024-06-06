import React from 'react';
import PhoneVerificationCard from './phone-verification-card';
import { Text, InputGroupButton } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useSendOTPVerificationCode, useVerifyEmail } from '@deriv/hooks';
import { convertPhoneTypeDisplay } from 'Helpers/utils';
import ResendCodeTimer from './resend-code-timer';
import DidntGetTheCodeModal from './didnt-get-the-code-modal';
import PhoneNumberVerifiedModal from './phone-number-verified-modal';

type TOTPVerification = {
    phone_verification_type: string;
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
};

const OTPVerification = observer(({ phone_verification_type, setOtpVerification }: TOTPVerification) => {
    const { client, ui } = useStore();
    const { account_settings, email } = client;
    const { phone } = account_settings;
    const [should_show_phone_number_verified_modal, setShouldShowPhoneNumberVerifiedModal] = React.useState(false);
    const [should_show_didnt_get_the_code_modal, setShouldShowDidntGetTheCodeModal] = React.useState(false);
    const [start_timer, setStartTimer] = React.useState(true);
    const [otp, setOtp] = React.useState('');

    const { send } = useVerifyEmail('phone_number_verification');
    const {
        sendPhoneOTPVerification,
        phone_otp_error_message,
        setPhoneOtpErrorMessage,
        is_phone_number_verified,
        is_email_verified,
        sendEmailOTPVerification,
    } = useSendOTPVerificationCode();
    //TODO: this shall be replace by BE API call when it's ready
    const { should_show_phone_number_otp } = ui;

    React.useEffect(() => {
        if (is_phone_number_verified) {
            setShouldShowPhoneNumberVerifiedModal(true);
        } else if (is_email_verified) {
            setOtpVerification({ show_otp_verification: false, phone_verification_type: '' });
        } else if (!should_show_phone_number_otp) {
            send();
        }
    }, [
        should_show_phone_number_otp,
        send,
        is_phone_number_verified,
        setShouldShowPhoneNumberVerifiedModal,
        is_email_verified,
        setOtpVerification,
    ]);

    const handleGetOtpValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
        setPhoneOtpErrorMessage('');
    };

    const handleVerifyOTP = () => {
        //TODO: inplement function to verify OTP when BE API is ready
        if (should_show_phone_number_otp) {
            sendPhoneOTPVerification(otp);
        } else {
            localStorage.setItem('email_otp_code', otp);
            sendEmailOTPVerification(otp);
        }
    };

    return (
        <PhoneVerificationCard is_small_card>
            <PhoneNumberVerifiedModal
                should_show_phone_number_verified_modal={should_show_phone_number_verified_modal}
                setShouldShowPhoneNumberVerifiedModal={setShouldShowPhoneNumberVerifiedModal}
            />
            <DidntGetTheCodeModal
                should_show_didnt_get_the_code_modal={should_show_didnt_get_the_code_modal}
                setShouldShowDidntGetTheCodeModal={setShouldShowDidntGetTheCodeModal}
                phone_verification_type={phone_verification_type}
                setOtpVerification={setOtpVerification}
                setStartTimer={setStartTimer}
            />
            <Text bold>
                {should_show_phone_number_otp ? (
                    <Localize i18n_default_text='Verify your number' />
                ) : (
                    <Localize i18n_default_text="Confirm it's you" />
                )}
            </Text>
            <div className='phone-verification__card--email-verification-content'>
                {should_show_phone_number_otp ? (
                    <Text size='sm'>
                        <Localize
                            i18n_default_text='Enter the 6-digit code sent to you via {{phone_verification_type}} at {{users_phone_number}}:'
                            values={{
                                phone_verification_type: localize(convertPhoneTypeDisplay(phone_verification_type)),
                                users_phone_number: phone,
                            }}
                        />
                    </Text>
                ) : (
                    <React.Fragment>
                        <Text size='sm'>
                            <Localize
                                i18n_default_text="We've sent a verification code to <0>{{users_email}}</0>."
                                values={{ users_email: email }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                        <Text size='sm'>
                            <Localize i18n_default_text='Enter the code or click the link in the email to verify that the account belongs to you.' />
                        </Text>
                    </React.Fragment>
                )}
            </div>
            <div className='phone-verification__card--email-verification-otp-container'>
                <InputGroupButton
                    status={phone_otp_error_message ? 'error' : 'neutral'}
                    buttonLabel={localize('Verify')}
                    label={localize('OTP code')}
                    buttonCallback={handleVerifyOTP}
                    onChange={handleGetOtpValue}
                    message={phone_otp_error_message}
                    maxLength={6}
                />
                <ResendCodeTimer
                    resend_code_text={should_show_phone_number_otp ? "Didn't get the code?" : 'Resend code'}
                    //TODOS: replace hardcoded timer when timestamp BE API is ready
                    count_from={60}
                    setShouldShowDidntGetTheCodeModal={setShouldShowDidntGetTheCodeModal}
                    start_timer={start_timer}
                    setStartTimer={setStartTimer}
                />
            </div>
        </PhoneVerificationCard>
    );
});

export default OTPVerification;
