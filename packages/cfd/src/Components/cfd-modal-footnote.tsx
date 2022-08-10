import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile, getIdentityStatusInfo } from '@deriv/shared';
import { general_messages } from '../Constants/cfd-shared-strings';
import { GetAccountStatus } from '@deriv/api-types';

type TModalFootNote = {
    jurisdiction_selected_shortcode: string;
    is_fully_authenticated: boolean;
    account_status: GetAccountStatus;
    card_classname?: string;
};
const ModalFootNote = ({
    jurisdiction_selected_shortcode,
    is_fully_authenticated,
    account_status,
    card_classname,
}: TModalFootNote) => {
    // const account_type_name = account_type === 'synthetic' ? 'Synthetics' : 'Financial';
    const account_type_name = 'Synthetics';

    const {
        need_poi_for_vanuatu,
        need_poi_for_bvi_labuan,
        need_poa_submission,
        poi_verified_for_vanuatu,
        poi_verified_for_labuan_bvi,
        poa_verified,
        poi_acknowledged_for_bvi_labuan,
        poi_acknowledged_for_vanuatu,
        poa_acknowledged,
        poi_poa_none,
        poa_poi_verified_for_labuan_bvi,
        poa_poi_verified_for_vanuatu,
    } = getIdentityStatusInfo(account_status);

    return (
        <>
            {jurisdiction_selected_shortcode === 'svg' && (
                <div className={card_classname}>
                    <Text as='p'>{general_messages.getMT5LicenceNotes(account_type_name, 'svg')}</Text>
                </div>
            )}

            {poi_verified_for_labuan_bvi && poa_verified && jurisdiction_selected_shortcode === 'bvi' && (
                <div className={card_classname}>
                    <Text as='p'>{general_messages.getMT5LicenceNotes(account_type_name, 'bvi')}</Text>
                </div>
            )}
            {poi_verified_for_vanuatu && poa_verified && jurisdiction_selected_shortcode === 'vanuatu' && (
                <div className={card_classname}>
                    <Text as='p'>{general_messages.getMT5LicenceNotes(account_type_name, 'vanuatu')}</Text>
                </div>
            )}
            {poi_verified_for_labuan_bvi && poa_verified && jurisdiction_selected_shortcode === 'labuan' && (
                <div className={card_classname}>
                    <Text as='p'>{general_messages.getMT5LicenceNotes(account_type_name, 'labuan')}</Text>
                </div>
            )}
            {is_fully_authenticated && jurisdiction_selected_shortcode === 'maltainvest' && (
                <div className={card_classname}>
                    <Text as='p'>{general_messages.getMT5LicenceNotes(account_type_name, 'maltainvest')}</Text>
                </div>
            )}

            {poi_poa_none && jurisdiction_selected_shortcode && jurisdiction_selected_shortcode !== 'svg' && (
                <div className={card_classname}>
                    <Text as='p'>
                        <Localize i18n_default_text='To create this account first we need your proof of identity and address.' />
                    </Text>
                </div>
            )}

            {jurisdiction_selected_shortcode &&
                jurisdiction_selected_shortcode === 'vanuatu' &&
                need_poi_for_vanuatu &&
                poa_acknowledged &&
                !poi_poa_none && (
                    <div className={card_classname}>
                        <Text as='p'>
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity.' />
                        </Text>
                    </div>
                )}
            {jurisdiction_selected_shortcode &&
                (jurisdiction_selected_shortcode === 'bvi' ||
                    jurisdiction_selected_shortcode === 'labuan' ||
                    jurisdiction_selected_shortcode === 'maltainvest') &&
                need_poi_for_bvi_labuan &&
                poa_acknowledged &&
                !poi_poa_none && (
                    <div className={card_classname}>
                        <Text as='p'>
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity.' />
                        </Text>
                    </div>
                )}
            {need_poa_submission &&
                !poa_acknowledged &&
                poi_acknowledged_for_vanuatu &&
                !poi_poa_none &&
                jurisdiction_selected_shortcode &&
                jurisdiction_selected_shortcode === 'vanuatu' && (
                    <div className={card_classname}>
                        <Text as='p'>
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of address.' />
                        </Text>
                    </div>
                )}

            {need_poa_submission &&
                !poa_acknowledged &&
                poi_acknowledged_for_bvi_labuan &&
                !poi_poa_none &&
                jurisdiction_selected_shortcode &&
                (jurisdiction_selected_shortcode === 'bvi' ||
                    jurisdiction_selected_shortcode === 'labuan' ||
                    jurisdiction_selected_shortcode === 'maltainvest') && (
                    <div className={card_classname}>
                        <Text as='p'>
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of address.' />
                        </Text>
                    </div>
                )}

            {need_poa_submission &&
                !poa_acknowledged &&
                !poi_poa_none &&
                jurisdiction_selected_shortcode &&
                jurisdiction_selected_shortcode === 'vanuatu' &&
                need_poi_for_vanuatu && (
                    <div className={card_classname}>
                        <Text as='p'>
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity and address.' />
                        </Text>
                    </div>
                )}

            {need_poa_submission &&
                !poa_acknowledged &&
                !poi_poa_none &&
                jurisdiction_selected_shortcode &&
                (jurisdiction_selected_shortcode === 'bvi' ||
                    jurisdiction_selected_shortcode === 'labuan' ||
                    jurisdiction_selected_shortcode === 'maltainvest') &&
                need_poi_for_bvi_labuan && (
                    <div className={card_classname}>
                        <Text as='p'>
                            <Localize i18n_default_text='To create this account first we need you to resubmit your proof of identity and address.' />
                        </Text>
                    </div>
                )}

            {poa_acknowledged &&
                poi_acknowledged_for_vanuatu &&
                !poa_poi_verified_for_vanuatu &&
                jurisdiction_selected_shortcode &&
                jurisdiction_selected_shortcode === 'vanuatu' && (
                    <div className={`${card_classname}--pending`}>
                        <Text as='p'>
                            <Localize i18n_default_text='You will be able to open this account once your submitted documents have been verified.' />
                        </Text>
                    </div>
                )}

            {poa_acknowledged &&
                poi_acknowledged_for_bvi_labuan &&
                !poa_poi_verified_for_labuan_bvi &&
                jurisdiction_selected_shortcode &&
                (jurisdiction_selected_shortcode === 'bvi' ||
                    jurisdiction_selected_shortcode === 'labuan' ||
                    jurisdiction_selected_shortcode === 'maltainvest') && (
                    <div className={`${card_classname}--pending`}>
                        <Text as='p'>
                            <Localize i18n_default_text='You will be able to open this account once your submitted documents have been verified.' />
                        </Text>
                    </div>
                )}
        </>
    );
};

export default connect(({ modules, client }: RootStore) => ({
    jurisdiction_selected_shortcode: modules.cfd.jurisdiction_selected_shortcode,
    account_status: client.account_status,
    is_fully_authenticated: client.is_fully_authenticated,
    account_type: modules.cfd.account_type,
}))(ModalFootNote);
