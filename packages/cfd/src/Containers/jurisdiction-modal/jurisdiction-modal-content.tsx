import React from 'react';
import { TJurisdictionModalContentProps } from '../props.types';
import JurisdictionCheckBox from './jurisdiction-modal-checkbox';
import JurisdictionCard from './jurisdiction-card';
import JurisdictionModalFootNote from './jurisdiction-modal-foot-note';

const JurisdictionModalContent = ({
    account_status,
    account_type,
    is_virtual,
    jurisdiction_selected_shortcode,
    setJurisdictionSelectedShortcode,
    synthetic_available_accounts,
    financial_available_accounts,
    checked,
    setChecked,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    should_restrict_bvi_account_creation,
}: TJurisdictionModalContentProps) => {
    const card_classname = `cfd-jurisdiction-card--${account_type}`;

    const cardsToBeShown = (type_of_card: string) =>
        account_type === 'synthetic'
            ? synthetic_available_accounts?.some(account => account.shortcode === type_of_card)
            : financial_available_accounts?.some(account => account.shortcode === type_of_card);

    const disableCard = (type_of_card: string) => {
        if (is_virtual && type_of_card !== 'svg') {
            return true;
        }
        return account_type === 'synthetic'
            ? real_synthetic_accounts_existing_data?.some(account => account.landing_company_short === type_of_card)
            : real_financial_accounts_existing_data?.some(account => account.landing_company_short === type_of_card);
    };
    const jurisdiction_cards_array = ['svg', 'bvi', 'vanuatu', 'labuan', 'maltainvest'];
    return (
        <React.Fragment>
            <div className={`${card_classname}__wrapper`}>
                {jurisdiction_cards_array.map(
                    card =>
                        cardsToBeShown(card) && (
                            <JurisdictionCard
                                key={`${account_type}_${card}`}
                                type_of_card={card}
                                disabled={disableCard(card)}
                                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                                synthetic_available_accounts={synthetic_available_accounts}
                                financial_available_accounts={financial_available_accounts}
                                account_type={account_type}
                                setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                            />
                        )
                )}
            </div>
            <JurisdictionModalFootNote
                account_type={account_type}
                card_classname={card_classname}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
            />
            <JurisdictionCheckBox
                is_checked={checked}
                onCheck={() => setChecked(!checked)}
                class_name={`${card_classname}__jurisdiction-checkbox`}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                should_restrict_bvi_account_creation={should_restrict_bvi_account_creation}
            />
        </React.Fragment>
    );
};

export default JurisdictionModalContent;
