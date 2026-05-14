import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewProps, TouchableOpacityProps } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

interface AppCardProps extends TouchableOpacityProps {
    padding?: keyof typeof SPACING;
    noShadow?: boolean;
}

export default function AppCard({
    padding = 'lg',
    noShadow = false,
    style,
    children,
    onPress,
    ...props
}: AppCardProps) {
    const cardStyle = [
        styles.card,
        { padding: SPACING[padding] },
        !noShadow && styles.shadow,
        style
    ];

    if (onPress) {
        return (
            <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8} {...props}>
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={cardStyle} {...(props as ViewProps)}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.lg,
    },
    shadow: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});
