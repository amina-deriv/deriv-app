import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import RootStore from 'Stores/index';
import { IdvContainerWithoutRoute, populateVerificationStatus } from '@deriv/account';
import { connect } from 'Stores/connect';
import { ResidenceList, GetSettings, GetAccountStatus } from '@deriv/api-types';
// import OnfidoUpload from './onfido-sdk-view.jsx';

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



    const citizen = account_settings.citizen || residence;
    if (citizen) {
        const citizen_data = residence_list.find(residence => residence.value === citizen);
        console.log(citizen_data);

        // console.log(citizen_data);

        const doc_obj = citizen_data.identity.services.onfido.documents_supported;
        const documents_supported = Object.keys(doc_obj).map(d => doc_obj[d].display_name);


        const verification_status = populateVerificationStatus(account_status);
        const {
            idv,
            allow_poi_resubmission,
            has_attempted_idv,
            identity_last_attempt,
            identity_status,
            is_age_verified,
            is_idv_disallowed,
            manual,
            needs_poa,
            onfido,
        } = verification_status;

        const { submissions_left: idv_submissions_left } = idv;
        const { submissions_left: onfido_submissions_left } = onfido;
        const is_idv_supported = citizen_data.identity.services.idv.is_country_supported;
        const is_onfido_supported = citizen_data.identity.services.onfido.is_country_supported;
        const handleNext = () => {
            console.log('handleNext');
        }

        const SupportedService = () => {
            console.log(is_idv_disallowed);
            if (is_idv_supported && Number(idv_submissions_left) > 0 && is_idv_disallowed) {
                return (
                    <IdvContainerWithoutRoute
                        residence_list={residence_list}
                        citizen_data={citizen_data}
                        // value={value}
                        onNext={handleNext}
                    />
                )
            } else if (onfido_submissions_left && is_onfido_supported) {
                return (
                    // <OnfidoUpload
                    //     country_code={'ke'}
                    //     documents_supported={documents_supported}
                    //     handleViewComplete={handleNext}
                    //     height={200}
                    //     is_from_external={true}
                    //     refreshNotifications={refreshNotifications}
                    // />
                    <></>
                )
            }
            else {
                return (<></>)
            }
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
                    <SupportedService />
                </Modal>
            </React.Suspense>
        )
    } else {
        return <></>
    }

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