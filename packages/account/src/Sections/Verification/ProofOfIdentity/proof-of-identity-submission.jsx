/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { WS } from '@deriv/shared';
import CountrySelector from 'Components/poi/poi-country-selector';
import IdvDocumentSubmit from 'Components/poi/idv-document-submit';
import IdvUploadComplete from 'Components/poi/idv-status/idv-submit-complete';
import Unsupported from 'Components/poi/status/unsupported';
import UploadComplete from 'Components/poi/status/upload-complete';
import OnfidoUpload from './onfido-sdk-view.jsx';
import { identity_status_codes, submission_status_code, service_code } from './proof-of-identity-utils';

const POISubmission = ({
    allow_poi_resubmission,
    has_attempted_idv,
    has_require_submission,
    height,
    identity_last_attempt,
    idv,
    is_from_external,
    is_idv_disallowed,
    needs_poa,
    onfido,
    onStateChange,
    redirect_button,
    refreshNotifications,
    residence_list,
    citizen_data
}) => {
    console.log('amina');
    const [submission_status, setSubmissionStatus] = React.useState(); // selecting, submitting, complete
    const [submission_service, setSubmissionService] = React.useState();

    // const handleSelectionNext = () => {
    React.useEffect(() => {
        console.log(citizen_data);
        if (citizen_data) {
            const { submissions_left: idv_submissions_left } = idv;
            const { submissions_left: onfido_submissions_left } = onfido;
            const is_idv_supported = citizen_data.identity.services.idv.is_country_supported;
            const is_onfido_supported = citizen_data.identity.services.onfido.is_country_supported;
            console.log(idv_submissions_left, onfido_submissions_left, is_idv_supported, is_idv_supported, is_onfido_supported);
            if (is_idv_supported && Number(idv_submissions_left) > 0 && !is_idv_supported) {
                setSubmissionService(service_code.idv);
            } else if (onfido_submissions_left && is_onfido_supported) {
                setSubmissionService(service_code.onfido);
            } else {
                setSubmissionService(service_code.manual);
            }
            setSubmissionStatus(submission_status_code.submitting);
        }
    }, [citizen_data])

    // };

    const handleViewComplete = () => {
        if (onStateChange && typeof onStateChange === 'function') {
            onStateChange(identity_status_codes.pending);
        }
        setSubmissionStatus(submission_status_code.complete);

        WS.authorized.getAccountStatus().then(() => {
            refreshNotifications();
        });
    };

    const handleBack = () => setSubmissionStatus(submission_status_code.selecting);

    const getCountryFromResidence = React.useCallback(
        country_code => residence_list.find(residence => residence.value === country_code),
        [residence_list]
    );

    React.useEffect(() => {

        if (submission_status !== submission_status_code.complete) {
            console.log(has_require_submission, allow_poi_resubmission, identity_last_attempt);
            if ((has_require_submission || allow_poi_resubmission) && identity_last_attempt) {
                if (identity_last_attempt.service === service_code.idv && Number(idv.submissions_left) > 0) {
                    setSubmissionService(service_code.idv);
                }
                else if (Number(onfido.submissions_left) > 0) {
                    setSubmissionService(service_code.onfido);
                }
                else {
                    setSubmissionService(service_code.manual);
                }


            }
        }
    }, [
        allow_poi_resubmission,
        getCountryFromResidence,
        has_require_submission,
        identity_last_attempt,
        idv.submissions_left,
        onfido.submissions_left,
    ]);


    //     //         case service_code.idv: {
    //     //             if (Number(idv.submissions_left) > 0 || Number(onfido.submissions_left) > 0) {
    //     //                 setSubmissionStatus(submission_status_code.selecting);
    //     //             } else {
    //     //                 setSubmissionService(service_code.manual);
    //     //                 setSubmissionStatus(submission_status_code.submitting);
    //     //             }
    //     //             break;
    //     //         }
    //     //         case service_code.onfido: {
    //     //             if (Number(onfido.submissions_left) > 0) {
    //     //                 setSubmissionStatus(submission_status_code.selecting);
    //     //             } else {
    //     //                 setSubmissionService(service_code.manual);
    //     //                 setSubmissionStatus(submission_status_code.submitting);
    //     //             }
    //     //             break;
    //     //         }
    //     //         case service_code.manual: {
    //     //             setSelectedCountry(getCountryFromResidence(identity_last_attempt.country_code));
    //     //             setSubmissionStatus(submission_status_code.submitting);
    //     //             setSubmissionService(service_code.manual);
    //     //             break;
    //     //         }
    //     //         default:
    //     //             break;
    //     //     }
    //     // } else {
    //     //     setSubmissionStatus(submission_status_code.selecting);
    //     // }
    // }
    //     }, [
    //     allow_poi_resubmission,
    //     getCountryFromResidence,
    //     has_require_submission,
    //     identity_last_attempt,
    //     idv.submissions_left,
    //     onfido.submissions_left,
    // ]);

    // switch (submission_status) {
    // case submission_status_code.submitting: {
    console.log(submission_service);
    switch (submission_service) {
        case service_code.idv:
            return (
                <IdvDocumentSubmit
                    handleViewComplete={handleViewComplete}
                    handleBack={handleBack}
                    selected_country={citizen_data}
                />


                // <div>{citizen_data}</div>
            );
        case service_code.onfido: {
            const doc_obj = citizen_data.identity.services.onfido.documents_supported;
            const documents_supported = Object.keys(doc_obj).map(d => doc_obj[d].display_name);

            return (
                <OnfidoUpload
                    country_code={citizen_data.value}
                    documents_supported={documents_supported}
                    handleViewComplete={handleViewComplete}
                    height={height}
                    is_from_external={is_from_external}
                    refreshNotifications={refreshNotifications}
                />
            );
        }
        case service_code.manual:
            return <Unsupported />;
        default:
            return null;
    }
    // }
    // case submission_status_code.complete: {
    //     switch (submission_service) {
    //         case service_code.idv:
    //             return (
    //                 <IdvUploadComplete
    //                     is_from_external={is_from_external}
    //                     needs_poa={needs_poa}
    //                     redirect_button={redirect_button}
    //                 />
    //             );
    //         // This will be replaced in the next Manual Upload Project
    //         case service_code.manual:
    //         case service_code.onfido:
    //             return (
    //                 <UploadComplete
    //                     is_from_external={is_from_external}
    //                     needs_poa={needs_poa}
    //                     redirect_button={redirect_button}
    //                 />
    //             );
    //         default:
    //             return null;
    //     }
    // }
    // default:
    //     return null;
    // }
};

export default POISubmission;
