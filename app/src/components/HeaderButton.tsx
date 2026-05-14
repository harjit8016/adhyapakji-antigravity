import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SPACING } from '../constants/theme';

interface HeaderButtonProps {
    onPress: () => void;
    icon: React.ReactNode;
    position?: 'left' | 'right';
    style?: any;
}

/**
 * Specialized button for the Navigation Bar.
 * Guarantees zero background, zero border radius, and zero elevation.
 */
export default function HeaderButton({
    onPress,
    icon,
    position = 'right',
    style
}: HeaderButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                position === 'left' ? { marginLeft: SPACING.md } : { marginRight: SPACING.md },
                pressed && { opacity: 0.5 },
                style
            ]}
        >
            {icon}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        padding: SPACING.xs,
        borderRadius: 0,
        borderWidth: 0,
        elevation: 0, // Critical for Android shadow removal
        shadowOpacity: 0, // Critical for iOS shadow removal
    },
});
