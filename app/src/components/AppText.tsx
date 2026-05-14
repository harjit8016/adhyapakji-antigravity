import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

/**
 * Core Application Typography Interface
 * Extends the React Native Text properties while enforcing the global
 * `theme.ts` sizing and color palettes to prevent ad-hoc styling.
 */
interface AppTextProps extends TextProps {
    /** Connects to the `TYPOGRAPHY` map in theme.ts */
    variant?: 'hero' | 'h1' | 'h2' | 'body' | 'base' | 'small';
    /** Enforces global `COLORS` usage */
    color?: string;
    /** Standardized font-weight strings */
    weight?: 'normal' | 'bold' | '500' | '600';
    align?: 'left' | 'center' | 'right';
}

/**
 * Standardized Application Text Node
 * 
 * Replaces generic `<Text>` tags across the application. 
 * Automatically applies padding resets (`includeFontPadding: false`) to ensure
 * text behaves consistently across Android, iOS, and Web rendering engines.
 */
export default function AppText({
    variant = 'body',
    color = COLORS.textDark,
    weight,
    align = 'left',
    style,
    ...props
}: AppTextProps) {
    return (
        <Text
            style={[
                styles.text,
                {
                    fontSize: TYPOGRAPHY[variant],
                    color,
                    textAlign: align,
                    fontWeight: weight || (variant === 'hero' || variant === 'h1' || variant === 'h2' ? 'bold' : 'normal')
                },
                style
            ]}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    text: {
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
});
