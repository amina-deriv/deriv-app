import React from 'react';
import { Link } from 'react-router-dom';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const getStatusBadgeConfig = (
    account_status: string,
    openFailedVerificationModal: (selected_account_type: string) => void,
    selected_account_type: string
) => {
    switch (account_status) {
        case 'pending':
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Pending verification</0>'
                        components={[<Text key={0} weight='bold' size='xxxs' color='var(--status-warning)' />]}
                    />
                ),
                icon: 'IcAlertWarning',
            };
        case 'failed':
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Verification failed.</0> <1>Why?</1>'
                        components={[
                            <Text key={0} weight='bold' size='xxxs' color='var(--status-danger)' />,
                            <Text
                                key={1}
                                className='link-verification-failed'
                                onClick={() => {
                                    openFailedVerificationModal(selected_account_type);
                                }}
                            />,
                        ]}
                    />
                ),
                icon: 'IcRedWarning',
            };
        case 'needs_verification':
            return {
                text: (
                    <Localize
                        i18n_default_text='<0>Needs verification.</0><1>Verify now</1>'
                        components={[
                            <Text key={0} weight='bold' size='xxxs' color='var(--status-info)' />,
                            <Link key={1} className='link-need-verification' to='/account/proof-of-identity' />, // TODO: [deriv-eu] change this link when we have the new verification pop-up
                        ]}
                    />
                ),
                icon: 'IcAlertInfo',
            };
        default:
            return {
                text: '',
                icon: '',
            };
    }
};

export default getStatusBadgeConfig;
