import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { CFDRealAccountDisplay } from '../cfd-real-account-display';

const mock_connect_props = {
    dxtrade_tokens: {
        demo: '',
        real: '',
    },
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => props => Component({ ...props, ...mock_connect_props }),
}));

describe('<CFDRealAccountDisplay />', () => {
    const TESTED_CASES = {
        EU: 'eu',
        NON_EU_DMT5: 'non_eu_dmt5',
        NON_EU_DXTRADE: 'non_eu_dxtrade',
    };

    let props;

    beforeEach(() => {
        props = {
            account_settings: {
                account_opening_reason: 'Income Earning',
                address_city: 'Jakarta',
                address_line_1: 'test',
                address_line_2: 'test',
                address_postcode: '11111',
                address_state: 'BA',
                allow_copiers: 0,
                citizen: 'id',
                client_tnc_status: 'Version 4.2.0 2020-08-07',
                country: 'Indonesia',
                country_code: 'id',
                date_of_birth: -178416000,
                email: 'name@domain.com',
                email_consent: 1,
                feature_flag: {
                    wallet: 0,
                },
                first_name: 'Name',
                has_secret_answer: 1,
                immutable_fields: ['residence'],
                is_authenticated_payment_agent: 0,
                last_name: 'LastName',
                non_pep_declaration: 1,
                phone: '04546575786',
                place_of_birth: null,
                preferred_language: 'EN',
                request_professional_status: 0,
                residence: 'Indonesia',
                salutation: '',
                tax_identification_number: '121241413236757',
                tax_residence: 'id',
                user_hash: '4f284ce90658a122e8d1cdafaf34564a7c4510f3fd73486029671fa62c46ccb6',
            },
            can_have_more_real_synthetic_mt5: false,
            current_list: {},
            has_cfd_account: false,
            has_cfd_account_error: false,
            has_malta_account: false,
            has_maltainvest_account: false,
            has_real_account: true,
            is_accounts_switcher_on: false,
            is_eu: false,
            is_eu_country: false, // depends on client IP address
            is_fully_authenticated: false,
            is_logged_in: true,
            is_pending_authentication: false,
            is_virtual: false,
            isAccountOfTypeDisabled: jest.fn(() => false),
            isSyntheticCardVisible: jest.fn(() => true),
            isFinancialCardVisible: jest.fn(() => true),
            landing_companies: {
                config: {
                    tax_details_required: 1,
                    tin_format: ['^\\d{15}$'],
                    tin_format_description: '999999999999999',
                },
                dxtrade_financial_company: {
                    standard: standard_company,
                },
                dxtrade_gaming_company: {
                    standard: standard_company,
                },
                financial_company: standard_company,
                gaming_company: standard_company,
                id: 'id',
                minimum_age: 18,
                mt_financial_company: {
                    financial: standard_company,
                    financial_stp: {
                        address: [
                            'Labuan Times Square',
                            'Jalan Merdeka',
                            '87000 Federal Territory of Labuan',
                            'Malaysia',
                        ],
                        changeable_fields: {},
                        country: 'Malaysia',
                        currency_config: {},
                        has_reality_check: 0,
                        legal_allowed_contract_categories: {},
                        legal_allowed_currencies: {},
                        legal_allowed_markets: {},
                        legal_default_currency: 'USD',
                        name: 'Deriv (FX) Ltd',
                        requirements: {},
                        shortcode: 'labuan',
                        support_professional_client: 0,
                    },
                },
                mt_gaming_company: {
                    financial: standard_company,
                },
                name: 'Indonesia',
                virtual_company: 'virtual',
            },
            onSelectAccount: jest.fn(),
            openDerivRealAccountNeededModal: jest.fn(),
            openAccountTransfer: jest.fn(),
            openPasswordManager: jest.fn(),
            openPasswordModal: jest.fn(),
            platform: 'mt5',
            residence: 'id',
            residence_list: [
                {
                    identity: {},
                    phone_idd: '62',
                    text: 'Indonesia',
                    tin_format: ['^\\d{15}$'],
                    value: 'id',
                },
                {
                    identity: {},
                    phone_idd: '35818',
                    text: 'Aland Islands',
                    value: 'ax',
                },
            ],
            should_enable_add_button: false,
            standpoint: {
                financial_company: 'svg',
                gaming_company: 'svg',
                iom: false,
                malta: false,
                maltainvest: false,
                svg: true,
            },
            toggleAccountsDialog: jest.fn(),
            toggleShouldShowRealAccountsList: jest.fn(),
        };
    });

    const account_settings_eu = {
        account_opening_reason: 'Income Earning',
        address_city: 'warsaw',
        address_line_1: 'test',
        address_line_2: 'test',
        address_postcode: '3243233',
        address_state: 'MZ',
        allow_copiers: 0,
        citizen: 'pl',
        client_tnc_status: 'Version 4.2.0 2020-08-07',
        country: 'Poland',
        country_code: 'pl',
        date_of_birth: 137894400,
        email: 'name@domain.com',
        email_consent: 1,
        feature_flag: {
            wallet: 0,
        },
        first_name: 'Name',
        has_secret_answer: 1,
        immutable_fields: [
            'account_opening_reason',
            'citizen',
            'date_of_birth',
            'first_name',
            'last_name',
            'place_of_birth',
            'residence',
            'salutation',
        ],
        is_authenticated_payment_agent: 0,
        last_name: 'LastName',
        non_pep_declaration: 1,
        phone: '+48354334543434',
        place_of_birth: 'pl',
        preferred_language: 'EN',
        request_professional_status: 0,
        residence: 'Poland',
        salutation: 'Ms',
        tax_identification_number: '3432324232',
        tax_residence: 'pl',
        user_hash: 'f8029d070387e67bdfbc3857021382905b1513a42386c7278fd352852e11f06f',
    };

    const standard_company = {
        address: null,
        changeable_fields: {},
        country: 'Saint Vincent and the Grenadines',
        currency_config: {},
        has_reality_check: 0,
        legal_allowed_contract_categories: {},
        legal_allowed_currencies: {},
        legal_allowed_markets: {},
        legal_default_currency: 'USD',
        name: 'Deriv (SVG) LLC',
        requirements: {},
        shortcode: 'svg',
        support_professional_client: 0,
    };

    const mt5_real_synthetic_account = {
        account_type: 'real',
        balance: 0,
        country: 'id',
        currency: 'USD',
        display_balance: '0.00',
        display_login: '41165492',
        email: 'name@domain.com',
        group: 'real\\p01_ts03\\synthetic\\svg_std_usd\\03',
        landing_company_short: 'svg',
        leverage: 500,
        login: 'MTR41165492',
        market_type: 'synthetic',
        name: 'Name LastName',
        server: 'p01_ts03',
        server_info: {
            environment: 'Deriv-Server',
            geolocation: {
                group: 'asia_synthetic',
                location: 'Singapore',
                region: 'Asia',
                sequence: 1,
            },
            id: 'p01_ts03',
        },
        sub_account_type: 'financial',
    };

    const mt5_real_financial_account = {
        account_type: 'real',
        balance: 0,
        country: 'id',
        currency: 'USD',
        display_balance: '0.00',
        display_login: '1927245',
        email: 'name@domain.com',
        group: 'real\\p01_ts01\\financial\\svg_std-hr_usd',
        landing_company_short: 'svg',
        leverage: 1000,
        login: 'MTR1927245',
        market_type: 'financial',
        name: 'Name LastName',
        server: 'p01_ts01',
        server_info: {
            environment: 'Deriv-Server',
            geolocation: {
                group: 'all',
                location: 'Ireland',
                region: 'Europe',
                sequence: 1,
            },
            id: 'p01_ts01',
        },
        sub_account_type: 'financial',
    };

    const dxtrade_real_synthetic_account = {
        account_id: 'DXR1095',
        account_type: 'real',
        balance: 0,
        currency: 'USD',
        display_balance: '0.00',
        display_login: 'DXR1095',
        enabled: 1,
        landing_company_short: 'svg',
        login: '374',
        market_type: 'synthetic',
        platform: 'dxtrade',
    };

    const checkAccountCardsRendering = tested_case => {
        const first_account_card = 'Synthetic';
        const second_account_card = {
            eu: 'CFDs',
            non_eu: 'Financial',
        };

        expect(screen.getByTestId('dt_cfd_real_accounts_display')).toBeInTheDocument();

        if (tested_case === TESTED_CASES.NON_EU_DMT5 || tested_case === TESTED_CASES.NON_EU_DXTRADE) {
            expect(screen.getByText(first_account_card)).toBeInTheDocument();
            expect(screen.getByText(second_account_card.non_eu)).toBeInTheDocument();
        } else if (tested_case === TESTED_CASES.EU) {
            expect(screen.queryByText(first_account_card)).not.toBeInTheDocument();
            expect(screen.getByText(second_account_card.eu)).toBeInTheDocument();
            expect(screen.queryByText(second_account_card.non_eu)).not.toBeInTheDocument();
        }
    };

    it('should render Synthetic & Financial cards with enabled buttons on DMT5 when is_logged_in=true & is_eu=false', () => {
        render(<CFDRealAccountDisplay {...props} />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        const add_real_account_buttons = screen.getAllByRole('button', { name: /add real account/i });
        expect(add_real_account_buttons.length).toBe(2);

        fireEvent.click(add_real_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'synthetic', category: 'real', platform: 'mt5' });

        fireEvent.click(add_real_account_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial', category: 'real', platform: 'mt5' });
    });

    it('should render Synthetic & Financial cards without "Add real account" buttons on DMT5 when is_logged_in=false & is_eu_country=false', () => {
        render(<CFDRealAccountDisplay {...props} is_logged_in={false} />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        expect(screen.queryAllByRole('button', { name: /add real account/i }).length).toBe(0);
    });

    it('should render a CFDs card only with enabled "Add real account" button on DMT5 when is_logged_in=true, should_enable_add_button=true & is_eu=true', () => {
        props.isSyntheticCardVisible = jest.fn(() => false);
        render(
            <CFDRealAccountDisplay {...props} is_eu should_enable_add_button account_settings={account_settings_eu} />
        );

        checkAccountCardsRendering(TESTED_CASES.EU);
        const add_real_account_button = screen.getByRole('button', { name: /add real account/i });
        expect(add_real_account_button).toBeEnabled();

        fireEvent.click(add_real_account_button);
        expect(props.openDerivRealAccountNeededModal).toHaveBeenCalledTimes(1);
    });

    it('should render a CFDs card only without "Add real account" button on DMT5 when is_logged_in=false & is_eu_country=true (also when redirected from Deriv X platform)', () => {
        props.isSyntheticCardVisible = jest.fn(() => false);
        render(<CFDRealAccountDisplay {...props} is_logged_in={false} is_eu_country />);

        checkAccountCardsRendering(TESTED_CASES.EU);
        expect(screen.queryAllByRole('button', { name: /add real account/i }).length).toBe(0);
    });

    it('should render Synthetic & Financial cards with enabled buttons on Deriv X when is_logged_in=true & is_eu=false', () => {
        render(<CFDRealAccountDisplay {...props} platform='dxtrade' />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DXTRADE);
        const add_real_account_buttons = screen.getAllByRole('button', { name: /add real account/i });
        expect(add_real_account_buttons.length).toBe(2);

        fireEvent.click(add_real_account_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({
            type: 'synthetic',
            category: 'real',
            platform: 'dxtrade',
        });

        fireEvent.click(add_real_account_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({
            type: 'financial',
            category: 'real',
            platform: 'dxtrade',
        });
    });

    it('should render Synthetic & Financial cards without "Add real account" buttons on Deriv X when is_logged_in=false & is_eu_country=false', () => {
        render(<CFDRealAccountDisplay {...props} is_logged_in={false} platform='dxtrade' />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DXTRADE);
        expect(screen.queryAllByRole('button', { name: /add real account/i }).length).toBe(0);
    });

    it('should render 1 open account with an enabled "Top up" ("Fund transfer" in Deriv X) & "Trade on web terminal" buttons', () => {
        props.current_list['mt5.real.financial@p01_ts01'] = mt5_real_financial_account;
        const { rerender } = render(<CFDRealAccountDisplay {...props} has_real_account={true} />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        expect(screen.getAllByRole('button', { name: /add real account/i }).length).toBe(1);
        const dmt5_top_up_button = screen.getByRole('button', { name: /top up/i });
        const dmt5_trade_button = screen.getByRole('link', { name: /trade on web terminal/i });
        expect(dmt5_trade_button).toHaveAttribute(
            'href',
            'https://trade.mql5.com/trade?servers=Deriv-Server&trade_server=Deriv-Server&login=1927245'
        );

        fireEvent.click(dmt5_top_up_button);
        expect(props.openAccountTransfer).toHaveBeenCalledWith(props.current_list['mt5.real.financial@p01_ts01'], {
            category: 'real',
            type: 'financial',
        });

        rerender(
            <CFDRealAccountDisplay
                {...props}
                platform='dxtrade'
                current_list={{
                    'dxtrade.real.synthetic@synthetic': dxtrade_real_synthetic_account,
                }}
            />
        );
        checkAccountCardsRendering(TESTED_CASES.NON_EU_DXTRADE);
        const dxtrade_fund_transfer_button = screen.getByRole('button', { name: /fund transfer/i });
        const dxtrade_trade_button = screen.getByRole('link', { name: /trade/i });
        expect(dxtrade_trade_button).toHaveAttribute('href', 'https://dx.deriv.com');

        fireEvent.click(dxtrade_fund_transfer_button);
        expect(props.openAccountTransfer).toHaveBeenCalledTimes(2);
    });

    it('should show "Switch to your real account", which opens Account Switcher, on Deriv X cards when has_real_account=true & is_virtual=true', () => {
        render(<CFDRealAccountDisplay {...props} is_virtual platform='dxtrade' />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        expect(screen.queryAllByRole('button', { name: /add real account/i }).length).toBe(0);
        const switch_to_real_account_links = screen.getAllByText('Switch to your real account');
        expect(switch_to_real_account_links.length).toBe(2);

        fireEvent.click(switch_to_real_account_links[0]);
        expect(props.toggleShouldShowRealAccountsList).toHaveBeenCalledWith(true);
        expect(props.toggleAccountsDialog).toHaveBeenCalledWith(true);
    });

    it('should disable all "Add real account" buttons when has_cfd_account_error=true', () => {
        render(<CFDRealAccountDisplay {...props} has_cfd_account_error />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        const add_real_account_buttons = screen.getAllByRole('button', { name: /add real account/i });
        expect(add_real_account_buttons[0]).toBeDisabled();
        expect(add_real_account_buttons[1]).toBeDisabled();
    });

    it('should show "+ Add account" under Synthetic card with an open real account when can_have_more_real_synthetic_mt5=true', () => {
        props.current_list['mt5.real.synthetic@p01_ts03'] = mt5_real_synthetic_account;
        render(<CFDRealAccountDisplay {...props} can_have_more_real_synthetic_mt5 />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        const add_real_account_buttons = screen.getAllByRole('button', { name: /add real account/i });
        expect(add_real_account_buttons.length).toBe(1);
        expect(screen.getByText('+')).toBeInTheDocument();
        const add_region_button = screen.getByText(/add account/i);

        fireEvent.click(add_region_button);
        expect(props.onSelectAccount).toHaveBeenCalledTimes(1);
    });

    it('should render enabled "Select" buttons instead of "Add real account" buttons when has_cfd_account=true', () => {
        render(<CFDRealAccountDisplay {...props} has_cfd_account />);

        checkAccountCardsRendering(TESTED_CASES.NON_EU_DMT5);
        expect(screen.queryAllByRole('button', { name: /add real account/i }).length).toBe(0);

        const select_buttons = screen.getAllByText(/select/i);

        fireEvent.click(select_buttons[0]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'synthetic', category: 'real', platform: 'mt5' });

        fireEvent.click(select_buttons[1]);
        expect(props.onSelectAccount).toHaveBeenCalledWith({ type: 'financial', category: 'real', platform: 'mt5' });
    });
});
