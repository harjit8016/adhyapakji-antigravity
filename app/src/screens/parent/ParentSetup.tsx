import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserPlus } from 'lucide-react-native';

import ScreenWrapper from '../../components/ScreenWrapper';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { ParentStackParamList } from '../../types'; // Will need to define

type NavigationProp = NativeStackNavigationProp<ParentStackParamList, 'ParentSetup'>;

export default function ParentSetup() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.centerContent}>
                <View style={styles.iconCircle}>
                    <UserPlus size={48} color={COLORS.primary} />
                </View>
                
                <AppText variant="hero" weight="bold" align="center" style={styles.title}>
                    Welcome to SchoolConnect!
                </AppText>
                
                <AppText variant="body" color={COLORS.textMuted} align="center" style={styles.subtitle}>
                    Let&apos;s get started by linking your child&apos;s student account
                </AppText>

                <View style={styles.buttonContainer}>
                    <AppButton
                        title="+ Add Child"
                        onPress={() => navigation.navigate('LinkChild')}
                        variant="primary"
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.cardBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    title: {
        marginBottom: SPACING.sm,
    },
    subtitle: {
        marginBottom: SPACING.xl * 1.5,
        paddingHorizontal: SPACING.md,
    },
    buttonContainer: {
        width: '100%',
    },
});
