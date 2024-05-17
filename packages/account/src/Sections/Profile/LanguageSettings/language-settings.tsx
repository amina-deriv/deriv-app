import React from 'react';
import { Redirect } from 'react-router-dom';
import { localize, getAllowedLanguages } from '@deriv/translations';
import { useStoreWalletAccountsList } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import FormSubHeader from 'Components/form-sub-header';
import LanguageRadioButton from 'Components/language-settings';
import { useDevice } from '@deriv-com/ui';

const LanguageSettings = observer(() => {
    const { common } = useStore();
    const { changeSelectedLanguage, current_language } = common;
    const { has_wallet } = useStoreWalletAccountsList();
    const { isDesktop } = useDevice();

    if (!isDesktop || has_wallet) {
        return <Redirect to={routes.traders_hub} />;
    }

    const allowed_language_keys: string[] = Object.keys(getAllowedLanguages());
    return (
        <div className='settings-language'>
            <FormSubHeader title={localize('Select language')} />
            <div className='settings-language__language-container'>
                {allowed_language_keys.map(language_key => {
                    return (
                        <LanguageRadioButton
                            key={language_key}
                            id={language_key}
                            language_code={language_key}
                            is_current_language={current_language === language_key}
                            name='language-radio-group'
                            onChange={() => {
                                changeSelectedLanguage(language_key);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default LanguageSettings;
