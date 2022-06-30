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
    is_poi_verification_modal_visible: boolean;
    togglePOIVerificationModal: () => void;
    residence_list: ResidenceList;
    account_settings: GetSettings;
    account_status: GetAccountStatus;
    residence: string
    refreshNotifications: () => void;
};



const POIVerificationModal = ({
    disableApp,
    enableApp,
    is_poi_verification_modal_visible,
    togglePOIVerificationModal,
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

        <React.Suspense fallback={<UILoader />}>
            <Modal
                className='cfd-verification-modal'
                disableApp={disableApp}
                enableApp={enableApp}
                is_open={is_poi_verification_modal_visible}
                title={localize('Submit your proof of identity and address')}
                toggleModal={togglePOIVerificationModal}
                height='620px'
                width='996px'
            >
                <IdvOnfidoSelector
                    residence_list={residence_list}
                    account_settings={account_settings}
                    account_status={account_status}
                    residence={residence}
                    refreshNotifications={refreshNotifications}
                />
            </Modal>
        </React.Suspense>
    )
}








export default connect(({ modules, ui, client, notifications }: RootStore) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_poi_verification_modal_visible: modules.cfd.is_poi_verification_modal_visible,
    togglePOIVerificationModal: modules.cfd.togglePOIVerificationModal,
    residence_list: client.residence_list,
    account_settings: client.account_settings,
    account_status: client.account_status,
    residence: client.residence,
    refreshNotifications: notifications.refreshNotifications,

}))(POIVerificationModal);