import React from 'react';
import { DerivLightWalletIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { Clipboard, CurrencyIcon, ReceiptScreen } from '../../../../components';
import { useWithdrawalCryptoContext } from '../../provider';
import styles from './WithdrawalCryptoReceipt.module.scss';

const ActionButtons = () => {
    return (
        <div className={styles.actions}>
            <Button color='white' size='lg' textSize='sm' variant='outlined'>
                View transaction history
            </Button>
            <Button size='lg' textSize='sm'>
                Make a new withdrawal
            </Button>
        </div>
    );
};

const WithdrawalCryptoReceipt: React.FC = () => {
    const { isMobile } = useDevice();
    const { withdrawalReceipt } = useWithdrawalCryptoContext();
    const { address, amount, fromAccount } = withdrawalReceipt;

    return (
        <ReceiptScreen
            actionButtons={<ActionButtons />}
            amount={`${amount} ${fromAccount?.currency}`}
            fromElement={
                <>
                    <div className={styles['account-info']}>
                        {fromAccount?.currency && (
                            <CurrencyIcon currency={fromAccount?.currency} size={isMobile ? 'sm' : 'md'} />
                        )}
                        <Text weight='bold'>{fromAccount?.currency}</Text>
                    </div>
                    <div className={styles['account-id']}>{fromAccount?.currency}</div>
                </>
            }
            status='In review'
            title='Your withdrawal will be processed within 24 hours'
            toElement={
                <>
                    <div className={styles['account-info']}>
                        <DerivLightWalletIcon height={isMobile ? '24px' : '32px'} />
                        <Text weight='bold'>{fromAccount?.currency} Wallet</Text>
                    </div>
                    <div className={styles['account-id']} data-testid='dt_withdrawal_crypto_receipt_address'>
                        <Text color='less-prominent' size={isMobile ? 'md' : 'sm'}>
                            {address}
                        </Text>
                        {address && <Clipboard popoverAlignment='bottom' textCopy={address} />}
                    </div>
                </>
            }
        />
    );
};

export default WithdrawalCryptoReceipt;
