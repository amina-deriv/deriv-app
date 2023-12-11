import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { Modal, Text, Icon, Div100vhContainer, Button } from '@deriv/components';

const EmailVerifiedModal = observer(() => {
    const { ui } = useStore();
    const { is_email_verification_required, setIsEmailVerificationRequired, disableApp, enableApp, is_desktop } = ui;

    return (
        <Modal
            className='sent-email__modal'
            is_open={is_email_verification_required}
            has_close_icon
            should_header_stick_body
            title=''
            toggleModal={setIsEmailVerificationRequired}
            width='440px'
        >
            <Div100vhContainer
                className='account__scrollbars_container-wrapper'
                is_disabled={is_desktop}
                height_offset='80px'
            >
                <Modal.Body>
                    <div className='send-email-template__close' data-testid='dt_send_email_template_close'>
                        <Icon icon='IcCross' />
                    </div>
                    <div className='email-verified-modal'>
                        <Icon icon='IcEmailVerifiiedCheckmark' className='send-email-template__icon' size={64} />
                        <Text
                            as='h1'
                            align='center'
                            className='send-email-template__title'
                            color='prominent'
                            weight='bold'
                        >
                            <Localize i18n_default_text='Email verified' />
                        </Text>
                        <Text as='p' size='xs' align='center'>
                            <Localize i18n_default_text='Nice! You can now create a real account and enjoy all the features on Deriv.' />
                        </Text>
                        <Button primary>
                            <Localize i18n_default_text='Create real account' />
                        </Button>
                    </div>
                </Modal.Body>
            </Div100vhContainer>
        </Modal>
    );
});

export default EmailVerifiedModal;
