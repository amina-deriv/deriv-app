import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import IdvDocumentSubmit from '../idv-document-submit'
import { AutoHeightWrapper } from '@deriv/components';

const ProofOfIdentityForm = ({ getCurrentStep, goToPreviousStep, goToNextStep, index, onCancel, onSave, onSubmit, value }) => {
    const [poi_state, setPoiState] = React.useState('none');

    const initial_form_values = {
        ...value,
        document_type: '',
        document_number: '',
    }
    const handleCancel = (values) => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    return (
        <Formik
            initialValues={initial_form_values}
            onSubmit={actions => onSubmit(index, { poi_state }, actions.setSubmitting, goToNextStep)}
        >
            {({ handleSubmit }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef }) => (
                        <form ref={setRef} className='cfd-proof-of-identity'>
                            <div className='details-form'>
                                <input type='hidden' name='poi_state' value={poi_state} readOnly />
                                <IdvDocumentSubmit
                                    selected_country={{
                                        "identity": {
                                            "services": {
                                                "idv": {
                                                    "documents_supported": {
                                                        "national_id": {
                                                            "display_name": "National ID",
                                                            "format": "^[0-9]{13}$"
                                                        },
                                                        "national_id_no_photo": {
                                                            "display_name": "National ID no photo",
                                                            "format": "^[0-9]{13}$"
                                                        }
                                                    },
                                                    "has_visual_sample": 1,
                                                    "is_country_supported": 1
                                                },
                                                "onfido": {
                                                    "documents_supported": {
                                                        "driving_licence": {
                                                            "display_name": "Driving Licence"
                                                        },
                                                        "national_identity_card": {
                                                            "display_name": "National Identity Card"
                                                        },
                                                        "passport": {
                                                            "display_name": "Passport"
                                                        }
                                                    },
                                                    "is_country_supported": 1
                                                }
                                            }
                                        },
                                        "phone_idd": "27",
                                        "text": "South Africa",
                                        "tin_format": [
                                            "^[01239]\d{9}$"
                                        ],
                                        "value": "za"

                                    }}
                                    is_from_external={true}
                                    handleBack={handleCancel}
                                    handleViewComplete={handleSubmit}
                                    on_sign_up={true}
                                />

                            </div>
                        </form>
                    )}
                </AutoHeightWrapper>
            )
            }
        </Formik >
    );
};

ProofOfIdentityForm.propTypes = {
    form_error: PropTypes.string,
    index: PropTypes.number,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    value: PropTypes.object,
};

export default ProofOfIdentityForm;
