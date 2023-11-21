import { useStore } from '@deriv/stores';
import useIsAccountStatusPresent from './useIsAccountStatusPresent';

const useNeedEmailVerification = () => {
    const need_user_email_verification = useIsAccountStatusPresent('cashier_locked'); //TODO: change to correct BE status when BE is ready

    const { traders_hub } = useStore();
    const { no_CR_account, is_eu_user, is_real } = traders_hub;

    const no_real_cr_non_eu_regulator = no_CR_account && !is_eu_user && is_real;

    return need_user_email_verification && no_real_cr_non_eu_regulator;
};

export default useNeedEmailVerification;
