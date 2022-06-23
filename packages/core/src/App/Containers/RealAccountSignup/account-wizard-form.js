import {
    currencySelectorConfig,
    personalDetailsConfig,
    addressDetailsConfig,
    financialDetailsConfig,
    PersonalDetails,
    termsOfUseConfig,
    TermsOfUse,
} from '@deriv/account';
import CurrencySelector from './currency-selector.jsx';
import FinancialDetails from './financial-details.jsx';
import AddressDetails from './address-details.jsx';
import { proofOfIdentityConfig } from './proof-of-identity-form';

const shouldShowFinancialDetails = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
const shouldShowPersonalAndAddressDetailsAndCurrency = ({ real_account_signup_target }) =>
    real_account_signup_target !== 'samoa';

export const getItems = props => {
    return [
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [currencySelectorConfig(props, CurrencySelector)]
            : []),
        proofOfIdentityConfig(props),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [personalDetailsConfig(props, PersonalDetails)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(props, AddressDetails)] : []),

        ...(shouldShowFinancialDetails(props) ? [financialDetailsConfig(props, FinancialDetails)] : []),
        termsOfUseConfig(props, TermsOfUse),
    ];
};
