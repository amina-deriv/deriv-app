import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { SentEmailModal } from '@deriv/account';
import { localize, Localize } from '@deriv/translations';
import { Dialog, Text } from '@deriv/components';

const EmailVerificationRequiredModal = observer(() => {
    const { ui, client } = useStore();
    const { email } = client;
    const { is_email_verification_required, setIsEmailVerificationRequired, disableApp, enableApp, is_mobile } = ui;

    const [should_show_sent_email_modal, setIsSentEmailModalOpen] = React.useState(false);
    if (should_show_sent_email_modal) {
        return (
            <SentEmailModal
                title={<Localize i18n_default_text='Check your email' />}
                subtitle={
                    <Localize
                        i18n_default_text='We’ve sent a message to {{email}} with a link to activate your account.'
                        values={{
                            email,
                        }}
                    />
                }
                icon='IcEmailSend'
                is_open={should_show_sent_email_modal}
                identifier_title='trading_password'
                onClose={() => setIsSentEmailModalOpen(false)}
                has_live_chat
                is_modal_when_mobile
                onClickSendEmail={() => console.log('onClickSendEmail')} //TODO: CHANGE THIS TO ACTUAL FUNCTION
            />
        );
    }

    return (
        <Dialog
            className='open-real-account-dialog'
            title={<Localize i18n_default_text='First, verify your email' />}
            confirm_button_text={localize('Verify email')}
            onConfirm={() => setIsSentEmailModalOpen(true)}
            onClose={() => setIsEmailVerificationRequired(false)}
            has_close_icon={true}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_email_verification_required}
        >
            <Text size={is_mobile ? 'xxs' : 'xs'}>
                <Localize i18n_default_text='To get a real account and enjoy all the features on Deriv, you’ll need to confirm your email.' />
            </Text>
        </Dialog>
    );
});

export default EmailVerificationRequiredModal;
