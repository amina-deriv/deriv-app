import { Formik, Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { localize, Localize } from '@deriv/translations';
import {
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    FormSubmitButton,
    Input,
    MobileWrapper,
    Modal,
    SelectNative,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { isDesktop, formatInput, isMobile } from '@deriv/shared';
import { getDocumentData, getRegex } from '../idv-document-submit/utils';
import DocumentSubmitLogo from '../../../Assets/ic-document-submit-icon.svg';
import IdvContainerWithoutRoute from './idv-doc';

export const ProofOfIdentityFormOnSignup = ({
    getCurrentStep,
    goToPreviousStep,
    goToNextStep,
    onCancel,
    onSave,
    onSubmit,
    value,
    residence_list,
    citizen,
}) => {
    const citizen_data = residence_list.find(residence => residence.value === citizen);

    const handleCancel = values => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    }

    const handleSubmit = (values, actions) => {
        values.country_code = citizen;
        onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
    }

    return (
        <IdvContainerWithoutRoute
            residence_list={residence_list}
            citizen_data={citizen_data}
            value={value}
            has_previous={true}
            onPrevious={handleCancel}
            onNext={handleSubmit}
        />
    );
};

ProofOfIdentityFormOnSignup.propTypes = {
    form_error: PropTypes.string,
    index: PropTypes.number,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    value: PropTypes.object,
    getCurrentStep: PropTypes.func,
    goToPreviousStep: PropTypes.func,
    goToNextStep: PropTypes.func,
    onSave: PropTypes.func,
    residence_list: PropTypes.arrayOf(PropTypes.object),
    citizen: PropTypes.string,
};
