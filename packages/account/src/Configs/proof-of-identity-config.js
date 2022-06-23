import { localize } from '@deriv/translations';
import { generateValidationFunction, getDefaultFields } from '@deriv/shared';
import ProofOfIdentityForm from '../Components/poi/poi-form-on-signup/poi-form-on-signup.jsx';

const proof_of_identity_config = {
    poi_state: {
        supported_in: ['maltainvest', 'malta', 'svg', 'iom'],
        default_value: '',
        rules: [],
    },
};

const proofOfIdentityConfig = ({ real_account_signup_target }) => {
    return {
        header: {
            active_title: localize('Identity information'),
            title: localize('Identity information'),
        },
        body: ProofOfIdentityForm,
        form_value: getDefaultFields(real_account_signup_target, proof_of_identity_config),
        props: {
            validate: generateValidationFunction(real_account_signup_target, proof_of_identity_config),
        },
        passthrough: ['refreshNotifications'],
    };
};

export default proofOfIdentityConfig;
