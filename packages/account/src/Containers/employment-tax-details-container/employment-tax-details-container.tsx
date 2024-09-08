import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { FormikValues, useFormikContext } from 'formik';
import {
    EmploymentStatusField,
    TaxIdentificationNumberField,
    TaxResidenceField,
} from '../../Components/forms/form-fields';
import { isFieldImmutable } from '../../Helpers/utils';
import { Checkbox, useOnClickOutside } from '@deriv/components';
import { useTranslations } from '@deriv-com/translations';
import { getLegalEntityName } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { useResidenceList } from '@deriv/hooks';
import './employment-tax-details-container.scss';
import { TinValidations } from '@deriv/api/types';

type TEmploymentTaxDetailsContainerProps = {
    editable_fields: string[];
    parent_ref: React.RefObject<HTMLDivElement>;
    should_display_long_message?: boolean;
    handleChange: (value: string) => void;
    tin_validation_config: TinValidations;
    is_tin_autoset?: boolean;
};

const EmploymentTaxDetailsContainer = ({
    editable_fields,
    parent_ref,
    should_display_long_message,
    tin_validation_config,
    handleChange,
    is_tin_autoset,
}: TEmploymentTaxDetailsContainerProps) => {
    const { values, setFieldValue, touched, errors, setValues } = useFormikContext<FormikValues>();
    const { isDesktop } = useDevice();
    const { data: residence_list } = useResidenceList();
    const { localize } = useTranslations();

    const [is_tax_residence_popover_open, setIsTaxResidencePopoverOpen] = useState(false);
    const [is_tin_popover_open, setIsTinPopoverOpen] = useState(false);

    const tax_residence_ref = useRef<HTMLDivElement>(null);
    const tin_ref = useRef<HTMLDivElement>(null);

    const validateClickOutside = (event: MouseEvent) => {
        const target = event?.target as HTMLElement;
        if (target.tagName === 'A') {
            event?.stopPropagation();
            return false;
        }
        return !tax_residence_ref.current?.contains(target) && !tin_ref.current?.contains(target);
    };

    const closeToolTips = () => {
        setIsTaxResidencePopoverOpen(false);
        setIsTinPopoverOpen(false);
    };

    useEffect(() => {
        if (values.tax_residence) {
            const tax_residence = residence_list.find(item => item.text === values.tax_residence)?.value;
            if (tax_residence) {
                handleChange(tax_residence);
            }
        }
    }, [handleChange, values.tax_residence, residence_list]);

    useEffect(() => {
        if (!values.tax_residence || !values.tax_identification_number) {
            setFieldValue('tax_identification_confirm', false, true);
        }
    }, [values.tax_residence, values.tax_identification_number, setFieldValue]);

    useEffect(() => {
        const parent_element = parent_ref?.current;

        if (parent_element) {
            parent_element.addEventListener('scroll', closeToolTips);
        }

        return () => {
            if (parent_element) {
                parent_element.removeEventListener('scroll', closeToolTips);
            }
            setIsTaxResidencePopoverOpen(false);
            setIsTinPopoverOpen(false);
        };
    }, [parent_ref]);

    useEffect(() => {
        if (tin_validation_config) {
            // This is to trigger re-validation of TIN field when the validation config changes
            setFieldValue('tax_identification_number', values.tax_identification_number, true);
        }
    }, [tin_validation_config]);

    const is_tax_details_confirm_disabled = useMemo(
        () =>
            (isFieldImmutable('tax_identification_number', editable_fields) &&
                isFieldImmutable('tax_residence', editable_fields)) ||
            !values.tax_identification_number ||
            !values.tax_residence ||
            !!values.tin_skipped,
        [editable_fields, values.tax_identification_number, values.tax_residence, values.tin_skipped]
    );

    useOnClickOutside(tax_residence_ref, () => setIsTaxResidencePopoverOpen(false), validateClickOutside);

    useOnClickOutside(tin_ref, () => setIsTinPopoverOpen(false), validateClickOutside);

    const { tin_employment_status_bypass } = tin_validation_config;

    const should_show_no_tax_details_checkbox =
        !is_tin_autoset &&
        ((tin_employment_status_bypass?.includes(values.employment_status) && !!values.tax_residence) ||
            values.tin_skipped);

    const isFieldDisabled = (field_name: string) =>
        isFieldImmutable(field_name, editable_fields) || !!values.tin_skipped;

    return (
        <Fragment>
            <EmploymentStatusField required is_disabled={isFieldDisabled('employment_status')} />

            {should_show_no_tax_details_checkbox && (
                <Checkbox
                    name='tin_skipped'
                    className='employment_tax_detail_field-checkbox'
                    data-lpignore
                    onChange={() => {
                        const confirm_no_tax_details = values.tin_skipped ? 0 : 1;
                        setValues(
                            {
                                ...values,
                                tin_skipped: confirm_no_tax_details,
                                tax_identification_number: '',
                                tax_identification_confirm: false,
                            },
                            true
                        );
                    }}
                    value={values.tin_skipped}
                    label={localize('I do not have tax information')}
                    withTabIndex={0}
                    data-testid='tin_skipped'
                    label_font_size={!isDesktop ? 'xxs' : 'xs'}
                    label_line_height='m'
                />
            )}
            <div ref={tax_residence_ref} className='account-form__fieldset'>
                <TaxResidenceField
                    disabled={isFieldDisabled('tax_residence')}
                    is_tax_residence_popover_open={is_tax_residence_popover_open}
                    setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                    setIsTinPopoverOpen={setIsTinPopoverOpen}
                    required={should_display_long_message && !values.tin_skipped}
                />
            </div>
            <div ref={tin_ref} className='account-form__fieldset'>
                <TaxIdentificationNumberField
                    disabled={isFieldDisabled('tax_identification_number')}
                    is_tin_popover_open={is_tin_popover_open}
                    setIsTinPopoverOpen={setIsTinPopoverOpen}
                    setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                    required={should_display_long_message && !values.tin_skipped}
                />
            </div>
            {!is_tin_autoset && (
                <Checkbox
                    name='tax_identification_confirm'
                    className='employment_tax_detail_field-checkbox'
                    data-lpignore
                    onChange={() =>
                        setFieldValue('tax_identification_confirm', !values.tax_identification_confirm, true)
                    }
                    value={values.tax_identification_confirm}
                    label={
                        should_display_long_message
                            ? localize(
                                  'I hereby confirm that the tax information provided is true and complete. I will also inform {{legal_entity_name}} about any changes to this information.',
                                  {
                                      legal_entity_name: getLegalEntityName('maltainvest'),
                                  }
                              )
                            : localize('I confirm that my tax information is accurate and complete.')
                    }
                    withTabIndex={0}
                    data-testid='tax_identification_confirm'
                    has_error={!!(touched.tax_identification_confirm && errors.tax_identification_confirm)}
                    label_font_size={!isDesktop ? 'xxs' : 'xs'}
                    label_line_height='m'
                    disabled={is_tax_details_confirm_disabled}
                />
            )}
        </Fragment>
    );
};

export default EmploymentTaxDetailsContainer;
