import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import RootStore from 'Stores/index';
import { IdvContainerWithoutRoute, populateVerificationStatus } from '@deriv/account';
import { connect } from 'Stores/connect';
import { ResidenceList, GetSettings, GetAccountStatus } from '@deriv/api-types';
import OnfidoUpload from './onfido-sdk-view.jsx';

type TVerificationModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_verification_modal_open: boolean;
    openVerificationModal: () => void;
    residence_list: ResidenceList;
    account_settings: GetSettings;
    account_status: GetAccountStatus
};



const VerificationModal = ({
    disableApp,
    enableApp,
    is_verification_modal_open,
    openVerificationModal,
    residence_list,
    account_settings,
    account_status
}: TVerificationModalProps) => {

    const handleBack = () => {
        console.log('handleBack');

    }

    const handleNext = () => {
        console.log('handleNext');
    }
    console.log(residence_list);
    console.log(account_settings);
    const [poi_state, setPOIState] = React.useState<string>('none');
    const citizenship = account_settings.citizen;
    const selected_country = residence_list.find(residence => residence.value === citizenship);

    const country_code = selected_country.value;
    const doc_obj = selected_country.identity.services.onfido.documents_supported;
    const documents_supported = Object.keys(doc_obj).map(d => doc_obj[d].display_name);


    // const verification_status = populateVerificationStatus(account_status);
    // const {
    //     idv,
    //     allow_poi_resubmission,
    //     has_attempted_idv,
    //     identity_last_attempt,
    //     identity_status,
    //     is_age_verified,
    //     is_idv_disallowed,
    //     manual,
    //     needs_poa,
    //     onfido,
    // } = verification_status;


    // const { submissions_left: idv_submissions_left } = idv;
    // const { submissions_left: onfido_submissions_left } = onfido;
    const is_idv_supported = selected_country.identity.services.idv.is_country_supported;
    const is_onfido_supported = selected_country.identity.services.onfido.is_country_supported;

    const SupportedService = () => {
        // if (is_idv_supported && Number(idv_submissions_left) > 0 && !is_idv_disallowed) {
        return (
            <IdvContainerWithoutRoute
                residence_list={residence_list}
                citizen={citizenship}
                // value={value}
                onNext={handleNext}
            />
        )
        // } else if (onfido_submissions_left && is_onfido_supported) {
        //     return (
        //         <OnfidoUpload
        //             country_code={country_code}
        //             documents_supported={documents_supported}
        //             handleViewComplete={handleViewComplete}
        //             height={height}
        //             is_from_external={is_from_external}
        //             refreshNotifications={refreshNotifications}
        //         />
        //     )
        // }
        //     else {
        // return (<></>)
    }

    return (
        <React.Suspense fallback={<UILoader />}>
            <Modal
                className='cfd-verification-modal'
                disableApp={disableApp}
                enableApp={enableApp}
                is_open={is_verification_modal_open}
                title={localize('Submit your proof of identity and address')}
                toggleModal={openVerificationModal}
                height='640px'
                width='996px'
            >
                <SupportedService />
            </Modal>
        </React.Suspense>
    )
}








export default connect(({ modules, ui, client }: RootStore) => ({
    // account_type: modules.cfd.account_type,
    // authentication_status: client.authentication_status,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_verification_modal_open: modules.cfd.is_verification_modal_open,
    openVerificationModal: modules.cfd.openVerificationModal,
    residence_list: client.residence_list,
    account_settings: client.account_settings,
    account_status: client.account_status,

}))(VerificationModal);