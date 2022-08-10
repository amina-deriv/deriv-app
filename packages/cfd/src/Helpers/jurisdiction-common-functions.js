const onSelectRealAccount = () => {
    const type_of_account = {
        category: account_type.category,
        type: account_type.type,
    };

    if (is_eu) {
        if (poi_poa_verified) {
            openPasswordModal(type_of_account);
        } else {
            toggleCFDVerificationModal();
        }
    } else if (jurisdiction_selected_shortcode === 'svg') {
        if (account_type.type === 'financial' && poi_poa_verified && !has_submitted_personal_details) {
            toggleCFDPersonalDetailsModal();
        } else {
            openPasswordModal(type_of_account);
        }
    } else if (jurisdiction_selected_shortcode === 'vanuatu') {
        if (need_poi_for_vanuatu) {
            toggleCFDVerificationModal();
        } else if (poi_poa_verified) {
            // for bvi, labuan & vanuatu:
            if (!has_submitted_personal_details) {
                toggleCFDPersonalDetailsModal();
            } else {
                openPasswordModal(type_of_account);
            }
        } else {
            toggleCFDVerificationModal();
        }
    } else if (need_poi_for_bvi_labuan) {
        toggleCFDVerificationModal();
    } else if (poi_poa_verified) {
        if (!has_submitted_personal_details) {
            toggleCFDPersonalDetailsModal();
        } else {
            openPasswordModal(type_of_account);
        }
    } else {
        toggleCFDVerificationModal();
    }
};

const {
    need_poi_for_vanuatu,
    need_poi_for_bvi_labuan,
    need_poa_submission,
    poi_acknowledged_for_bvi_labuan,
    poi_acknowledged_for_vanuatu,
    poi_poa_none,
    poa_acknowledged,
    poa_poi_verified_for_labuan_bvi,
    poa_poi_verified_for_vanuatu,
} = getIdentityStatusInfo(account_status);

export const isNextButtonEnabled = ({ jurisdiction_selected_shortcode, is_checked }) => {
    if (jurisdiction_selected_shortcode) {
        if (jurisdiction_selected_shortcode === 'svg') {
            return true;
        } else if (jurisdiction_selected_shortcode === 'vanuatu') {
            return (
                (poi_poa_none ||
                    need_poi_for_vanuatu ||
                    need_poa_submission ||
                    (poa_poi_verified_for_vanuatu && is_checked)) &&
                !(poa_acknowledged && poi_acknowledged_for_vanuatu)
            );
        }
        return (
            (poi_poa_none ||
                need_poi_for_bvi_labuan ||
                need_poa_submission ||
                (poa_poi_verified_for_labuan_bvi && is_checked)) &&
            !(poa_acknowledged && poi_acknowledged_for_bvi_labuan)
        );
    }
    return false;
};
