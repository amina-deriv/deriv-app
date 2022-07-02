import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import RootStore from 'Stores/index';
import { IdvOnfidoSelector } from '@deriv/account';
import { connect } from 'Stores/connect';
import { ResidenceList, GetSettings, GetAccountStatus } from '@deriv/api-types';


type TVerificationModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_cfd_verification_modal_visible: boolean;
    toggleCFDVerificationModal: () => void;
    residence_list: ResidenceList;
    account_settings: GetSettings;
    account_status: GetAccountStatus;
    residence: string
    refreshNotifications: () => void;
};



const POIVerificationModal = ({
    disableApp,
    enableApp,
    is_cfd_verification_modal_visible,
    toggleCFDVerificationModal,
    residence_list,
    account_settings,
    account_status,
    residence,
    refreshNotifications,
}: TVerificationModalProps) => {



    const handleNext = () => {
        console.log('handleNext');
    }


    return (

        <IdvOnfidoSelector
            residence_list={residence_list}
            account_settings={account_settings}
            account_status={account_status}
            residence={residence}
            refreshNotifications={refreshNotifications}
        />

    )
}








export default connect(({ modules, ui, client, notifications }: RootStore) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_cfd_verification_modal_visible: modules.cfd.is_cfd_verification_modal_visible,
    toggleCFDVerificationModal: modules.cfd.toggleCFDVerificationModal,
    residence_list: client.residence_list,
    account_settings: client.account_settings,
    account_status: client.account_status,
    residence: client.residence,
    refreshNotifications: notifications.refreshNotifications,

}))(POIVerificationModal);