
import React from 'react';
import IdvContainerWithoutRoute from '../poi-form-on-signup/idv-doc'
import { populateVerificationStatus } from '../../../Sections/Verification/Helpers/verification';
import OnfidoUpload from '../../../Sections/Verification/ProofOfIdentity/onfido-sdk-view.jsx';
import { Button, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Formik } from 'formik';


const IdvOnfidoSelector = ({
    residence_list,
    account_settings,
    account_status,
    residence,
    refreshNotifications,
}) => {


    const SupportedProvider = () => {
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

            // const handleIdvSubmit = (values) => {
            //     // const { document_number, document_type } = values
            //     // if (document_number && document_type) {
            //     //     const submit_data = {
            //     //         identity_verification_document_add: 1,
            //     //         document_number,
            //     //         document_type: document_type.id,
            //     //         issuing_country: citizen,
            //     //     };
            //     //     console.log(submit_data);

            //     // WS.send(submit_data).then(response => {
            //     //     setSubmitting(false);
            //     //     if (response.error) {
            //     //         setStatus(response.error);
            //     //         return;
            //     //     }
            //     // });
            //     console.log(values);
            // }



            // }
            const [is_onfido_next_button_disabled, setOnfidoNextButtonDisabled] = React.useState(true);
            const handleNext = () => {
                // setOnfidoNextButtonDisabled(false)
                // setPOIState('status')
                console.log('next');
            }

            if (is_idv_supported && Number(idv_submissions_left) > 0 && !is_idv_disallowed) {
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
                    <>
                        <OnfidoUpload
                            country_code={citizen}
                            documents_supported={documents_supported}
                            handleViewComplete={handleNext}
                            height={560}
                            is_from_external={true}
                            refreshNotifications={refreshNotifications}
                        />
                        <Modal.Footer has_separator is_bypassed={isMobile()}>
                            <Button
                                className='proof-of-identity__submit-button'
                                type='submit'
                                onClick={handleNext}
                                has_effect
                                is_disabled={is_onfido_next_button_disabled}
                                text={localize('Next')}
                                large
                                primary
                            />
                        </Modal.Footer>
                    </>
                )
            }
            else {
                return (<></>)
            }
        } else {
            return null
        }
    }



    // const identity_status = account_status?.authentication?.identity;
    // const [poi_state, setPOIState] = React.useState('none');
    // const validateForm = React.useCallback(() => {
    //     const errors = {};
    //     if (!['pending'].includes(poi_state) || !['pending', 'verified'].includes(identity_status)) {
    //         errors.poi_state = true;
    //     }
    //     return errors;
    // }, [poi_state, identity_status]);

    return (
        // <Formik
        //     initialValues={{
        //         poi_state: value.poi_state,
        //     }}
        //     validate={validateForm}
        //     onSubmit={(_values, actions) =>
        //         onSubmit(index, { poi_state }, actions.setSubmitting)
        //     }
        // >
        <SupportedProvider></SupportedProvider>
        // </Formik>
    )
}
export default IdvOnfidoSelector;



