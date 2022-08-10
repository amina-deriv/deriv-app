import React from 'react';
import classNames from 'classnames';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import { Dialog, Button } from '@deriv/components';
import { TOpenAccountTransferMeta } from '../Components/props.types';
import { localize } from '@deriv/translations';
import { getIdentityStatusInfo } from '@deriv/shared';
import CfdCheckBoxForAccounts from '../Components/cfd-checkbox-for-accounts';
import ModalFootNote from '../Components/cfd-modal-footnote';
import { GetAccountStatus } from '@deriv/api-types';

type TCFDTncModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_cfd_tnc_modal_visible: boolean;
    toggleCFDTncModal: () => void;
    toggleCompareAccounts: () => void;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
    account_type: {
        type: string;
        category: string;
    };
    jurisdiction_selected_shortcode: string;
    account_status: GetAccountStatus;
};

const CFDTncModal = ({
    is_cfd_tnc_modal_visible,
    toggleCFDTncModal,
    toggleCompareAccounts,
    disableApp,
    enableApp,
    openPasswordModal,
    account_type,
    jurisdiction_selected_shortcode,
    account_status,
}: TCFDTncModalProps) => {
    const [is_checked, setIsChecked] = React.useState(false);

    React.useEffect(() => {
        setIsChecked(false);
    }, [is_cfd_tnc_modal_visible]);
    const handleCancel = () => {
        toggleCFDTncModal();
        toggleCompareAccounts();
    };
    const handleNext = () => {
        toggleCFDTncModal();
    };

    const ModalContentForTncModal = () => (
        <>
            <div className='cfd-tnc-dialog-content'>
                <ModalFootNote />
                <div>
                    <CfdCheckBoxForAccounts
                        is_checked={is_checked}
                        onCheck={() => setIsChecked(!is_checked)}
                        class_name='jurisdiction-checkbox'
                    />
                </div>
            </div>
            <div className='cfd-tnc-dialog-content--footer'>
                <Button text={localize('Back')} onClick={handleCancel} large secondary />
                <Button text={localize('Next')} onClick={handleNext} disabled={!isNextButtonEnabled()} large primary />
            </div>
        </>
    );
    return (
        <Dialog
            is_visible={is_cfd_tnc_modal_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_mobile_full_width={false}
            is_content_centered
            className={classNames('cfd-tnc-modal', {
                'cfd-tnc-modal--svg': jurisdiction_selected_shortcode === 'svg',
            })}
        >
            <ModalContentForTncModal />
        </Dialog>
    );
};
export default connect(({ client, ui, modules }: RootStore) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_cfd_tnc_modal_visible: modules.cfd.is_cfd_tnc_modal_visible,
    toggleCFDTncModal: modules.cfd.toggleCFDTncModal,
    toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
    account_type: modules.cfd.account_type,
    jurisdiction_selected_shortcode: modules.cfd.jurisdiction_selected_shortcode,
    account_status: client.account_status,
}))(CFDTncModal);
