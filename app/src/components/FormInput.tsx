import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';

interface FormInputProps {
    label: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    icon?: React.ReactNode;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    multiline?: boolean;
    maxLength?: number;
}

/**
 * Standardized text input with label, optional icon, and themed styling.
 * Use this across all forms for consistent look and feel.
 */
export default function FormInput({
    label,
    placeholder,
    value,
    onChangeText,
    icon,
    keyboardType = 'default',
    multiline = false,
    maxLength,
}: FormInputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrapper, multiline && { alignItems: 'flex-start' }]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={[styles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    maxLength={maxLength}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: TYPOGRAPHY.small,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.textMuted + '40',
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.bgLight,
    },
    iconContainer: {
        paddingLeft: SPACING.sm,
        paddingRight: SPACING.xs,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textDark,
    },
});
