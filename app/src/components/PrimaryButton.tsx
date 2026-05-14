import React from 'react';
import AppButton from './AppButton';

interface PrimaryButtonProps {
    label: string;
    onPress: () => void;
    icon?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    style?: any;
}

/**
 * Standardized primary action button.
 * Wrapper around the core `AppButton` to maintain backwards compatibility while
 * ensuring all new design tokens are applied.
 */
export default function PrimaryButton({ label, onPress, icon, loading = false, disabled = false, style }: PrimaryButtonProps) {
    return (
        <AppButton
            title={label}
            onPress={onPress}
            icon={icon}
            loading={loading}
            disabled={disabled}
            variant="primary"
            style={style}
        />
    );
}

