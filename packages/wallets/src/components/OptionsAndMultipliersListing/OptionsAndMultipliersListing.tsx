import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { getOptionsAndMultipliersContent } from '../../constants/constants';
import { TRoute } from '../../routes/Router';
import { WalletLink } from '../Base';
import { DerivAppsSection } from '../DerivAppsSection';
import { TradingAccountCard } from '../TradingAccountCard';
import LinkTitle from './LinkTitle';
import './OptionsAndMultipliersListing.scss';

const OptionsAndMultipliersListing = () => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    return (
        <div className='wallets-options-and-multipliers-listing'>
            <section className='wallets-options-and-multipliers-listing__header'>
                <div className='wallets-options-and-multipliers-listing__header-title'>
                    {!isMobile && (
                        <Text align='center' size='xl' weight='bold'>
                            <Localize i18n_default_text='Options' />
                        </Text>
                    )}
                    <Text size={isMobile ? 'sm' : 'md'}>
                        <Localize i18n_default_text='Predict the market, profit if you’re right, risk only what you put in. ' />
                        <WalletLink staticUrl='/trade-types/options/digital-options/up-and-down/'>
                            <Localize i18n_default_text='Learn more' />
                        </WalletLink>
                    </Text>
                </div>
                <DerivAppsSection />
            </section>
            <div className='wallets-options-and-multipliers-listing__content'>
                {getOptionsAndMultipliersContent().map(account => {
                    const { description, key, redirect, title } = account;
                    return (
                        <TradingAccountCard
                            {...account}
                            disabled={!activeLinkedToTradingAccount?.loginid}
                            key={`trading-account-card-${title}`}
                            onClick={() => {
                                account.isExternal ? window.open(redirect, '_blank') : history.push(redirect as TRoute);
                            }}
                        >
                            <TradingAccountCard.Icon>
                                <LinkTitle platform={key} />
                            </TradingAccountCard.Icon>
                            <TradingAccountCard.Content>
                                <Text size='sm'>{title}</Text>
                                <Text size='xs'>{description}</Text>
                            </TradingAccountCard.Content>
                            {activeLinkedToTradingAccount?.loginid && (
                                <TradingAccountCard.Button>
                                    <LabelPairedChevronRightCaptionRegularIcon
                                        data-testid='dt_label_paired_chevron'
                                        width={16}
                                    />
                                </TradingAccountCard.Button>
                            )}
                        </TradingAccountCard>
                    );
                })}
            </div>
        </div>
    );
};

export default OptionsAndMultipliersListing;
