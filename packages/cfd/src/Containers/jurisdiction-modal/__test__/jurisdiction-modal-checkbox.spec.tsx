import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JurisdictionModalCheckbox from '../jurisdiction-modal-checkbox';
import RootStore from 'Stores/index';
import { Jurisdiction } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('JurisdictionModalCheckbox', () => {
    const mock_store = {
        client: {},
        common: {},
        ui: {},
    };
    const mockRootStore = new RootStore(mock_store);

    const mock_props = {
        class_name: '',
        is_checked: false,
        jurisdiction_selected_shortcode: '',
        onCheck: jest.fn(),
        context: mockRootStore,
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: false,
    };

    const renderComponent = (props = mock_props) => {
        render(
            <StoreProvider store={mockStore({})}>
                <JurisdictionModalCheckbox {...props} />
            </StoreProvider>
        );
    };

    it('should not render JurisdictionModalCheckbox when jurisdiction is not selected', () => {
        renderComponent({ ...mock_props });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render labuan account and displays checkbox', () => {
        renderComponent({ ...mock_props, jurisdiction_selected_shortcode: Jurisdiction.LABUAN });
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for labuan account', () => {
        renderComponent({ ...mock_props, jurisdiction_selected_shortcode: Jurisdiction.LABUAN });
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render svg account without displaying checkbox', () => {
        renderComponent({ ...mock_props, jurisdiction_selected_shortcode: Jurisdiction.SVG });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render bvi account without restriction and displays checkbox', () => {
        renderComponent({ ...mock_props, jurisdiction_selected_shortcode: Jurisdiction.BVI });
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for bvi account without restriction', () => {
        renderComponent({ ...mock_props, jurisdiction_selected_shortcode: Jurisdiction.BVI });
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render bvi account with restriction and does not display checkbox', () => {
        renderComponent({
            ...mock_props,
            jurisdiction_selected_shortcode: Jurisdiction.BVI,
            should_restrict_bvi_account_creation: true,
        });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('should render vanuatu account without restriction and displays checkbox', () => {
        renderComponent({
            ...mock_props,
            jurisdiction_selected_shortcode: Jurisdiction.VANUATU,
        });
        expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('should render function onCheck when checkbox is clicked for vanuatu account without restriction', () => {
        renderComponent({
            ...mock_props,
            jurisdiction_selected_shortcode: Jurisdiction.VANUATU,
        });
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mock_props.onCheck).toHaveBeenCalled();
    });

    it('should render vanuatu account with restriction and does not display checkbox', () => {
        renderComponent({
            ...mock_props,
            jurisdiction_selected_shortcode: Jurisdiction.VANUATU,
            should_restrict_vanuatu_account_creation: true,
        });
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
});
