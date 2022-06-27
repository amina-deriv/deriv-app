import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import IdvDocumentSubmit from '../idv-document-submit'
import { AutoHeightWrapper, Div100vhContainer } from '@deriv/components';
import { isDesktop } from '@deriv/shared';


export const ProofOfIdentityFormOnSignup = ({ getCurrentStep, goToPreviousStep, goToNextStep, index, onCancel, onSave, onSubmit, value, residence_list, citizen, }) => {

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
    const citizenship = residence_list.find(residence => residence.value === citizen);
    return (
        <Formik
            initialValues={initial_form_values}
            onSubmit={actions => onSubmit(index, {}, actions.setSubmitting, goToNextStep)}
        >
            {({ handleSubmit }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef }) => (
                        <form ref={setRef} className='poi-form-on-signup'>
                            <div className='details-form'>
                                <Div100vhContainer
                                    className='poi-form-on-signup__fields'
                                    height_offset='180px'
                                    is_disabled={isDesktop()}
                                >
                                    <IdvDocumentSubmit
                                        selected_country={citizenship}
                                        is_from_external={true}
                                        handleBack={handleCancel}
                                        handleViewComplete={handleSubmit}
                                        on_signup={true}
                                    />
                                </Div100vhContainer>

                            </div>
                        </form>
                    )}
                </AutoHeightWrapper>
            )
            }
        </Formik >
    );
};

ProofOfIdentityFormOnSignup.propTypes = {
    form_error: PropTypes.string,
    index: PropTypes.number,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    value: PropTypes.object,
};


