import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, Keyboard } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Shield } from 'lucide-react-native';

import ScreenWrapper from '../../components/ScreenWrapper';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { AuthStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type OTPRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

export default function OTPVerification() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<OTPRouteProp>();
    
    // Fallback if accessed directly without props
    const phone = route.params?.phone || 'Unknown Number';

    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all 4 digits are entered
        if (newOtp.every((digit) => digit !== '') && index === 3) {
            Keyboard.dismiss();
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = (otpValue?: string) => {
        const otpCode = otpValue || otp.join('');

        // Mock verification
        if (otpCode.length === 4) {
            // Assume RoleSelection is next
            navigation.navigate('RoleSelection');
        }
    };

    const isVerifyDisabled = otp.some((digit) => digit === '');

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.iconCircle}>
                        <Shield size={32} color="#FFF" />
                    </View>
                    <AppText variant="hero" align="center" style={styles.title}>
                        Verify OTP
                    </AppText>
                    <AppText variant="body" color={COLORS.textMuted} align="center">
                        Code sent to
                    </AppText>
                    <AppText variant="h2" weight="bold" align="center" style={styles.phoneText}>
                        {phone}
                    </AppText>
                </View>

                <AppCard style={styles.otpCard}>
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(el: TextInput | null) => { inputRefs.current[index] = el; }}
                                style={[
                                    styles.otpInput,
                                    digit ? styles.otpInputFilled : null,
                                ]}
                                maxLength={1}
                                keyboardType="number-pad"
                                value={digit}
                                onChangeText={(value) => handleChange(index, value)}
                                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                                placeholder="0"
                                placeholderTextColor={COLORS.textMuted + '80'}
                            />
                        ))}
                    </View>

                    <View style={styles.timerContainer}>
                        {timer > 0 ? (
                            <AppText variant="small" color={COLORS.textMuted} align="center">
                                Resend in {timer}s
                            </AppText>
                        ) : (
                            <AppButton
                                title="Resend OTP"
                                onPress={() => setTimer(30)}
                                variant="ghost"
                                textStyle={{ color: COLORS.infoBlue, fontSize: 16 }}
                            />
                        )}
                    </View>
                </AppCard>

                <View style={styles.footer}>
                    <AppButton
                        title="Verify & Continue"
                        onPress={() => handleVerify()}
                        disabled={isVerifyDisabled}
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
        backgroundColor: COLORS.statusPresent, // Matched with Figma's #16A34A (shield)
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        marginBottom: SPACING.xs,
    },
    phoneText: {
        marginTop: SPACING.xs,
    },
    otpCard: {
        paddingVertical: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    otpInput: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.textDark,
        backgroundColor: COLORS.cardBg,
    },
    otpInputFilled: {
        borderColor: COLORS.primary,
    },
    timerContainer: {
        minHeight: 40,
        justifyContent: 'center',
    },
    footer: {
        paddingBottom: SPACING.xl,
        paddingTop: SPACING.lg,
        marginTop: 'auto',
    },
});
