import React from 'react';
import {
    Button,
    Modal,
    DesktopWrapper,
    MobileDialog,
    MobileWrapper,
    Table,
    UILoader,
    Text,
    ThemedScrollbars,
    Div100vhContainer,
    Icon,
} from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isDesktop } from '@deriv/shared';
const data = [
    {
        title: localize('Platforms'),
        multiplier: [
            {
                title: localize('Dtrader'),
                icon: 'IcBrandDtrader',
            },
        ],
        cfd: [
            {
                title: localize('DMT5'),
                icon: 'IcBrandDmt5',
            },
        ],
        has_items: false,
    },

    {
        title: localize('Asset classes'),
        multiplier: [
            {
                title: localize('Synthetics'),
                icon: 'IcMt5Synthetics',
            },
            {
                title: localize('Forex'),
                icon: 'IcMt5Forex',
            },
        ],
        cfd: [
            {
                title: localize('Synthetics'),
                icon: 'IcMt5Synthetics',
            },
            {
                title: localize('Forex'),
                icon: 'IcMt5Forex',
            },
            // {
            //     title: localize('Stocks'),
            //     icon: 'IcMt5Stocks',
            // },
            // {
            //     title: localize('Indices'),
            //     icon: 'IcMt5Indices',
            // },
            // {
            //     title: localize('Commodities'),
            //     icon: 'IcMt5Commodities',
            // },
            // {
            //     title: localize('Cryptos'),
            //     icon: 'IcMt5Cryptos',
            // },
        ],
        has_items: true,
    },
    {
        title: localize('Assets'),
        multiplier: localize('5+ Synthetic indices 10+Forex pairs'),
        cfd: localize(
            '5+ Synthetic indices 30+Forex pairs 40+ Stocks 10+ Stock indices 10+ Cryptocurrency/fiat pairs 10+Commodities'
        ),
        has_items: false,
    },
];
const Items = ({ items }) =>
    items.map(({ title, icon }) => (
        <div key={title} className='mul-cfd-compare-table-item'>
            <Icon icon={icon} size={isMobile() ? 16 : 24} />
            <Text
                as='p'
                align='center'
                color='prominent'
                size={isMobile() ? 'xxxxs' : 'xxxs'}
                className='mul-cfd-compare-table-item__text'
            >
                {title}
            </Text>
        </div>
    ));

const Row = ({ title, multiplier, cfd, has_items }) => (
    <>
        <Table.Row className={has_items ? 'mul-cfd-compare-table-row-items' : 'mul-cfd-compare-table-row'}>
            <Table.Cell className='mul-cfd-compare-table-col'>
                <Text as='p' weight='bold' align='center' color='prominent' size='xs'>
                    {title}
                </Text>
            </Table.Cell>

            <Table.Cell className='mul-cfd-compare-table-col'>
                {Array.isArray(multiplier) ? (
                    <Items items={multiplier} />
                ) : (
                    <Text as='p' weight='bold' align='center' color='prominent' size='xxs'>
                        {multiplier}
                    </Text>
                )}
            </Table.Cell>
            <Table.Cell className='mul-cfd-compare-table-col'>
                {Array.isArray(cfd) ? (
                    <Items items={cfd} />
                ) : (
                    <Text as='p' weight='bold' align='center' color='prominent' size='xxs'>
                        {cfd}
                    </Text>
                )}
            </Table.Cell>
        </Table.Row>
    </>
);

const ModalContent = ({}) => {
    return (
        <Div100vhContainer height_offset='40px' is_bypassed={isDesktop()}>
            <ThemedScrollbars
                className='cfd-compare-accounts'
                style={{
                    '--cfd-compare-accounts-template-columns': '1.5fr 2fr 3fr',
                }}
            >
                <div className='cfd-compare-accounts__table-wrapper'>
                    <Table className='cfd-compare-accounts__table'>
                        <Table.Header>
                            <Table.Row className='cfd-compare-accounts__table-row'>
                                <DesktopWrapper>
                                    <Table.Head />
                                </DesktopWrapper>

                                <Table.Head>
                                    <Icon icon='IcCrossSolid' size={48} />
                                </Table.Head>
                                <Table.Head>
                                    <Icon icon='IcPercentSolid' size={48} />
                                </Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {data.map((row, rowIndex) => (
                                <Row key={row.title} {...row} />
                            ))}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row className='cfd-compare-accounts__table-row'>
                                <DesktopWrapper>
                                    <Table.Cell className='platform-table-col' />
                                </DesktopWrapper>
                                <Table.Cell>
                                    <Button
                                        type='button'
                                        secondary
                                        onClick={() => {
                                            history.push(routes.mt5);
                                        }}
                                    >
                                        {localize('Add real account')}
                                    </Button>
                                </Table.Cell>
                                <Table.Cell className='platform-table-col'>
                                    <Button
                                        type='button'
                                        secondary
                                        onClick={() => {
                                            history.push(routes.dxtrade);
                                        }}
                                    >
                                        {localize('Add real account')}
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <Text as='p' size='xxs' color='less-prominent'>
                        {'You can add the other account later'}
                    </Text>
                </div>
            </ThemedScrollbars>
        </Div100vhContainer>
    );
};

const CompareAccountsModal = ({
    is_compare_accounts_visible,

    is_loading,

    toggleCompareAccounts,
}) => {
    return (
        <div className='cfd-compare-accounts-modal__wrapper' style={{ marginTop: '5rem' }}>
            //
            <Button
                className='cfd-dashboard__welcome-message--button'
                has_effect
                text={'Compare accounts'}
                onClick={toggleCompareAccounts}
                secondary
                disabled={is_loading}
            />
            //
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='mul_cfd_compare-accounts'
                        is_open={is_compare_accounts_visible}
                        title={localize('Please choose your account')}
                        toggleModal={toggleCompareAccounts}
                        type='button'
                        height='636px'
                        width='739px'
                    >
                        <ModalContent />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='deriv_app'
                        title={localize('Compare accounts')}
                        wrapper_classname='cfd-dashboard__compare-accounts'
                        visible={is_compare_accounts_visible}
                        onClose={toggleCompareAccounts}
                    >
                        <ModalContent />
                    </MobileDialog>
                </MobileWrapper>
            </React.Suspense>
        </div>
    );
};

export default connect(({ modules, ui, client }) => ({
    is_compare_accounts_visible: modules.cfd.is_compare_accounts_visible,
    is_loading: client.is_populating_mt5_account_list,

    toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
}))(CompareAccountsModal);
