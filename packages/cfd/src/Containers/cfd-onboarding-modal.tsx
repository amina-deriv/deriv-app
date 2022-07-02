import React from 'react';
import { FormProgress, DesktopWrapper, MobileWrapper, Div100vhContainer } from '@deriv/components';
import { getPropertyValue, isDesktop, WS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import CFDPOA from '../Components/cfd-poa';
import CFDPOI from '../Components/cfd-poi';
import { LandingCompany, ResidenceList, GetSettings, StatesList, GetAccountStatus } from '@deriv/api-types';
import RootStore from 'Stores/index';
import { IdvOnfidoSelector } from '@deriv/account';

type TAuthenticationStatus = { document_status: string; identity_status: string };

type TStoreProofOfAddressArgs = {
    file_uploader_ref: HTMLDivElement | null;
    values: { [key: string]: string };
};

type TRemoveNotificationMessage = {
    key: string;
    should_show_again: boolean;
};

type TIndexLookupObject = {
    CFDPOI: number;
    CFDPOA: number;
};

type TGetSettings = GetSettings & {
    upload_file?: string;
    poi_state?: string;
};

type TCFDFinancialStpRealAccountSignupProps = {
    addNotificationByKey: (key: string) => void;
    authentication_status: () => TAuthenticationStatus;
    get_settings: TGetSettings;
    client_email: string;
    is_fully_authenticated: boolean;
    landing_company: LandingCompany;
    openPendingDialog: () => void;
    refreshNotifications: () => void;
    removeNotificationMessage: () => void;
    removeNotificationByKey: (args: TRemoveNotificationMessage) => void;
    residence_list: ResidenceList;
    states_list: StatesList;
    storeProofOfAddress: TStoreProofOfAddressArgs;
    toggleModal: () => void;
    account_settings: GetSettings;
    account_status: GetAccountStatus;
    residence: string;
};

type TSetSubmiting = (isSubmitting: boolean) => void;

type TNextStep = (submitting: TSetSubmiting) => void;

type TItemsState = {
    header: { [key: string]: string };
    body: typeof CFDPOI | typeof CFDPOA;
    form_value: { [key: string]: string | undefined };
    props: Array<TItemsProps>;
};

type TItemsProps =
    | 'residence_list'
    | 'is_fully_authenticated'
    | 'landing_company'
    | 'addNotificationByKey'
    | 'authentication_status'
    | 'refreshNotifications'
    | 'removeNotificationMessage'
    | 'removeNotificationByKey'
    | 'states_list'
    | 'get_settings'
    | 'storeProofOfAddress'
    | 'account_settings'
    | 'account_status'
    | 'residence';

type TgetCurrentProps = 'header' | 'body' | 'props' | 'form_value';
const index_lookup: TIndexLookupObject = {
    CFDPOI: 1,
};

const CFDOnBoardingModal = (props: TCFDFinancialStpRealAccountSignupProps) => {
    const { refreshNotifications } = props;
    const [step, setStep] = React.useState<number>(0);
    const [form_error, setFormError] = React.useState<string>('');
    const [is_loading, setIsLoading] = React.useState<boolean>(false);
    const [items, setItems] = React.useState<TItemsState[]>([

        {
            header: {
                active_title: localize('Complete your proof of identity'),
                title: localize('Proof of identity'),
            },
            body: IdvOnfidoSelector,
            form_value: {
                poi_state: 'unknown',
            },
            props: [
                'residence_list',
                'account_settings',
                'account_status',
                'authentication_status',
                'refreshNotifications',
                'residence'
            ],
        }]);




    // React.useEffect(() => {
    //     const identity = props.account_status.authentication?.identity;
    //     if (identity?.status !== 'verified' && identity?.services?.idv?.status !== 'verified') {
    //         setItems([{
    //             header: {
    //                 active_title: localize('Complete your proof of identity'),
    //                 title: localize('Proof of identity'),
    //             },
    //             body: IdvOnfidoSelector,
    //             form_value: {
    //                 poi_state: 'unknown',
    //             },
    //             props: [
    //                 'residence_list',
    //                 'account_settings',
    //                 'account_status',
    //                 'authentication_status',
    //                 'refreshNotifications',
    //                 'residence'
    //             ],
    //         }])
    //     }
    // }, [])


    const state_index = step;

    const clearError = () => {
        setFormError('');
    };

    const nextStep: TNextStep = () => {
        clearError();
        if (step + 1 < items.length) {
            setStep(step + 1);
        } else {
            props.openPendingDialog();
            props.toggleModal();
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        setFormError('');
    };
    const updateValue = async (
        index: number,
        value: { [key: string]: string | undefined },
        setSubmitting: TSetSubmiting,
        is_dirty = true
    ) => {
        if (index === 0) await WS.triggerMt5DryRun({ email: props.client_email });
        saveFormData(index, value);
        nextStep(setSubmitting);
    };



    React.useEffect(() => {
        refreshNotifications();
    }, [items, refreshNotifications]);



    const getCurrent = (key?: TgetCurrentProps) => {
        return key ? items[state_index][key] : items[state_index];
    };

    const saveFormData = (index: number, value: { [key: string]: string | undefined }) => {
        const cloned_items: Array<TItemsState> = Object.assign([], items);
        cloned_items[index].form_value = value;
        setItems(cloned_items);
    };
    const BodyComponent = getCurrent('body') as TItemsState['body'];
    const form_value = getCurrent('form_value');

    const passthrough = ((getCurrent('props') || []) as TItemsState['props']).reduce((arr, item) => {
        return Object.assign(arr, { [item]: props[item as keyof TCFDFinancialStpRealAccountSignupProps] });
    }, {});

    return (
        <BodyComponent
            value={form_value}
            index={state_index}
            onSubmit={updateValue}
            height={'90%'}
            is_loading={is_loading}
            onCancel={prevStep}
            onSave={saveFormData}
            form_error={form_error}
            {...passthrough}
        />
    )
}


export default connect(({ client, ui, modules: { cfd }, notifications }: RootStore) => ({
    addNotificationByKey: notifications.addNotificationMessageByKey,
    authentication_status: client.authentication_status,
    get_settings: client.account_settings,
    client_email: client.email,
    is_fully_authenticated: client.is_fully_authenticated,
    landing_company: client.landing_company,
    openPendingDialog: cfd.openPendingDialog,
    refreshNotifications: notifications.refreshNotifications,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotificationByKey: notifications.removeNotificationByKey,
    residence_list: client.residence_list,
    states_list: client.states_list,
    storeProofOfAddress: cfd.storeProofOfAddress,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_cfd_verification_modal_visible: cfd.is_cfd_verification_modal_visible,
    toggleCFDVerificationModal: cfd.toggleCFDVerificationModal,
    account_settings: client.account_settings,
    account_status: client.account_status,
    residence: client.residence,
}))(CFDOnBoardingModal);
