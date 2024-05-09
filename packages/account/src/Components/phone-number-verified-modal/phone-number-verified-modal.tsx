import React from 'react';
import { Button, Text } from '@deriv-com/quill-ui';
import { Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';

const PhoneNumberVerifiedModal = observer(() => {
    const { ui } = useStore();
    const { should_show_phone_number_verified_modal, setShouldShowPhoneNumberVerifiedModal } = ui;

    return (
        <Modal className='phone-verification__cancel-modal' is_open={should_show_phone_number_verified_modal}>
            <Modal.Body>
                <div className='phone-verification__cancel-modal--contents'>
                    <Text bold>
                        <Localize i18n_default_text='Verification successful' />
                    </Text>
                    <Text>
                        <Localize i18n_default_text="That's it! Your number is verified." />
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='phone-verification__cancel-modal--buttons'>
                    <Button
                        color='black'
                        fullWidth
                        size='lg'
                        onClick={() => setShouldShowPhoneNumberVerifiedModal(false)}
                    >
                        <Text color='white' bold>
                            <Localize i18n_default_text='Done' />
                        </Text>
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
});

export default PhoneNumberVerifiedModal;
