import { localize } from '@deriv/translations';
import { TJurisdictionCardItems } from 'Components/props.types';

export const jurisdictionSvgContents = (): TJurisdictionCardItems => ({
    is_over_header_available: false,
    header: localize('St. Vincent & Grenadines'),
    synthetic_contents: [
        {
            key: 'assets',
            title: `${localize('Assets')}`,
            description: `${localize('Synthetics, Basket indices and Derived FX')}`,
            title_indicators: {
                type: 'displayText',
                display_text: `${localize('40+')}`,
                display_text_skin_color: 'red-darker',
            },
        },
        {
            key: 'leverage',
            title: `${localize('Leverage')}`,
            title_indicators: {
                type: 'displayText',
                display_text: `${localize('1:1000')}`,
                display_text_skin_color: 'yellow-light',
            },
        },
        {
            key: 'verifications',
            title: `${localize('Verifications')}`,
            description: `${localize(
                'You will need to submit proof of identity and address once you reach certain thresholds.'
            )}`,
        },
        {
            key: 'regulator',
            title: `${localize('Regulator/EDR')}`,
            description: `${localize('Deriv (SVG) LLC (company no. 273 LLC 2020)')}`,
        },
    ],
    financial_contents: [
        {
            key: 'assets',
            title: `${localize('Assets')}`,
            description: `${localize('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')}`,
            title_indicators: {
                type: 'displayText',
                display_text: `${localize('170+')}`,
                display_text_skin_color: 'red-light',
            },
        },
        {
            key: 'leverage',
            title: `${localize('Leverage')}`,
            title_indicators: {
                type: 'displayText',
                display_text: `${localize('1:1000')}`,
                display_text_skin_color: 'yellow-light',
            },
        },
        {
            key: 'spreadsFrom',
            title: `${localize('Spreads from')}`,
            title_indicators: {
                type: 'displayText',
                display_text: `${localize('0.6 pips')}`,
                display_text_skin_color: 'violet-dark',
            },
        },
        {
            key: 'verifications',
            title: `${localize('Verifications')}`,
            description: `${localize(
                'You will need to submit proof of identity and address once you reach certain thresholds.'
            )}`,
        },
        {
            key: 'regulator',
            title: `${localize('Regulator/EDR')}`,
            description: `${localize('Deriv (SVG) LLC (company no. 273 LLC 2020)')}`,
        },
    ],
});
