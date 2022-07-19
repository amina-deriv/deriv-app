import { Button, Icon, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';
import { PlatformContext } from '@deriv/shared';
import IconMessageContent from 'Components/icon-message-content';

const PoiPoaSubmitted = ({ onClickOK, account_type, mt5_login_list }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const message = localize('Your documents was submitted successfully');
    let is_svg_created = false;
    if (account_type.type && account_type.category) {
        is_svg_created = mt5_login_list.filter(data =>
            data.market_type === account_type.type &&
            data.landing_company_short === 'svg' &&
            data.account_type === "real")
    }
    console.log(is_svg_created.length);
    const SVGData = () =>
        <>
            <Text size='xs' align='center'>
                <Localize i18n_default_text='You can trade with the SVG account in a single step while waiting. Add the {{type_of_account}} SVG account?'
                    values={{ type_of_account: account_type.type }} />
            </Text>
            <div className='poi-poa-submitted-svg-footer'>
                <Button has_effect text={localize('No')} onClick={onClickOK} primary />
                <Button has_effect text={localize('Yes')} onClick={onClickOK} primary />
            </div>
        </>

    return (

        <IconMessageContent
            message={message}
            text={localize('We’ll review your documents and notify you of its status within 1 to 3 days.')}
            icon={< Icon icon='IcDocsSubmit' size={128} />}
            full_width={is_appstore}
            className='poi-poa-submitted'
        >
            {!is_svg_created.length ? <SVGData /> :
                <Button has_effect text={localize('OK')} onClick={onClickOK} primary />
            }
        </IconMessageContent >
    )
}

export default PoiPoaSubmitted;
