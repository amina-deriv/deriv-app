import React from 'react';
import { useLocation } from 'react-router-dom';
import RedirectNoticeModal from 'App/Components/Elements/Modals/RedirectNotice';
import UpgradeAccountsModal from 'App/Components/Elements/Modals/mul-cfd-upgrade-modal.jsx';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';

const AccountSignupModal = React.lazy(() =>
    import(/* webpackChunkName: "account-signup-modal" */ '../AccountSignupModal')
);
const CloseMXAccountModal = React.lazy(() =>
    import(/* webpackChunkName: "close-mx-account-modal" */ '../CloseMXAccountModal')
);
const ResetOrUnlinkPasswordModal = React.lazy(() =>
    import(/* webpackChunkName: "reset-or-unlink-password-modal" */ '../ResetOrUnlinkPasswordModal')
);
const RedirectToLoginModal = React.lazy(() =>
    import(/* webpackChunkName: "reset-password-modal" */ '../RedirectToLoginModal')
);
const SetResidenceModal = React.lazy(() =>
    import(/* webpackChunkName: "set-residence-modal"  */ '../SetResidenceModal')
);
const RealityCheckModal = React.lazy(() =>
    import(/* webpackChunkName: "reality-check-modal"  */ '../RealityCheckModal')
);
const WelcomeModal = React.lazy(() => import(/* webpackChunkName: "welcome-modal"  */ '../WelcomeModal'));

const AppModals = ({
    is_account_needed_modal_on,
    is_welcome_modal_visible,
    is_reality_check_visible,
    is_set_residence_modal_visible,
    is_close_mx_account_modal_visible,
    is_eu,
    is_logged_in,
    account_needed_modal_props: { target },
    openRealAccountSignup,
    closeAccountNeededModal,
    should_show_upgrade_modal,
}) => {
    const url_params = new URLSearchParams(useLocation().search);
    const url_action_param = url_params.get('action');
    let ComponentToLoad = null;
    switch (url_action_param) {
        case 'redirect_to_login':
            ComponentToLoad = <RedirectToLoginModal />;
            break;
        case 'reset_password':
            ComponentToLoad = <ResetOrUnlinkPasswordModal />;
            break;
        case 'signup':
            ComponentToLoad = <AccountSignupModal />;
            break;
        default:
            if (is_set_residence_modal_visible) {
                ComponentToLoad = <SetResidenceModal />;
            }
            break;
    }
    if (is_close_mx_account_modal_visible) {
        ComponentToLoad = <CloseMXAccountModal />;
    }

    if (is_welcome_modal_visible) {
        ComponentToLoad = <WelcomeModal />;
    }

    if (is_account_needed_modal_on) {
        openRealAccountSignup(target, localize('DMT5 CFDs'));
        closeAccountNeededModal();
    }

    if (is_reality_check_visible) {
        ComponentToLoad = <RealityCheckModal />;
    }

    if (should_show_upgrade_modal) {
        ComponentToLoad = <UpgradeAccountsModal />;
    }

    return (
        <>
            <RedirectNoticeModal is_logged_in={is_logged_in} is_eu={is_eu} portal_id='popup_root' />
            {ComponentToLoad ? <React.Suspense fallback={<div />}>{ComponentToLoad}</React.Suspense> : null}
        </>
    );
};

export default connect(({ client, ui }) => ({
    is_welcome_modal_visible: ui.is_welcome_modal_visible,
    is_account_needed_modal_on: ui.is_account_needed_modal_on,
    is_close_mx_account_modal_visible: ui.is_close_mx_account_modal_visible,
    is_set_residence_modal_visible: ui.is_set_residence_modal_visible,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    is_eu: client.is_eu,
    is_logged_in: client.is_logged_in,
    is_reality_check_visible: client.is_reality_check_visible,
    account_needed_modal_props: ui.account_needed_modal_props,
    openRealAccountSignup: ui.openRealAccountSignup,
    closeAccountNeededModal: ui.closeAccountNeededModal,
    should_show_upgrade_modal: ui.is_upgrade_modal_visible,
}))(AppModals);
