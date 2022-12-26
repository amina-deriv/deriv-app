import React from 'react';
import classNames from 'classnames';
import { Table, Div100vhContainer, Button, Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop, WS, getAuthenticationStatusInfo, CFD_PLATFORMS } from '@deriv/shared';
import { connect } from '../Stores/connect';
import RootStore from '../Stores/index';
import {
    TDMT5CompareModalContentProps,
    TCompareAccountContentProps,
    TCompareAccountFooterButtonData,
    TCompareAccountContentValues,
    TCompareAccountInstrumentsRowProps,
} from './props.types';
import {
    eucontent,
    content,
    footer_buttons,
    eu_footer_button,
    preappstore_demo_cr_content,
    preappstore_demo_cr_footer_buttons,
} from '../Constants/cfd_compare_account_content';
import { GetSettings, GetAccountSettingsResponse } from '@deriv/api-types';

const DMT5CompareModalContent = ({
    account_settings,
    setAccountSettings,
    setAccountType,
    clearCFDError,
    current_list,
    has_real_account,
    is_logged_in,
    is_demo_tab,
    is_real_enabled,
    is_virtual,
    openDerivRealAccountNeededModal,
    openPasswordModal,
    openSwitchToRealAccountModal,
    toggleCFDVerificationModal,
    toggleCFDPersonalDetailsModal,
    toggleCompareAccounts,
    trading_platform_available_accounts,
    show_eu_related,
    setJurisdictionSelectedShortcode,
    account_status,
    upgradeable_landing_companies,
    setAppstorePlatform,
    should_show_derivx,
    should_restrict_bvi_account_creation,
    updateAccountStatus,
    real_account_creation_unlock_date,
    setShouldShowCooldownModal,
    is_eu,
}: TDMT5CompareModalContentProps) => {
    const [has_submitted_personal_details, setHasSubmittedPersonalDetails] = React.useState(false);

    const mt5_platforms = trading_platform_available_accounts.map(
        account => `${account.market_type === 'gaming' ? 'synthetic' : account.market_type}_${account.shortcode}`
    );
    console.log(mt5_platforms);

    const has_synthetic = trading_platform_available_accounts.some(account => account.market_type === 'gaming');
    const available_accounts_keys = [...mt5_platforms, ...(should_show_derivx && has_synthetic ? ['derivx'] : [])];

    const logged_out_available_accounts_count = show_eu_related ? 1 : 6;
    const available_accounts_count = is_logged_in
        ? available_accounts_keys.length
        : logged_out_available_accounts_count;
    const synthetic_accounts_count =
        !is_logged_in && !show_eu_related
            ? 2
            : available_accounts_keys.filter(key => key.startsWith('synthetic')).length;
    const financial_accounts_count =
        !is_logged_in && !show_eu_related
            ? 4
            : available_accounts_keys.filter(key => key.startsWith('financial')).length || 1;

    const is_preappstore_demo_cr_account = is_demo_tab && !is_eu && should_show_derivx;
    const {
        poi_pending_for_vanuatu,
        poi_pending_for_bvi_labuan_maltainvest,
        poi_verified_for_vanuatu,
        poi_verified_for_bvi_labuan_maltainvest,
        poi_or_poa_not_submitted,
        poi_poa_verified_for_bvi_labuan_maltainvest,
        poi_acknowledged_for_bvi_labuan_maltainvest,
        poa_acknowledged,
        poa_pending,
    } = getAuthenticationStatusInfo(account_status);

    React.useEffect(() => {
        updateAccountStatus();
        if (!has_submitted_personal_details) {
            let get_settings_response: GetSettings = {};
            if (!account_settings) {
                WS.authorized.storage.getSettings().then((response: GetAccountSettingsResponse) => {
                    get_settings_response = response.get_settings as GetSettings;
                    setAccountSettings(response.get_settings as GetSettings);
                });
            } else {
                get_settings_response = account_settings;
            }
            const { citizen, place_of_birth, tax_residence, tax_identification_number, account_opening_reason } =
                get_settings_response;
            if (citizen && place_of_birth && tax_residence && tax_identification_number && account_opening_reason) {
                setHasSubmittedPersonalDetails(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAvailableAccountsContent = (modal_content: TCompareAccountContentProps[]) => {
        if (!is_logged_in) {
            if (show_eu_related) {
                return modal_content;
            }
            const mt5_data = modal_content.map(item => {
                const { derivx, ...rest } = item.values; // eslint-disable-line @typescript-eslint/no-unused-vars
                return { ...item, values: rest };
            });
            return mt5_data;
        }
        return modal_content.map(row_data => {
            console.log(row_data, available_accounts_keys);

            const available_accounts_values = Object.entries(row_data.values).reduce(
                (acc, [key, value]) => (available_accounts_keys.includes(key) ? { ...acc, [key]: value } : acc),
                {} as TCompareAccountContentValues
            );
            console.log(available_accounts_values);

            const content_data = { ...row_data, values: {} as TCompareAccountContentValues };
            const col_num = should_show_derivx ? 7 : 6;
            if (available_accounts_keys.length < col_num && !show_eu_related) {
                // order of the values matters for data to be correctly displayed in the table
                const sorted_values = [
                    'synthetic_svg',
                    'synthetic_bvi',
                    'financial_svg',
                    'financial_bvi',
                    'financial_vanuatu',
                    'financial_labuan',
                    ...(should_show_derivx && synthetic_accounts_count > 0 ? ['derivx'] : []),
                ];
                content_data.values = sorted_values.reduce(
                    (acc, el) => (available_accounts_keys.includes(el) ? { ...acc, [el]: undefined } : acc),
                    {}
                );
                available_accounts_keys.forEach(key => {
                    if (row_data.id === 'leverage' && (key === 'financial_svg' || key === 'financial_bvi')) {
                        content_data.values[key] = row_data.values.financial_vanuatu;
                    } else if (row_data.id === 'instruments' && key === 'synthetic_bvi') {
                        content_data.values[key] = row_data.values.synthetic_svg;
                    } else if (row_data.id === 'instruments' && key === 'financial_bvi') {
                        content_data.values[key] = row_data.values.financial_svg;
                    }
                });
            }
            return { ...content_data, values: { ...content_data.values, ...available_accounts_values } };
        });
    };

    const getAvailableAccountsFooterButtons = (footer_button_data: TCompareAccountFooterButtonData[]) => {
        return footer_button_data.filter(data => available_accounts_keys.includes(data.action));
    };
    const openPersonalDetailsFormOrPasswordForm = (type_of_account: { category: string; type: string }) =>
        !has_submitted_personal_details ? toggleCFDPersonalDetailsModal(true) : openPasswordModal(type_of_account);

    const onSelectRealAccount = (item: TCompareAccountFooterButtonData) => {
        const account_type = item.action.startsWith('financial') ? 'financial' : 'synthetic';

        const type_of_account = {
            category: is_demo_tab ? 'demo' : 'real',
            type: account_type,
        };
        clearCFDError();
        setAccountType(type_of_account);

        switch (item.action) {
            case 'synthetic_svg':
            case 'financial_svg':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('svg');
                openPasswordModal(type_of_account);
                break;
            case 'synthetic_bvi':
            case 'financial_bvi':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('bvi');
                if (
                    poi_verified_for_bvi_labuan_maltainvest &&
                    !poi_or_poa_not_submitted &&
                    !should_restrict_bvi_account_creation
                ) {
                    openPersonalDetailsFormOrPasswordForm(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'financial_vanuatu':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('vanuatu');
                if (poi_verified_for_vanuatu && !poi_or_poa_not_submitted) {
                    openPersonalDetailsFormOrPasswordForm(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'financial_labuan':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('labuan');
                if (poi_poa_verified_for_bvi_labuan_maltainvest && !poi_or_poa_not_submitted) {
                    openPersonalDetailsFormOrPasswordForm(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'financial_maltainvest':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('maltainvest');
                if (poi_poa_verified_for_bvi_labuan_maltainvest && !poi_or_poa_not_submitted) {
                    openPasswordModal(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'derivx':
                setAppstorePlatform(CFD_PLATFORMS.DXTRADE);
                openPasswordModal(type_of_account);
                break;
            default:
        }
    };

    const isMt5AccountAdded = (item: TCompareAccountFooterButtonData) =>
        Object.entries(current_list).some(([key, value]) => {
            const [market, type] = item.action.split('_');
            const current_account_type = is_demo_tab ? 'demo' : 'real';
            return (
                value.market_type === market &&
                value.landing_company_short === type &&
                value.account_type === current_account_type &&
                key.includes(CFD_PLATFORMS.MT5)
            );
        });

    const isDxtradeAccountAdded = (item: TCompareAccountFooterButtonData) =>
        Object.entries(current_list).some(([key, value]) => {
            const current_account_type = is_demo_tab ? 'demo' : 'real';
            return value.account_type === current_account_type && key.includes(CFD_PLATFORMS.DXTRADE);
        });

    const onButtonClick = (item: TCompareAccountFooterButtonData) => {
        const should_show_missing_real_account =
            is_logged_in && !has_real_account && upgradeable_landing_companies?.length > 0 && is_real_enabled;
        toggleCompareAccounts();
        if (should_show_missing_real_account) {
            if (real_account_creation_unlock_date) {
                setShouldShowCooldownModal(true);
            } else {
                openDerivRealAccountNeededModal();
            }
        } else if (is_virtual && !['synthetic_svg', 'financial_svg'].includes(item.action)) {
            openSwitchToRealAccountModal();
        } else onSelectRealAccount(item);
    };

    const getModalContent = () => {
        if (is_preappstore_demo_cr_account) {
            return preappstore_demo_cr_content;
        }
        return show_eu_related ? eucontent : content;
    };

    const modal_footer = () => {
        if (is_preappstore_demo_cr_account) return preappstore_demo_cr_footer_buttons;
        return show_eu_related ? eu_footer_button : footer_buttons;
    };
    const getContentSize = (id: string) => {
        if (id === 'counterparty' || id === 'leverage') return isDesktop() ? 'xxs' : 'xxxs';
        return isDesktop() ? 'xxxs' : 'xxxxs';
    };

    const shouldShowPendingStatus = (item: TCompareAccountFooterButtonData) => {
        const type = item.action.split('_')[1];
        if (isMt5AccountAdded(item)) {
            return false;
        } else if (type === 'svg' || item.action === 'derivx') {
            return false;
        } else if (type === 'vanuatu') {
            return poi_pending_for_vanuatu && !poi_or_poa_not_submitted;
        } else if (type === 'bvi') {
            if (should_restrict_bvi_account_creation && poa_pending) return true;
            return poi_pending_for_bvi_labuan_maltainvest && !poi_or_poa_not_submitted;
        }
        return (
            poi_acknowledged_for_bvi_labuan_maltainvest &&
            poa_acknowledged &&
            !poi_poa_verified_for_bvi_labuan_maltainvest
        );
    };

    const pre_appstore_class = should_show_derivx && synthetic_accounts_count ? '__pre-appstore' : '';

    const getClassNamesForDemoAndEu = () => {
        if (is_preappstore_demo_cr_account) return 'cfd-real-compare-accounts-row-demo';
        else if (show_eu_related) return 'cfd-real-compare-accounts-row-eu';
        return null;
    };

    const InstrumentsRow = ({ attr, val }: TCompareAccountInstrumentsRowProps) => (
        <Table.Row
            className={
                getClassNamesForDemoAndEu() ??
                classNames(`cfd-real-compare-accounts__table-row--instruments${pre_appstore_class}`, {
                    [`cfd-real-compare-accounts__row-with-columns-count-${available_accounts_count + 1}`]:
                        available_accounts_count < 6,
                })
            }
        >
            <Table.Cell fixed>
                <Text as='p' weight='bold' align='center' color='prominent' size='xxs'>
                    {attr}
                </Text>
            </Table.Cell>

            {Object.keys(val).map(rowKey => (
                <Table.Cell key={rowKey} className='cfd-real-compare-accounts__table-row-item'>
                    {Array.isArray(val[rowKey]?.text) ? (
                        (val[rowKey]?.text as []).map((item, index) => (
                            <Text key={index} as='p' weight=' normal' align='center' color='prominent' size='xxxs'>
                                {item}
                            </Text>
                        ))
                    ) : (
                        <Text as='p' weight='normal' align='center' color='prominent' size='xxxs'>
                            {val[rowKey]?.text}
                        </Text>
                    )}
                </Table.Cell>
            ))}
        </Table.Row>
    );

    const Row = ({ id, attribute, values }: TCompareAccountContentProps) => {
        const is_leverage_row = id === 'leverage';
        const is_platform_row = id === 'platform';
        console.log(values);

        if (is_platform_row && !should_show_derivx) {
            return null;
        }
        if (id === 'instruments') {
            return <InstrumentsRow attr={attribute} val={values} />;
        }
        return (
            <Table.Row
                className={
                    getClassNamesForDemoAndEu() ??
                    classNames(`cfd-real-compare-accounts__table-row${pre_appstore_class}`, {
                        [`cfd-real-compare-accounts__table-row--leverage${pre_appstore_class}`]: is_leverage_row,
                        [`cfd-real-compare-accounts__row-with-columns-count-${available_accounts_count + 1}`]:
                            available_accounts_count < 6,
                        [`cfd-real-compare-accounts__table-row--platform${pre_appstore_class}`]: is_platform_row,
                    })
                }
            >
                <Table.Cell fixed>
                    <Text as='p' weight='bold' color='prominent' size='xxs'>
                        {attribute}
                    </Text>
                </Table.Cell>

                {Object.keys(values).map(item => (
                    <Table.Cell
                        key={item}
                        className={classNames('cfd-real-compare-accounts__table-row-item', {
                            'cfd-real-compare-accounts__table-row-item--tooltip': values[item]?.tooltip_msg,
                        })}
                    >
                        <>
                            <Text
                                as='p'
                                weight={id === 'jurisdiction' ? 'bold' : 'normal'}
                                align='center'
                                color='prominent'
                                size={getContentSize(id)}
                            >
                                {values[item]?.text}
                            </Text>
                            {values[item]?.tooltip_msg && (
                                <Popover
                                    alignment='left'
                                    className='cfd-compare-accounts-tooltip'
                                    classNameBubble='cfd-compare-accounts-tooltip--msg'
                                    icon='info'
                                    disable_message_icon
                                    is_bubble_hover_enabled
                                    message={values[item]?.tooltip_msg}
                                    zIndex={9999}
                                />
                            )}
                        </>
                    </Table.Cell>
                ))}
            </Table.Row>
        );
    };

    return (
        <Div100vhContainer height_offset='40px' is_bypassed={isDesktop()} className='cfd-real-compare-accounts'>
            <div className='cfd-real-compare-accounts'>
                <div className='cfd-real-compare-accounts__table-wrapper'>
                    <Table className='cfd-real-compare-accounts__table'>
                        <Table.Header>
                            <Table.Row
                                className={
                                    getClassNamesForDemoAndEu() ??
                                    classNames(`cfd-real-compare-accounts__table-header${pre_appstore_class}`, {
                                        [`cfd-real-compare-accounts__table-header-for-synthetic-${synthetic_accounts_count}-financial-${financial_accounts_count}${pre_appstore_class}`]:
                                            available_accounts_count < 6,
                                    })
                                }
                            >
                                <Table.Head fixed className='cfd-real-compare-accounts__table-empty-cell' />
                                {!show_eu_related && synthetic_accounts_count > 0 && (
                                    <Table.Head className='cfd-real-compare-accounts__table-header-item'>
                                        {localize('Derived')}
                                    </Table.Head>
                                )}
                                {financial_accounts_count > 0 && (
                                    <Table.Head className='cfd-real-compare-accounts__table-header-item'>
                                        {show_eu_related ? localize('CFDs') : localize('Financial')}
                                    </Table.Head>
                                )}
                                {should_show_derivx && synthetic_accounts_count > 0 && (
                                    <Table.Head className='cfd-real-compare-accounts__table-header-item'>
                                        {localize('Deriv X')}
                                    </Table.Head>
                                )}
                            </Table.Row>
                        </Table.Header>
                        {!is_demo_tab && (
                            <React.Fragment>
                                <Table.Body>
                                    {getAvailableAccountsContent(getModalContent()).map(row => (
                                        <Row key={row.id} {...row} />
                                    ))}
                                </Table.Body>
                                {is_logged_in && (
                                    <Table.Row
                                        className={
                                            show_eu_related
                                                ? 'cfd-real-compare-accounts-row-eu columns-2'
                                                : classNames(
                                                      `cfd-real-compare-accounts__table-footer${pre_appstore_class}`,
                                                      {
                                                          [`cfd-real-compare-accounts__row-with-columns-count-${
                                                              available_accounts_count + 1
                                                          }`]: available_accounts_count < 6,
                                                      }
                                                  )
                                        }
                                    >
                                        <Table.Cell fixed className='cfd-real-compare-accounts__table-empty-cell' />
                                        {getAvailableAccountsFooterButtons(modal_footer()).map((item, index) => (
                                            <Table.Cell
                                                key={index}
                                                className='cfd-real-compare-accounts__table-footer__item'
                                            >
                                                {shouldShowPendingStatus(item) ? (
                                                    <div className='cfd-real-compare-accounts__table-footer__item--verification-pending'>
                                                        <Text size={isDesktop ? 'xxs' : 'xxxs'} align='center'>
                                                            {localize('Pending verification')}
                                                        </Text>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        className='cfd-real-compare-accounts__table-footer__button'
                                                        disabled={
                                                            item.action === 'derivx'
                                                                ? isDxtradeAccountAdded(item)
                                                                : isMt5AccountAdded(item)
                                                        }
                                                        type='button'
                                                        primary_light
                                                        onClick={() => onButtonClick(item)}
                                                    >
                                                        {item.label}
                                                    </Button>
                                                )}
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                )}
                            </React.Fragment>
                        )}
                        {is_preappstore_demo_cr_account && (
                            <React.Fragment>
                                <Table.Body>
                                    {getAvailableAccountsContent(getModalContent()).map(row => (
                                        <Row key={row.id} {...row} />
                                    ))}
                                </Table.Body>
                                {is_logged_in && (
                                    <Table.Row className='cfd-real-compare-accounts-row-demo'>
                                        <Table.Cell fixed className='cfd-real-compare-accounts__table-empty-cell' />
                                        {getAvailableAccountsFooterButtons(modal_footer()).map((item, index) => (
                                            <Table.Cell
                                                key={index}
                                                className='cfd-real-compare-accounts__table-footer__item'
                                            >
                                                <Button
                                                    className='cfd-real-compare-accounts__table-footer__button'
                                                    disabled={
                                                        item.action === 'derivx'
                                                            ? isDxtradeAccountAdded(item)
                                                            : isMt5AccountAdded(item)
                                                    }
                                                    type='button'
                                                    primary_light
                                                    onClick={() => onButtonClick(item)}
                                                >
                                                    {item.label}
                                                </Button>
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                )}
                            </React.Fragment>
                        )}
                    </Table>
                </div>
            </div>
        </Div100vhContainer>
    );
};

export default connect(({ modules, client, common, ui }: RootStore) => ({
    account_type: modules.cfd.account_type,
    account_settings: client.account_settings,
    has_real_account: client.has_active_real_account,
    setAccountSettings: client.setAccountSettings,
    setAccountType: modules.cfd.setAccountType,
    clearCFDError: modules.cfd.clearCFDError,
    current_list: modules.cfd.current_list,
    has_real_mt5_login: client.has_real_mt5_login,
    is_virtual: client.is_virtual,
    setJurisdictionSelectedShortcode: modules.cfd.setJurisdictionSelectedShortcode,
    toggleCFDVerificationModal: modules.cfd.toggleCFDVerificationModal,
    toggleCFDPersonalDetailsModal: modules.cfd.toggleCFDPersonalDetailsModal,
    trading_platform_available_accounts: client.trading_platform_available_accounts,
    account_status: client.account_status,
    should_restrict_bvi_account_creation: client.should_restrict_bvi_account_creation,
    upgradeable_landing_companies: client.upgradeable_landing_companies,
    openSwitchToRealAccountModal: ui.openSwitchToRealAccountModal,
    setAppstorePlatform: common.setAppstorePlatform,
    updateAccountStatus: client.updateAccountStatus,
}))(DMT5CompareModalContent);
