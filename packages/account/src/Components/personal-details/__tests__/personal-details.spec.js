import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import { act } from 'react-dom/test-utils';
import PersonalDetails from '../personal-details';
import { PlatformContext } from '@deriv/shared';
import { BrowserRouter } from 'react-router-dom';
import { splitValidationResultTypes } from 'Components/real-account-signup/helpers/utils.js';
import * as formik from 'formik';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

const mock_warnings = {};
const mock_errors = {
    account_opening_reason: 'Account opening reason is required.',
    salutation: 'Salutation is required.',
    first_name: 'First name is required.',
    last_name: 'Last name is required.',
    date_of_birth: 'Date of birth is required.',
    place_of_birth: 'Place of birth is required.',
    citizen: 'Citizenship is required',
    phone: 'Phone is required.',
    tax_residence: 'Tax residence is required.',
    tax_identification_number: 'Tax Identification Number is required.',
    tax_identification_confirm: 'Please confirm your tax information.',
};

jest.mock('Components/real-account-signup/helpers/utils.js', () => ({
    splitValidationResultTypes: jest.fn(() => ({
        warnings: mock_warnings,
        errors: mock_errors,
    })),
}));

const runCommonFormfieldsTests = () => {
    expect(screen.getByRole('radio', { name: /mr/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /ms/i })).toBeInTheDocument();

    expect(screen.getByTestId('first_name')).toBeInTheDocument();
    expect(screen.getByTestId('last_name')).toBeInTheDocument();

    expect(screen.getByTestId('date_of_birth')).toBeInTheDocument();

    expect(screen.queryByTestId('place_of_birth')).toBeInTheDocument();
    expect(screen.queryByTestId('place_of_birth_mobile')).not.toBeInTheDocument();

    expect(screen.queryByTestId('citizenship')).toBeInTheDocument();
    expect(screen.queryByTestId('citizenship_mobile')).not.toBeInTheDocument();

    expect(screen.queryByTestId('phone')).toBeInTheDocument();

    expect(screen.queryByTestId('tax_residence')).toBeInTheDocument();
    expect(screen.queryByTestId('tax_residence_mobile')).not.toBeInTheDocument();
    //

    expect(screen.getByPlaceholderText(/john/i)).toBeInTheDocument();
    expect(
        screen.getByText(/Please enter your first name as in your official identity documents./i)
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    expect(
        screen.getByText(/Please enter your last name as in your official identity documents./i)
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/01-07-1999/i)).toBeInTheDocument();
    expect(
        screen.getByText(/Please enter your date of birth as in your official identity documents./i)
    ).toBeInTheDocument();

    expect(screen.getByText('Place of birth')).toBeInTheDocument();

    expect(screen.getByText('Citizenship')).toBeInTheDocument();

    expect(screen.getByText('Tax residence')).toBeInTheDocument();

    const tax_residence_pop_over = screen.queryByTestId('tax_residence_pop_over');
    expect(tax_residence_pop_over).toBeInTheDocument();

    fireEvent.click(tax_residence_pop_over);
    expect(
        screen.getByText(
            /the country in which you meet the criteria for paying taxes\. usually the country in which you physically reside\./i
        )
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/tax identification number/i)).toBeInTheDocument();

    const tax_identification_number_pop_over = screen.queryByTestId('tax_identification_number_pop_over');
    expect(tax_identification_number_pop_over).toBeInTheDocument();
    fireEvent.click(tax_identification_number_pop_over);
    expect(screen.getByText(/don't know your tax identification number\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'here' })).toBeInTheDocument();
    expect(screen.getByText('here').closest('a')).toHaveAttribute(
        'href',
        'https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/'
    );
    expect(
        screen.getByRole('checkbox', {
            name: /i hereby confirm that the tax information i provided is true and complete\. i will also inform deriv investments \(europe\) limited about any changes to this information\./i,
        })
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /account opening reason/i })).toBeInTheDocument();

    expect(screen.queryByTestId('dti_dropdown_display')).toBeInTheDocument();
    expect(screen.queryByTestId('account_opening_reason_mobile')).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
};

describe('<PersonalDetails/>', () => {
    const props = {
        is_svg: true,
        account_opening_reason_list: [
            {
                text: 'Hedging',
                value: 'Hedging',
            },
            {
                text: 'Income Earning',
                value: 'Income Earning',
            },
            {
                text: 'Speculative',
                value: 'Speculative',
            },
        ],
        salutation_list: [
            {
                label: 'Mr',
                value: 'Mr',
            },

            {
                label: 'Ms',
                value: 'Ms',
            },
        ],
        disabled_items: [],
        residence_list: [
            {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {},
                            has_visual_sample: 0,
                            is_country_supported: 0,
                        },
                        onfido: {
                            documents_supported: {
                                passport: {
                                    display_name: 'Passport',
                                },
                            },
                            is_country_supported: 1,
                        },
                    },
                },
                phone_idd: '93',
                text: 'Afghanistan',
                value: 'af',
            },
            {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {},
                            has_visual_sample: 0,
                            is_country_supported: 0,
                        },
                        onfido: {
                            documents_supported: {},
                            is_country_supported: 0,
                        },
                    },
                },
                phone_idd: '35818',
                text: 'Aland Islands',
                value: 'ax',
            },
            {
                identity: {
                    services: {
                        idv: {
                            documents_supported: {},
                            has_visual_sample: 0,
                            is_country_supported: 0,
                        },
                        onfido: {
                            documents_supported: {
                                driving_licence: {
                                    display_name: 'Driving Licence',
                                },
                                national_identity_card: {
                                    display_name: 'National Identity Card',
                                },
                                passport: {
                                    display_name: 'Passport',
                                },
                            },
                            is_country_supported: 1,
                        },
                    },
                },
                phone_idd: '355',
                text: 'Albania',
                tin_format: ['^[A-Ta-t0-9]\\d{8}[A-Wa-w]$'],
                value: 'al',
            },
        ],
        closeRealAccountSignup: jest.fn(),
        validate: jest.fn(),
        value: {
            account_opening_reason: '',
            salutation: '',
            first_name: '',
            last_name: '',
            date_of_birth: '',
            place_of_birth: '',
            citizen: '',
            phone: '+34',
            tax_residence: '',
            tax_identification_number: '',
            tax_identification_confirm: false,
        },
        index: 1,
        has_currency: true,
        form_error: '',
        bypass_to_personal: false,
        onSubmit: jest.fn(),
        getCurrentStep: jest.fn(() => 1),
        onSave: jest.fn(),
        onCancel: jest.fn(),
    };

    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    const renderwithRouter = component => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };
    it('should render PersonalDetails component', () => {
        renderwithRouter(<PersonalDetails {...props} />);
        expect(screen.getByTestId('personal-details-form')).toBeInTheDocument();
    });

    it('should show fake-alert message when is_appstore is true', () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <PersonalDetails {...props} />
            </PlatformContext.Provider>
        );
        expect(
            screen.getByText(
                /we need this for verification\. if the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw\./i
            )
        ).toBeInTheDocument();
    });
    it('should not show fake-alert message when is_appstore is false ', () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <PersonalDetails {...props} />
            </PlatformContext.Provider>
        );
        expect(
            screen.queryByText(
                /we need this for verification\. if the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw\./i
            )
        ).not.toBeInTheDocument();
    });

    it('should show proper salutation message when is_virtual is true', () => {
        renderwithRouter(<PersonalDetails {...props} is_virtual />);
        expect(
            screen.getByText(
                /please remember that it is your responsibility to keep your answers accurate and up to date\. you can update your personal details at any time in your account settings\./i
            )
        ).toBeInTheDocument();
    });

    it('should show proper salutation message when is_virtual is false', () => {
        renderwithRouter(<PersonalDetails {...props} />);
        expect(
            screen.getByText(
                /please remember that it is your responsibility to keep your answers accurate and up to date\. you can update your personal details at any time in your \./i
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /account settings/i })).toBeInTheDocument();
        expect(screen.getByText(/account settings/i).closest('a')).toHaveAttribute('href', '/account/personal-details');
        fireEvent.click(screen.getByText('account settings'));
        expect(props.closeRealAccountSignup).toHaveBeenCalledTimes(1);
    });

    it('should show title and Name label when salutation is passed', () => {
        renderwithRouter(<PersonalDetails {...props} />);
        expect(
            screen.getByRole('heading', {
                name: /title and name/i,
            })
        ).toBeInTheDocument();
    });
    it('should show Name label when salutation is not passed', () => {
        const newprops = { ...props, value: {} };
        renderwithRouter(<PersonalDetails {...newprops} />);
        expect(screen.getByRole('heading', { name: /name/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /title and name/i })).not.toBeInTheDocument();
    });

    it('should show salutation options', () => {
        renderwithRouter(<PersonalDetails {...props} />);
        const mr_radio_btn = screen.getByRole('radio', { name: /mr/i });
        const mrs_radio_btn = screen.getByRole('radio', { name: /ms/i });
        expect(mr_radio_btn).toBeInTheDocument();
        expect(mrs_radio_btn).toBeInTheDocument();
        expect(mr_radio_btn.checked).toEqual(false);
        fireEvent.click(mr_radio_btn);
        expect(mr_radio_btn.checked).toEqual(true);
        expect(mrs_radio_btn.checked).toEqual(false);
    });

    it('should display the correct field details when is_appstore is true ', () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <PersonalDetails {...props} is_svg={false} />
            </PlatformContext.Provider>
        );

        expect(screen.getByText(/first name\*/i)).toBeInTheDocument();

        expect(screen.getByText(/family name\*/i)).toBeInTheDocument();

        expect(screen.getByText(/date of birth\*/i)).toBeInTheDocument();

        expect(screen.getByText(/phone number\*/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/phone number\*/i)).toBeInTheDocument();

        runCommonFormfieldsTests();
    });

    it('should display the correct field details when is_appstore is false and is_svg is true ', () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <PersonalDetails {...props} />
            </PlatformContext.Provider>
        );
        expect(screen.getByRole('heading', { name: /title and name/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'name' })).not.toBeInTheDocument();
        expect(screen.getByText(/first name\*/i)).toBeInTheDocument();
        expect(screen.getByText(/last name\*/i)).toBeInTheDocument();
        expect(screen.getByText(/date of birth\*/i)).toBeInTheDocument();
        expect(screen.getByText(/phone number\*/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/phone number\*/i)).toBeInTheDocument();

        runCommonFormfieldsTests();
    });

    it('should display the correct field details when is_appstore is false and is_svg is false ', () => {
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <PersonalDetails {...props} is_svg={false} />
            </PlatformContext.Provider>
        );
        expect(screen.getByRole('heading', { name: 'Title and name' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'name' })).not.toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /other details/i })).toBeInTheDocument();
        expect(screen.getByText('First name')).toBeInTheDocument();
        expect(screen.getByText('Last name')).toBeInTheDocument();
        expect(screen.getByText('Date of birth')).toBeInTheDocument();
        expect(screen.getByText('Phone number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Phone number')).toBeInTheDocument();

        runCommonFormfieldsTests();
    });

    it('should not show disabled fields', async () => {
        act(() => {
            renderwithRouter(
                <PlatformContext.Provider value={{ is_appstore: false }}>
                    <PersonalDetails
                        {...props}
                        disabled_items={[
                            'salutation',
                            'first_name',
                            'last_name',
                            'date_of_birth',
                            'place_of_birth',
                            'citizen',
                            'account_opening_reason',
                        ]}
                    />
                </PlatformContext.Provider>
            );
        });

        await waitFor(() => {
            expect(screen.getByRole('radio', { name: /mr/i })).toBeDisabled();
            expect(screen.getByRole('radio', { name: /ms/i })).toBeDisabled();

            expect(screen.getByTestId('first_name')).toBeDisabled();
            expect(screen.getByTestId('last_name')).toBeDisabled();

            expect(screen.getByTestId('date_of_birth')).toBeDisabled();
            expect(screen.getByTestId('place_of_birth')).toBeDisabled();

            expect(screen.getByTestId('citizenship')).toBeDisabled();
        });
    });

    it('should disable if citizen is passed and is_fully_authenticated', async () => {
        const new_props = {
            ...props,
            value: {
                ...props.value,
                citizen: 'france',
            },
        };
        act(() => {
            renderwithRouter(
                <PlatformContext.Provider value={{ is_appstore: false }}>
                    (<PersonalDetails {...new_props} is_fully_authenticated={true} />
                    );
                </PlatformContext.Provider>
            );
        });
        await waitFor(() => {
            expect(screen.getByTestId('citizenship')).toBeDisabled();
        });
    });

    it('should display proper data in mobile mode', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        renderwithRouter(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <PersonalDetails {...props} is_svg={false} />
            </PlatformContext.Provider>
        );
        expect(screen.getByRole('radio', { name: /mr/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /ms/i })).toBeInTheDocument();

        expect(screen.getByTestId('first_name')).toBeInTheDocument();
        expect(screen.getByTestId('last_name')).toBeInTheDocument();

        expect(screen.getByTestId('date_of_birth')).toBeInTheDocument();

        expect(screen.queryByTestId('place_of_birth_mobile')).toBeInTheDocument();
        expect(screen.queryByTestId('place_of_birth')).not.toBeInTheDocument();

        expect(screen.queryByTestId('citizenship_mobile')).toBeInTheDocument();
        expect(screen.queryByTestId('citizenship')).not.toBeInTheDocument();

        expect(screen.queryByTestId('phone')).toBeInTheDocument();
        expect(screen.queryByTestId('tax_residence_mobile')).toBeInTheDocument();
        expect(screen.queryByTestId('tax_residence')).not.toBeInTheDocument();

        expect(screen.getByText(/tax identification number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/tax identification number/i)).toBeInTheDocument();

        expect(
            screen.getByRole('checkbox', {
                name: /i hereby confirm that the tax information i provided is true and complete\. i will also inform deriv investments \(europe\) limited about any changes to this information\./i,
            })
        ).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: /account opening reason/i })).toBeInTheDocument();

        expect(screen.queryByTestId('dti_dropdown_display')).not.toBeInTheDocument();
        expect(screen.queryByTestId('account_opening_reason_mobile')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should select correct dropdown options in mobile mode', async () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        const spyformik = jest.spyOn(formik, 'useFormikContext');
        spyformik.mockReturnValue({
            handleChange: jest.fn(),
        });
        await act(async () => {
            renderwithRouter(
                <PlatformContext.Provider value={{ is_appstore: false }}>
                    <PersonalDetails {...props} is_svg={false} />
                </PlatformContext.Provider>
            );
        });
        const place_of_birth_mobile = screen.queryByTestId('place_of_birth_mobile');

        expect(place_of_birth_mobile).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(place_of_birth_mobile, { target: { value: 'Afghanistan' } });
        });

        const { getByText } = within(screen.getAllByTestId('selected_value')[0]);
        expect(getByText('Afghanistan')).toBeInTheDocument();
    });

    it('should have validation error given first_name and last_name fields are touched and have error', async () => {
        renderwithRouter(<PersonalDetails {...props} is_svg={false} />);

        const first_name = screen.getByTestId('first_name');
        const last_name = screen.getByTestId('last_name');

        await act(async () => {
            fireEvent.blur(first_name);
            fireEvent.blur(last_name);
        });

        await waitFor(() => {
            expect(screen.getByText(/first name is required\./i)).toBeInTheDocument();
            expect(screen.getByText(/last name is required\./i)).toBeInTheDocument();
        });

        const new_validate = {
            warnings: mock_warnings,
            errors: {
                ...mock_errors,
                first_name: 'letters, spaces, periods, hyphens, apostrophes only',
                last_name: 'last name should be between 2 and 50 characters.',
            },
        };
        splitValidationResultTypes.mockReturnValue(new_validate);

        await act(async () => {
            fireEvent.change(first_name, {
                target: { value: '123' },
            });
            fireEvent.blur(first_name);

            fireEvent.change(last_name, {
                target: { value: 'a' },
            });
            fireEvent.blur(last_name);
        });
        await waitFor(() => {
            expect(screen.getByText(/letters, spaces, periods, hyphens, apostrophes only/i)).toBeInTheDocument();
            expect(screen.getByText(/last name should be between 2 and 50 characters/i)).toBeInTheDocument();
        });
    });

    it('should have validation errors on form fields', async () => {
        isMobile.mockReturnValue(false);
        isDesktop.mockReturnValue(true);

        renderwithRouter(<PersonalDetails {...props} is_svg={false} />);
        const date_of_birth = await screen.getByTestId('date_of_birth');
        const place_of_birth = screen.getByTestId('place_of_birth');
        const citizenship = screen.getByTestId('citizenship');
        const phone = screen.getByTestId('phone');
        const tax_residence = screen.getByTestId('tax_residence');
        const tax_identification_number = screen.getByTestId('tax_identification_number');

        await act(async () => {
            fireEvent.blur(date_of_birth);
            fireEvent.blur(place_of_birth);
            fireEvent.blur(citizenship);
            fireEvent.blur(phone);
            fireEvent.blur(tax_residence);
            fireEvent.blur(tax_identification_number);
        });
        await waitFor(() => {
            expect(screen.getByText(/date of birth is required\./i)).toBeInTheDocument();
            expect(screen.getByText(/place of birth is required\./i)).toBeInTheDocument();
            expect(screen.getByText(/citizenship is required/i)).toBeInTheDocument();
            expect(screen.getByText(/phone is required\./i)).toBeInTheDocument();
            expect(screen.getByText(/tax residence is required\./i)).toBeInTheDocument();
            expect(screen.getByText(/tax identification number is required\./i)).toBeInTheDocument();
        });
        splitValidationResultTypes.mockReturnValue({
            ...mock_warnings,
            errors: {
                ...mock_errors.errors,
                date_of_birth: 'You must be 18 years old and above.',
                tax_identification_number: "Tax Identification Number can't be longer than 25 characters.",
            },
        });
        await act(async () => {
            fireEvent.click(date_of_birth);
            fireEvent.change(date_of_birth, { target: { value: '2021-04-13' } });
            fireEvent.blur(date_of_birth);

            fireEvent.change(tax_identification_number, {
                target: { value: '123456789012345678901234567890' },
            });
            fireEvent.blur(tax_identification_number);
        });
        await waitFor(() => {
            expect(screen.getByText(/you must be 18 years old and above\./i)).toBeInTheDocument();
            expect(
                screen.getByText(/tax Identification Number can't be longer than 25 characters\./i)
            ).toBeInTheDocument();
        });
    });

    it('should show warning', async () => {
        const newvalidate = {
            warnings: {
                tax_identification_number:
                    'This Tax Identification Number (TIN) is invalid. You may continue using it, but to facilitate future payment processes, valid tax information will be required.',
            },
            errors: { ...mock_errors },
        };
        splitValidationResultTypes.mockReturnValue(newvalidate);
        act(() => {
            renderwithRouter(
                <PlatformContext.Provider value={{ is_appstore: false }}>
                    (<PersonalDetails {...props} />
                    );
                </PlatformContext.Provider>
            );
        });

        await waitFor(() => {
            expect(
                screen.getByText(
                    /this tax identification number \(tin\) is invalid\. you may continue using it, but to facilitate future payment processes, valid tax information will be required\./i
                )
            ).toBeInTheDocument();
        });
    });

    it('should submit the form if there is no validation error on desktop', async () => {
        splitValidationResultTypes.mockReturnValue({ warnings: {}, errors: {} });
        const new_props = {
            ...props,
            value: {
                date_of_birth: '',
                first_name: '',
                last_name: '',
                phone: '+93',
            },
        };

        act(() => {
            renderwithRouter(<PersonalDetails {...new_props} />);
        });

        await act(async () => {
            const first_name = screen.getByTestId('first_name');
            const last_name = screen.getByTestId('last_name');
            const date_of_birth = screen.getByTestId('date_of_birth');
            const phone = screen.getByTestId('phone');
            fireEvent.change(first_name, {
                target: { value: 'test firstname' },
            });

            fireEvent.change(last_name, {
                target: { value: 'test lastname' },
            });
            fireEvent.change(date_of_birth, {
                target: { value: '2000-12-12' },
            });
            fireEvent.change(phone, {
                target: { value: '+931234567890' },
            });
        });

        await act(async () => {
            const previous_btn = screen.getByRole('button', { name: /previous/i });
            const next_btn = screen.getByRole('button', { name: /next/i });
            expect(previous_btn).toBeEnabled();
            expect(next_btn).toBeEnabled();
            fireEvent.click(next_btn);
        });

        await waitFor(() => {
            expect(new_props.onSubmit).toBeCalled();
        });
    });

    it('should submit the form if there is no validation error on mobile', async () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        splitValidationResultTypes.mockReturnValue({ warnings: {}, errors: {} });
        const new_props = {
            ...props,
            value: {
                account_opening_reason: '',
                citizen: '',
                date_of_birth: '',
                first_name: '',
                last_name: '',
                phone: '+49',
                place_of_birth: '',
                salutation: '',
                tax_identification_confirm: false,
                tax_identification_number: '',
                tax_residence: '',
            },
        };

        await act(async () => {
            renderwithRouter(<PersonalDetails {...new_props} />);
        });
        const mr_radio_btn = screen.getByRole('radio', { name: /mr/i });

        const first_name = screen.getByTestId('first_name');
        const last_name = screen.getByTestId('last_name');

        const date_of_birth = screen.getByTestId('date_of_birth');
        const place_of_birth_mobile = screen.getByTestId('place_of_birth_mobile');
        const citizenship = screen.getByTestId('citizenship_mobile');
        const phone = screen.getByTestId('phone');
        const tax_residence_mobile = screen.getByTestId('tax_residence_mobile');
        const tax_identification_number = screen.getByTestId('tax_identification_number');
        const tax_identification_confirm = screen.getByTestId('tax_identification_confirm');
        const account_opening_reason_mobile = screen.getByTestId('account_opening_reason_mobile');

        await act(async () => {
            fireEvent.click(mr_radio_btn);
            fireEvent.change(first_name, {
                target: { value: 'test firstname' },
            });

            fireEvent.change(last_name, {
                target: { value: 'test lastname' },
            });

            fireEvent.change(date_of_birth, {
                target: { value: '2000-12-12' },
            });

            fireEvent.change(place_of_birth_mobile, {
                target: { value: 'Albania' },
            });

            fireEvent.change(citizenship, {
                target: { value: 'Albania' },
            });

            fireEvent.change(phone, {
                target: { value: '+49123456789012' },
            });
            fireEvent.change(tax_residence_mobile, {
                target: { value: 'Afghanistan' },
            });

            fireEvent.change(tax_identification_number, {
                target: { value: '123123123123' },
            });
            fireEvent.change(tax_identification_confirm, {
                target: { value: true },
            });

            fireEvent.change(account_opening_reason_mobile, {
                target: { value: 'Income Earning' },
            });
        });

        await act(async () => {
            expect(mr_radio_btn.checked).toEqual(true);
            const next_btn = screen.getByRole('button', { name: /next/i });

            expect(next_btn).toBeEnabled();
            fireEvent.click(next_btn);
        });

        await waitFor(() => {
            expect(new_props.onSubmit).toBeCalled();
        });
    });

    it('should save filled date when cancel button is clicked ', async () => {
        splitValidationResultTypes.mockReturnValue({ warnings: {}, errors: {} });
        const new_props = {
            ...props,
            value: {
                first_name: '',
                last_name: '',
            },
        };

        act(() => {
            renderwithRouter(<PersonalDetails {...new_props} />);
        });

        await act(async () => {
            const first_name = screen.getByTestId('first_name');
            const last_name = screen.getByTestId('last_name');

            fireEvent.change(first_name, {
                target: { value: 'test firstname' },
            });

            fireEvent.change(last_name, {
                target: { value: 'test lastname' },
            });
        });

        await act(async () => {
            const previous_btn = screen.getByRole('button', { name: /previous/i });
            expect(previous_btn).toBeEnabled();
            fireEvent.click(previous_btn);
        });

        await waitFor(() => {
            expect(props.onSave).toBeCalledWith(0, { first_name: 'test firstname', last_name: 'test lastname' });
        });
    });
});
