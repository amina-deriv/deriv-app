import React from 'react';
import classNames from 'classnames';
import { getStatusBadgeConfig } from '@deriv/account';
import { Text, StatusBadge } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import TradingPlatformIconProps from 'Assets/svgs/trading-platform';
import {
    getAppstorePlatforms,
    getMFAppstorePlatforms,
    BrandConfig,
    DERIV_PLATFORM_NAMES,
} from 'Constants/platform-config';
import './trading-app-card.scss';
import TradingAppCardActions, { Actions } from './trading-app-card-actions';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import { useIsMt5LoginListStatusPresent } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { observer } from 'mobx-react-lite';
import { CFD_PLATFORMS, ContentFlag, getStaticUrl, getUrlSmartTrader, getUrlBinaryBot } from '@deriv/shared';
import OpenPositionsSVGModal from '../modals/open-positions-svg-modal';

const TradingAppCard = ({
    availability,
    name,
    icon,
    action_type,
    clickable_icon = false,
    description,
    is_deriv_platform = false,
    onAction,
    sub_title,
    has_divider,
    platform,
    short_code_and_region,
    mt5_acc_auth_status,
    selected_mt5_jurisdiction,
    openFailedVerificationModal,
    login,
    market_type,
}: Actions & BrandConfig & AvailableAccount & TDetailsOfEachMT5Loginid) => {
    const {
        common,
        traders_hub,
        modules: { cfd },
    } = useStore();
    const { is_eu_user, is_demo_low_risk, content_flag, is_real } = traders_hub;
    const { current_language } = common;
    const { is_account_being_created } = cfd;

    //TODO replace landing_company_short status with open_order_position_status once key is available in BE response and in type TSocketResponseData<"mt5_login_list">
    const { is_flag_present: is_open_order_position_status_present, flag_value: open_order_position_status } =
        useIsMt5LoginListStatusPresent('landing_company_short', login ?? '');

    const low_risk_cr_non_eu = content_flag === ContentFlag.LOW_RISK_CR_NON_EU;

    const app_platform =
        !is_eu_user || low_risk_cr_non_eu || is_demo_low_risk ? getAppstorePlatforms() : getMFAppstorePlatforms();

    const { app_desc, link_to, is_external, new_tab } = app_platform.find(config => config.name === name) || {
        app_desc: description,
        link_to: '',
    };

    const appDescription = () => {
        if (
            platform !== CFD_PLATFORMS.CTRADER ||
            (platform === CFD_PLATFORMS.CTRADER && action_type !== 'multi-action')
        ) {
            return app_desc;
        }
    };

    const { text: badge_text, icon: badge_icon } = getStatusBadgeConfig(
        mt5_acc_auth_status,
        openFailedVerificationModal,
        selected_mt5_jurisdiction
    );

    const openStaticPage = () => {
        if (is_deriv_platform) {
            switch (name) {
                case DERIV_PLATFORM_NAMES.TRADER:
                    window.open(getStaticUrl(`/dtrader`));
                    break;
                case DERIV_PLATFORM_NAMES.DBOT:
                    window.open(getStaticUrl(`/dbot`));
                    break;
                case DERIV_PLATFORM_NAMES.SMARTTRADER:
                    window.open(getUrlSmartTrader());
                    break;
                case DERIV_PLATFORM_NAMES.BBOT:
                    window.open(getUrlBinaryBot());
                    break;
                case DERIV_PLATFORM_NAMES.GO:
                    window.open(getStaticUrl('/deriv-go'));
                    break;
                default:
            }
        }
        if (platform === CFD_PLATFORMS.MT5 && availability === 'EU')
            window.open(getStaticUrl(`/dmt5`, {}, false, true));
        else if (platform === CFD_PLATFORMS.MT5 && availability !== 'EU') window.open(getStaticUrl(`/dmt5`));
        else if (platform === CFD_PLATFORMS.DXTRADE) window.open(getStaticUrl(`/derivx`));
        else if (platform === CFD_PLATFORMS.DERIVEZ) window.open(getStaticUrl(`/derivez`));
        else if (icon === 'Options' && !is_eu_user) window.open(getStaticUrl(`/trade-types/options/`));
        else;
    };

    const [is_open_position_svg_modal_open, setIsOpenPositionSvgModalOpen] = React.useState(false);
    const status_text = open_order_position_status ? 'No new positions' : 'Account closed';

    return (
        <div className='trading-app-card' key={`trading-app-card__${current_language}`}>
            <div
                className={classNames('trading-app-card__icon--container', {
                    'trading-app-card__icon--container__clickable': clickable_icon,
                })}
            >
                <TradingPlatformIconProps icon={icon} onClick={clickable_icon ? openStaticPage : undefined} size={48} />
            </div>
            <div className={classNames('trading-app-card__container', { 'trading-app-card--divider': has_divider })}>
                <div className='trading-app-card__details'>
                    <div>
                        <Text className='title' size='xs' line_height='s' color='prominent'>
                            {!is_real && sub_title ? `${sub_title} ${localize('Demo')}` : sub_title}
                        </Text>
                        {short_code_and_region && (
                            <Text
                                weight='bolder'
                                size='xxxs'
                                line_height='s'
                                className='trading-app-card__details__short-code'
                            >
                                {short_code_and_region}
                            </Text>
                        )}
                    </div>
                    <Text
                        className='title'
                        size='xs'
                        line_height='s'
                        weight='bold'
                        color={action_type === 'trade' ? 'prominent' : 'general'}
                    >
                        {!is_real && !sub_title && !is_deriv_platform ? `${name} ${localize('Demo')}` : name}
                    </Text>
                    <Text className='description' color={'general'} size='xxs' line_height='m'>
                        {appDescription()}
                    </Text>
                    {mt5_acc_auth_status && (
                        <StatusBadge
                            className='trading-app-card__acc_status_badge'
                            account_status={mt5_acc_auth_status}
                            icon={badge_icon}
                            text={badge_text}
                        />
                    )}
                    {is_open_order_position_status_present && (
                        <StatusBadge
                            className='trading-app-card__acc_status_badge'
                            onClick={() => {
                                setIsOpenPositionSvgModalOpen(!is_open_position_svg_modal_open);
                            }}
                            account_status='open-order-position'
                            icon='IcAlertWarning'
                            text={
                                <Localize
                                    i18n_default_text='<0>{{status_text}}</0>'
                                    values={{ status_text }}
                                    components={[<Text key={0} weight='bold' size='xxxs' color='warning' />]}
                                />
                            }
                        />
                    )}
                    {is_open_position_svg_modal_open && (
                        <OpenPositionsSVGModal
                            market_type={market_type}
                            open_order_position_status={!!open_order_position_status}
                            is_modal_open={is_open_position_svg_modal_open}
                            setModalOpen={setIsOpenPositionSvgModalOpen}
                        />
                    )}
                </div>
                <div className='trading-app-card__actions'>
                    <TradingAppCardActions
                        action_type={action_type}
                        link_to={link_to}
                        onAction={onAction}
                        is_external={is_external}
                        new_tab={new_tab}
                        is_buttons_disabled={!!mt5_acc_auth_status}
                        is_account_being_created={!!is_account_being_created}
                        is_real={is_real}
                    />
                </div>
            </div>
        </div>
    );
};

export default observer(TradingAppCard);
