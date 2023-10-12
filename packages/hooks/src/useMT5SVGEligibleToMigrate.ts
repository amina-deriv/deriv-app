import React from 'react';
import { useMT5AccountsList, useQuery } from '@deriv/api';
import { Jurisdiction, getFormattedJurisdictionCode } from '@deriv/shared';

// type TMT5Migration = {
//     eligible_to_migrate?: Record<string, string>;
//     open_order_position_status?: number;
// };
// type demo = DeepRequired<NonNullable<ReturnType<typeof useQuery<'mt5_login_list'>>['data']>>['mt5_login_list'][0] & TMT5Migration;

const useMT5SVGEligibleToMigrate = () => {
    const { data: mt5_login_list = [] } = useMT5AccountsList();

    const mt5_migration_config = React.useMemo(() => {
        const svg_accounts_to_migrate = mt5_login_list.filter(
            account => account.landing_company_short === 'svg' && !!account.eligible_to_migrate
        );

        const has_svg_accounts_to_migrate = !!svg_accounts_to_migrate.length;
        const no_of_svg_accounts_to_migrate = svg_accounts_to_migrate.length;

        const is_eligible_for_svg_to_bvi_migration = !!svg_accounts_to_migrate.filter(account =>
            Object.values(account.eligible_to_migrate || {}).includes(Jurisdiction.BVI)
        ).length;

        const is_eligible_for_svg_to_vanuatu_migration = !!svg_accounts_to_migrate.filter(account =>
            Object.values(account.eligible_to_migrate || {}).includes(Jurisdiction.VANUATU)
        ).length;

        const getEligibleAccountToMigrate = () => {
            let account_to_migrate = '';
            if (is_eligible_for_svg_to_bvi_migration) {
                account_to_migrate = Jurisdiction.BVI;
            } else if (is_eligible_for_svg_to_vanuatu_migration) {
                account_to_migrate = Jurisdiction.VANUATU;
            }
            return account_to_migrate;
        };
        const eligible_account_to_migrate_label = getFormattedJurisdictionCode(getEligibleAccountToMigrate());

        const eligible_svg_to_bvi_derived_accounts = !!svg_accounts_to_migrate.filter(account => {
            const { synthetic } = account.eligible_to_migrate;
            return synthetic === Jurisdiction.BVI;
        }).length;

        const eligible_svg_to_bvi_financial_accounts = !!svg_accounts_to_migrate.filter(account => {
            const { financial } = account.eligible_to_migrate;
            return financial === Jurisdiction.BVI;
        }).length;

        const eligible_svg_to_vanuatu_derived_accounts = !!svg_accounts_to_migrate.filter(account => {
            const { synthetic } = account.eligible_to_migrate;
            return synthetic === Jurisdiction.VANUATU;
        }).length;

        const eligible_svg_to_vanuatu_financial_accounts = !!svg_accounts_to_migrate.filter(account => {
            const { financial } = account.eligible_to_migrate;
            return financial === Jurisdiction.VANUATU;
        }).length;

        return {
            getEligibleAccountToMigrate,
            svg_accounts_to_migrate,
            no_of_svg_accounts_to_migrate,
            has_svg_accounts_to_migrate,
            eligible_account_to_migrate_label,
            eligible_svg_to_bvi_derived_accounts,
            eligible_svg_to_bvi_financial_accounts,
            eligible_svg_to_vanuatu_derived_accounts,
            eligible_svg_to_vanuatu_financial_accounts,
        };
    }, [mt5_login_list]);
    return {
        ...mt5_migration_config,
    };
};

export default useMT5SVGEligibleToMigrate;
