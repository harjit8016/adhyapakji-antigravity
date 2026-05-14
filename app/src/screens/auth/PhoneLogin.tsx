import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Phone, Delete } from 'lucide-react-native';

import ScreenWrapper from '../../components/ScreenWrapper';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { AuthStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'PhoneLogin'>;

export default function PhoneLogin() {
    const [phone, setPhone] = useState('');
    const navigation = useNavigation<NavigationProp>();

    const handleGetOTP = () => {
        if (phone.length === 10) {
            // In a real app, integrate an API call here.
            navigation.navigate('OTPVerification', { phone });
        }
    };

    const handleNumberClick = (num: string) => {
        if (phone.length < 10) {
            setPhone(phone + num);
        }
    };

    const handleBackspace = () => {
        setPhone(phone.slice(0, -1));
    };

    const keypadNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.iconCircle}>
                        <Phone size={32} color="#FFF" />
                    </View>
                    <AppText variant="hero" align="center" style={styles.title}>
                        Enter Mobile Number
                    </AppText>
                    <AppText variant="body" color={COLORS.textMuted} align="center">
                        We&apos;ll send you a verification code
                    </AppText>
                </View>

                <AppCard style={styles.numberCard}>
                    <AppText variant="small" color={COLORS.textMuted} align="center" style={styles.numberLabel}>
                        Mobile Number
                    </AppText>
                    <View style={styles.numberDisplay}>
                        <AppText variant="h1" align="center" weight="bold" style={styles.phoneText}>
                            {phone || '_ _ _ _ _ _ _ _ _ _'}
                        </AppText>
                    </View>
                </AppCard>

                <View style={styles.keypadContainer}>
                    {keypadNumbers.map((num) => (
                        <TouchableOpacity
                            key={num}
                            style={styles.keyButton}
                            onPress={() => handleNumberClick(num)}
                            activeOpacity={0.7}
                        >
                            <AppText variant="h1" weight="bold">{num}</AppText>
                        </TouchableOpacity>
                    ))}
                    
                    {/* Bottom Row */}
                    <TouchableOpacity
                        style={[styles.keyButton, styles.funcButton]}
                        onPress={handleBackspace}
                        activeOpacity={0.7}
                    >
                        <Delete size={28} color={COLORS.textMuted} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.keyButton}
                        onPress={() => handleNumberClick('0')}
                        activeOpacity={0.7}
                    >
                        <AppText variant="h1" weight="bold">0</AppText>
                    </TouchableOpacity>
                    
                    {/* Empty cell to balance grid */}
                    <View style={styles.keyButtonEmpty} />
                </View>

                <View style={styles.footer}>
                    <AppButton
                        title="Get OTP"
                        onPress={handleGetOTP}
                        disabled={phone.length !== 10}
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
        paddingHorizontal: SPACING.lg,
    },
    headerContainer: {
        marginTop: SPACING.xl,
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.infoBlue,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        marginBottom: SPACING.xs,
    },
    numberCard: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    numberLabel: {
        marginBottom: SPACING.sm,
    },
    numberDisplay: {
        minHeight: 48,
        justifyContent: 'center',
    },
    phoneText: {
        letterSpacing: 2,
    },
    keypadContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: SPACING.md,
        marginHorizontal: SPACING.md, // Brings the keypad in slightly compared to edges
    },
    keyButton: {
        width: '30%', // 3 columns
        aspectRatio: 1.5,
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    funcButton: {
        backgroundColor: COLORS.bgLight,
    },
    keyButtonEmpty: {
        width: '30%',
    },
    footer: {
        paddingBottom: SPACING.xl,
        paddingTop: SPACING.lg,
        marginTop: 'auto', // Pushes button to bottom
    },
});
