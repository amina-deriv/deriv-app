import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { IdvDocumentSubmit } from '@deriv/account';
import { AutoHeightWrapper, FormSubmitButton } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

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
            {({ handleSubmit, errors, handleBlur, handleChange, setFieldValue, touched, isSubmitting, values }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }) => (
                        <Form ref={setRef} className='cfd-proof-of-identity' onSubmit={handleSubmit}>
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
                        </Form>
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
