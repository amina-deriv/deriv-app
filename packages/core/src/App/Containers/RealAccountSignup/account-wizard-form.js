import {
    currencySelectorConfig,
    personalDetailsConfig,
    addressDetailsConfig,
    financialDetailsConfig,
    PersonalDetails,
    termsOfUseConfig,
    TermsOfUse,
    proofOfIdentityConfig,
} from '@deriv/account';
import CurrencySelector from './currency-selector.jsx';
import FinancialDetails from './financial-details.jsx';
import AddressDetails from './address-details.jsx';

const shouldShowFinancialDetails = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
const shouldShowPersonalAndAddressDetailsAndCurrency = ({ real_account_signup_target }) =>
    real_account_signup_target !== 'samoa';
const shouldShowIdentityInformation = ({ citizen, residence_list }) => {
    const country = residence_list.find(residence => residence.value === 'ke');
    return country.identity.services.idv.is_country_supported;
};

export const getItems = props => {
    return [
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [currencySelectorConfig(props, CurrencySelector)]
            : []),
        ...(shouldShowIdentityInformation(props) ? [proofOfIdentityConfig(props)] : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [personalDetailsConfig(props, PersonalDetails)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(props, AddressDetails)] : []),

        ...(shouldShowFinancialDetails(props) ? [financialDetailsConfig(props, FinancialDetails)] : []),
        termsOfUseConfig(props, TermsOfUse),
    ];
};
