import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import Icon from '@deriv/components/src/components/icon/icon';

type TUploadReminderProps = {
    handleAcceptedFiles: () => void;
};

const reminder_notes = [
    'We only accept legitimate documents.',
    'We do not provide second opportunity to upload a document if the previously submitted one is illegitimate',
    'Non-compliance with this rule may result in account termination and loss of funds',
];
const UploadReminder = ({ handleAcceptedFiles }: TUploadReminderProps) => {
    return (
        <Modal is_open has_close_icon={false} className='upload_reminder' width='44rem'>
            <Modal.Body>
                <div className='upload_reminder-header'>
                    <Icon icon='IcAlertWarning' size={40} />
                    <Text as='p' size='s' align='center' weight='bold'>
                        <Localize i18n_default_text='Important Reminder' />
                    </Text>
                </div>
                <div>
                    <ul>
                        {reminder_notes.map((note, idx) => (
                            <li key={idx} className='upload_reminder-item'>
                                <Text as='p' size='xs' line_height='s'>
                                    {note}
                                </Text>
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal.Body>
            <Modal.Footer className='upload_reminder-footer'>
                <Button has_effect onClick={handleAcceptedFiles} primary>
                    <Localize i18n_default_text='Continue' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UploadReminder;
