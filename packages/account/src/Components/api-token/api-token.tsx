import React from 'react';
import classNames from 'classnames';
import { Formik, Form, Field, FormikErrors, FieldProps, FormikHelpers } from 'formik';
import { Timeline, Input, Button, ThemedScrollbars, Loading } from '@deriv/components';
import InlineNoteWithIcon from '../inline-note-with-icon';
import { getPropertyValue, useIsMounted, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import LoadErrorMessage from 'Components/load-error-message';
import ApiTokenArticle from './api-token-article';
import ApiTokenCard from './api-token-card';
import ApiTokenTable from './api-token-table';
import ApiTokenContext from './api-token-context';
import { TToken } from 'Types';
import { observer, useStore } from '@deriv/stores';

const MIN_TOKEN = 2;
const MAX_TOKEN = 32;

type AptTokenState = {
    api_tokens: NonNullable<TToken[]>;
    is_loading: boolean;
    is_success: boolean;
    is_overlay_shown: boolean;
    error_message: string;
    show_delete: boolean;
    dispose_token: string;
    is_delete_loading: boolean;
    is_delete_success: boolean;
};

type TApiTokenForm = {
    token_name: string;
    read: boolean;
    trade: boolean;
    payments: boolean;
    trading_information: boolean;
    admin: boolean;
};

const ApiToken = () => {
    const { client, ui } = useStore();
    const { is_switching } = client;
    const { is_desktop, is_mobile } = ui;
    const isMounted = useIsMounted();
    const prev_is_switching = React.useRef(is_switching);
    const [state, setState] = React.useReducer(
        (prev_state: Partial<AptTokenState>, value: Partial<AptTokenState>) => ({
            ...prev_state,
            ...value,
        }),
        {
            api_tokens: [],
            is_loading: true,
            is_success: false,
            is_overlay_shown: false,
            error_message: '',
            show_delete: false,
            dispose_token: '',
            is_delete_loading: false,
            is_delete_success: false,
        }
    );
    let timeout_deletetokens: NodeJS.Timeout | undefined;

    React.useEffect(() => {
        getApiTokens();

        return () => setState({ dispose_token: '' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (prev_is_switching.current !== is_switching) {
            prev_is_switching.current = is_switching;
            getApiTokens();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    const initial_form = {
        token_name: '',
        read: false,
        trade: false,
        payments: false,
        trading_information: false,
        admin: false,
    };

    const validateFields = (values: TApiTokenForm) => {
        const errors: FormikErrors<TApiTokenForm> = {};
        const token_name = values.token_name && values.token_name.trim();

        if (!token_name) {
            errors.token_name = localize('Please enter a token name.');
        } else if (!/^[A-Za-z0-9\s_]+$/g.test(token_name)) {
            errors.token_name = localize('Only letters, numbers, and underscores are allowed.');
        } else if (token_name.length < MIN_TOKEN) {
            errors.token_name = localize(
                'Length of token name must be between {{MIN_TOKEN}} and {{MAX_TOKEN}} characters.',
                {
                    MIN_TOKEN,
                    MAX_TOKEN,
                }
            );
        } else if (token_name.length > MAX_TOKEN) {
            errors.token_name = localize('Maximum {{MAX_TOKEN}} characters.', { MAX_TOKEN });
        }

        return errors;
    };

    const selectedTokenScope = (values: TApiTokenForm) =>
        Object.keys(values).filter(item => item !== 'token_name' && Boolean(values[item as keyof TApiTokenForm]));

    const handleSubmit = async (
        values: TApiTokenForm,
        { setSubmitting, setFieldError, resetForm }: FormikHelpers<TApiTokenForm>
    ) => {
        const token_response = await WS.apiToken({
            api_token: 1,
            new_token: values.token_name,
            new_token_scopes: selectedTokenScope(values),
        });
        if (token_response.error) {
            setFieldError('token_name', token_response.error.message);
        } else if (isMounted()) {
            setState({
                is_success: true,
                api_tokens: getPropertyValue(token_response, ['api_token', 'tokens']),
            });
            setTimeout(() => {
                if (isMounted()) setState({ is_success: false });
            }, 500);
        }
        resetForm();
        setSubmitting(false);
    };

    const populateTokenResponse = (response: import('@deriv/api-types').APITokenResponse) => {
        if (!isMounted()) return;
        if (response.error) {
            setState({
                is_loading: false,
                error_message: getPropertyValue(response, ['error', 'message']),
            });
        } else {
            setState({
                is_loading: false,
                api_tokens: getPropertyValue(response, ['api_token', 'tokens']),
            });
        }
    };

    const getApiTokens = async () => {
        setState({ is_loading: true });
        const token_response = await WS.authorized.apiToken({ api_token: 1 });
        populateTokenResponse(token_response);
    };

    const deleteToken = async (token: string) => {
        setState({ is_delete_loading: true });

        clearTimeout(timeout_deletetokens);

        const token_response = await WS.authorized.apiToken({ api_token: 1, delete_token: token });

        populateTokenResponse(token_response);

        if (isMounted()) setState({ is_delete_loading: false, is_delete_success: true });

        timeout_deletetokens = setTimeout(() => {
            if (isMounted()) setState({ is_delete_success: false });
        }, 500);
    };

    const { api_tokens, is_loading, is_success, error_message } = state;

    if (is_loading || is_switching) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    if (error_message) {
        return <LoadErrorMessage error_message={error_message} />;
    }

    const context_value = {
        api_tokens,
        deleteToken,
    };

    return (
        <React.Fragment>
            <ApiTokenContext.Provider value={context_value}>
                <section className='da-api-token'>
                    <div className='da-api-token__wrapper'>
                        <ThemedScrollbars className='da-api-token__scrollbars' is_bypassed={is_mobile}>
                            {is_mobile && <ApiTokenArticle />}
                            <Formik initialValues={initial_form} onSubmit={handleSubmit} validate={validateFields}>
                                {({
                                    values,
                                    errors,
                                    isValid,
                                    dirty,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    isSubmitting,
                                    setFieldTouched,
                                }) => (
                                    <Form noValidate>
                                        <Timeline className='da-api-token__timeline' line_height='xxxl'>
                                            <Timeline.Item
                                                item_title={localize('Select scopes based on the access you need.')}
                                            >
                                                <div className='da-api-token__checkbox-wrapper'>
                                                    <ApiTokenCard
                                                        name='read'
                                                        display_name={localize('Read')}
                                                        description={localize(
                                                            'This scope will allow third-party apps to view your account activity, settings, limits, balance sheets, trade purchase history, and more.'
                                                        )}
                                                    />
                                                    <ApiTokenCard
                                                        name='trade'
                                                        display_name={localize('Trade')}
                                                        description={localize(
                                                            'This scope will allow third-party apps to buy and sell contracts for you, renew your expired purchases, and top up your demo accounts.'
                                                        )}
                                                    />
                                                    <ApiTokenCard
                                                        name='payments'
                                                        display_name={localize('Payments')}
                                                        description={localize(
                                                            'This scope will allow third-party apps to withdraw to payment agents and make inter-account transfers for you.'
                                                        )}
                                                    />
                                                    <ApiTokenCard
                                                        name='trading_information'
                                                        display_name={localize('Trading information')}
                                                        description={localize(
                                                            'This scope will allow third-party apps to view your trading history.'
                                                        )}
                                                    />
                                                    <ApiTokenCard
                                                        name='admin'
                                                        display_name={localize('Admin')}
                                                        description={localize(
                                                            'This scope will allow third-party apps to open accounts for you, manage your settings and token usage, and more. '
                                                        )}
                                                    >
                                                        <InlineNoteWithIcon
                                                            icon='IcAlertWarning'
                                                            message={localize(
                                                                'To avoid loss of funds, do not share tokens with the Admin scope with unauthorised parties.'
                                                            )}
                                                            title={localize('Note')}
                                                        />
                                                    </ApiTokenCard>
                                                </div>
                                            </Timeline.Item>
                                            <Timeline.Item
                                                item_title={localize(
                                                    "Name your token and click on 'Create' to generate your token."
                                                )}
                                            >
                                                <div className='da-api-token__input-group'>
                                                    <Field name='token_name'>
                                                        {({ field }: FieldProps<string | boolean>) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                type='text'
                                                                className='da-api-token__input dc-input__input-group'
                                                                label={localize('Token name')}
                                                                value={values.token_name}
                                                                onChange={e => {
                                                                    setFieldTouched('token_name', true);
                                                                    handleChange(e);
                                                                }}
                                                                onBlur={handleBlur}
                                                                hint={localize(
                                                                    'Length of token name must be between 2 and 32 characters.'
                                                                )}
                                                                required
                                                                error={
                                                                    touched.token_name && errors.token_name
                                                                        ? errors.token_name
                                                                        : undefined
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                    <Button
                                                        className={classNames(
                                                            'dc-btn__button-group',
                                                            'da-api-token__button',
                                                            {
                                                                'da-api-token__button--success': is_success,
                                                            }
                                                        )}
                                                        type='submit'
                                                        is_disabled={
                                                            !dirty ||
                                                            isSubmitting ||
                                                            !isValid ||
                                                            !selectedTokenScope(values).length
                                                        }
                                                        has_effect
                                                        is_loading={isSubmitting}
                                                        is_submit_success={is_success}
                                                        text={localize('Create')}
                                                        primary
                                                        large
                                                    />
                                                </div>
                                            </Timeline.Item>
                                            <Timeline.Item
                                                item_title={localize('Copy and paste the token into the app.')}
                                            >
                                                <ApiTokenTable />
                                            </Timeline.Item>
                                        </Timeline>
                                    </Form>
                                )}
                            </Formik>
                        </ThemedScrollbars>
                        {is_desktop && <ApiTokenArticle />}
                    </div>
                </section>
            </ApiTokenContext.Provider>
        </React.Fragment>
    );
};

export default observer(ApiToken);
