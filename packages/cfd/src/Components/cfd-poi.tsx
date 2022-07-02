import { ProofOfIdentityContainer } from '@deriv/account';
import { GetAccountStatus, GetSettings, ResidenceList } from '@deriv/api-types';
import { AutoHeightWrapper, Div100vhContainer, FormSubmitButton, Modal, Button } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Formik, FormikHelpers as FormikActions } from 'formik';
import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';

type TCFDAuthenticationStatusProps = {
    document_status: string;
    identity_status: string;
};
type TCFDValue = {
    poi_state: string;
};
type TErrors = {
    poi_state: boolean;
};

type TFormValues = {
    citizen?: string;
    tax_residence?: string;
    tax_identification_number?: string;
    account_opening_reason?: string;
};

type TCFDAppRoutingHistory = {
    pathname: string;
};
type TCFDNotificationByKey = {
    key: string;
};
type TCFDNotificationMessage = {
    key: string;
    should_show_again: string;
};

type TCFDPOIProps = {
    authentication_status: TCFDAuthenticationStatusProps;
    form_error?: string;
    index: number;
    onCancel: () => void;
    onSubmit: (index: number, value: TCFDValue, setSubmitting: boolean | ((isSubmitting: boolean) => void)) => void;
    value: TCFDValue;
    account_status?: GetAccountStatus;
    addNotificationByKey: (key: string) => void;
    app_routing_history: Array<TCFDAppRoutingHistory>;
    fetchResidenceList?: () => void;
    height: string;
    is_loading: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    onSave: (index: number, values: TFormValues) => void;
    refreshNotifications: () => void;
    removeNotificationByKey: (key: TCFDNotificationByKey) => void;
    removeNotificationMessage: (key: TCFDNotificationMessage) => void;
    routeBackInApp: (history: Array<string>, additional_platform_path: TCFDAppRoutingHistory) => void;
    should_allow_authentication: boolean;
    account_settings: GetSettings;
    residence_list: ResidenceList;
};

const CFDPOI = ({ authentication_status, form_error, index, onCancel, onSubmit, value, ...props }: TCFDPOIProps) => {
    const { identity_status } = authentication_status;
    const [poi_state, setPOIState] = React.useState<string>('none');
    const validateForm = React.useCallback(() => {
        const errors = {};
        if (!['pending'].includes(poi_state) || !['pending', 'verified'].includes(identity_status)) {
            (errors as TErrors).poi_state = true;
        }
        return errors;
    }, [poi_state, identity_status]);

    const is_next_btn_disabled = !(
        ['pending'].includes(poi_state) || ['pending', 'verified'].includes(identity_status)
    );

    const citizen = props.account_settings.citizen || props.account_settings.residence;
    const citizen_data = props.residence_list.find(item => item.value === citizen);

    return (
        <Formik
            initialValues={{
                poi_state: value.poi_state,
            }}
            validate={validateForm}
            onSubmit={(_values: TFormValues, actions: FormikActions<TFormValues>) =>
                onSubmit(index, { poi_state }, actions.setSubmitting)
            }
        >
            {({ handleSubmit }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }: { setRef: (instance: HTMLFormElement | null) => void; height: number }) => (
                        <form
                            ref={setRef}
                            className='cfd-proof-of-identity'
                            onSubmit={handleSubmit}
                            data-testid='dt_cfd_proof_of_identity'
                        >
                            <div className='details-form'>
                                <input type='hidden' name='poi_state' value={poi_state} readOnly />
                                <Div100vhContainer
                                    className='cfd-proof-of-identity__fields'
                                    height_offset='180px'
                                    is_disabled={isDesktop()}
                                >
                                    <ProofOfIdentityContainer
                                        {...props}
                                        height={height}
                                        is_from_external={true}
                                        onStateChange={(status: string) => setPOIState(status)}
                                        citizen_data={citizen_data}
                                    />
                                </Div100vhContainer>
                                <Modal.Footer is_bypassed={isMobile()}>
                                    <FormSubmitButton
                                        is_disabled={is_next_btn_disabled}
                                        is_absolute={isMobile()}
                                        label={localize('Next')}
                                        form_error={form_error}
                                        onClick={() => {
                                            if (!is_next_btn_disabled) {
                                                onSubmit(index, { poi_state }, false);
                                            }
                                        }}
                                    />


                                </Modal.Footer>
                                {/* 
                                 <Modal.Footer has_separator is_bypassed={isMobile()}>
                                    <Button
                                        className='proof-of-identity__submit-button'
                                        type='submit'
                                        onClick={() => {
                                            if (!is_next_btn_disabled) {
                                                onSubmit(index, { poi_state }, false);
                                            }
                                        }}
                                        has_effect
                                        is_disabled={is_next_btn_disabled}
                                        text={localize('Next')}
                                        large
                                        primary
                                    />
                                </Modal.Footer>  */}

                            </div>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default connect(({ client, common, notifications }: RootStore) => ({
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    fetchResidenceList: client.fetchResidenceList,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: notifications.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
    account_settings: client.account_settings,
    residence_list: client.residence_list,
}))(CFDPOI);
