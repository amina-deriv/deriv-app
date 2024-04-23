import { useKycAuthStatus, useSettings } from '@deriv/api-v2';
import { CurrencyConstants } from '@deriv-com/utils';

export type TSupportedDocuments = Exclude<
    Exclude<ReturnType<typeof useKycAuthStatus>['kyc_auth_status'], undefined>['identity']['supported_documents'],
    undefined
>['idv'];

export type TSupportedPOIServices = Exclude<
    ReturnType<typeof useKycAuthStatus>['kyc_auth_status'],
    undefined
>['identity']['service'];

export type TPOIStatus = Exclude<
    ReturnType<typeof useKycAuthStatus>['kyc_auth_status'],
    undefined
>['identity']['status'];

export type TGetSettingsResponse = ReturnType<typeof useSettings>['data'];

export type TCurrency = CurrencyConstants.Currency;
