import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, View } from 'react-native';
import AppText from './AppText';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

/**
 * Core Application Button Interface
 * 
 * Defines the strict properties allowed when rendering an application button.
 * Relies on the global `theme.ts` for consistent radius, spacing, and colors.
 */
interface AppButtonProps {
    /** The primary text rendered inside the button */
    title: string;
    /** Callback triggered on press (disabled if loading or disabled) */
    onPress: () => void;
    /** 
     * Visual hierarchy variant:
     * - primary: Solid blue background
     * - secondary: Solid secondary color background
     * - outline: Transparent background with primary border
     * - ghost: Transparent background, minimal padding, no border
     */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    /** Injects an ActivityIndicator and disables interactions when true */
    loading?: boolean;
    /** Manually disables touch interactions and fades opacity */
    disabled?: boolean;
    /** Optional Lucide icon to render alongside the text */
    icon?: React.ReactNode;
    /** Optional size variant: 'small' reduces padding for compact contexts */
    size?: 'small' | 'medium' | 'large';
    /** Optional overrides for the outer bounding box */
    style?: any;
    /** Optional overrides for the inner typography */
    textStyle?: any;
}

/**
 * Standardized Application Button
 * 
 * Replaces generic `<TouchableOpacity>` tags across the application.
 * Automatically handles Loading Spinners, Disabled Opacity states, and 
 * strict padding/typography alignments.
 */
export default function AppButton({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    icon,
    size,
    style,
    textStyle,
}: AppButtonProps) {
    const isGhost = variant === 'ghost';
    const isOutline = variant === 'outline';

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.button,
                styles[variant],
                size === 'small' && styles.sizeSmall,
                pressed && styles.pressed,
                (disabled || loading) && styles.disabled,
                style,
            ]}
        >
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator color={isOutline || isGhost ? COLORS.primary : '#FFF'} />
                ) : (
                    <>
                        {icon && <View style={styles.iconContainer}>{icon}</View>}
                        <AppText
                            color={isOutline || isGhost ? COLORS.primary : COLORS.textLight}
                            weight="bold"
                            variant="h2"
                            style={textStyle}
                        >
                            {title}
                        </AppText>
                    </>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: COLORS.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
        padding: SPACING.sm,
        minHeight: 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    iconContainer: {
        marginRight: 4,
    },
    pressed: {
        opacity: 0.7,
    },
    sizeSmall: {
        padding: SPACING.sm,
        minHeight: 36,
    },
    disabled: {
        opacity: 0.5,
    },
});
