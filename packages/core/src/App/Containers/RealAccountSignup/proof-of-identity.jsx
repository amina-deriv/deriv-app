import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { IdvDocumentSubmit } from '@deriv/account';
import { AutoHeightWrapper, FormSubmitButton } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
// import IdvDocumentSubmit from './idv-submit-form'



const ProofOfIdentityForm = ({ form_error, getCurrentStep, goToPreviousStep, index, onCancel, onSave, onSubmit, value }) => {
    const [poi_state, setPoiState] = React.useState('none');

    const validateForm = () => {
        const errors = {};
        if (!['pending', 'verified'].includes(poi_state)) {
            errors.poi_state = true;
        }

        return errors;
    };
    const handleCancel = () => {
        const current_step = getCurrentStep() - 1;
        // onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    return (
        <Formik
            initialValues={value}
            validate={validateForm}
            onSubmit={actions => onSubmit(index, { poi_state }, actions.setSubmitting)}
        >
            {({ handleSubmit }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }) => (
                        <form ref={setRef} className='cfd-proof-of-identity' onSubmit={handleSubmit}>
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
                                                            "format": "^[0-9]{8,9}[a-zA-Z]{1}[0-9]{2}$"
                                                        }
                                                    },
                                                    "has_visual_sample": 1,
                                                    "is_country_supported": 1
                                                },
                                                "onfido": {
                                                    "documents_supported": {
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
                                        "phone_idd": "263",
                                        "text": "Zimbabwe",
                                        "value": "zw"
                                    }}
                                    is_from_external={true}

                                />
                                <FormSubmitButton
                                    has_cancel
                                    cancel_label={localize('Previous')}
                                    is_disabled={!['pending', 'verified'].includes(poi_state)}
                                    is_absolute={isMobile()}
                                    label={localize('Next')}
                                    onCancel={handleCancel}
                                    form_error={form_error}
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
