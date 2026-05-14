import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { GraduationCap } from 'lucide-react-native';
import AppText from '../../components/AppText';
import { COLORS } from '../../constants/theme';

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const logoScale = useRef(new Animated.Value(0.6)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const subOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Staggered entrance animation
        Animated.sequence([
            Animated.parallel([
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 60,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]),
            Animated.stagger(150, [
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(subOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Auto-navigate after 2.4s
        const timer = setTimeout(() => {
            onFinish();
        }, 2400);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            {/* Background gradient overlay via nested views */}
            <View style={styles.gradientTop} />
            <View style={styles.gradientBottom} />

            <View style={styles.content}>
                {/* Animated Logo */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        { opacity: logoOpacity, transform: [{ scale: logoScale }] }
                    ]}
                >
                    <GraduationCap size={72} color={COLORS.cardBg} strokeWidth={1.5} />
                </Animated.View>

                {/* App Name */}
                <Animated.View style={{ opacity: textOpacity, marginTop: 24 }}>
                    <AppText
                        variant="hero"
                        weight="bold"
                        align="center"
                        color={COLORS.cardBg}
                        style={styles.appName}
                    >
                        ਅਧਿਆਪਕ ਜੀ
                    </AppText>
                    <AppText
                        variant="body"
                        align="center"
                        color={COLORS.cardBg}
                        style={{ opacity: 0.85, letterSpacing: 1 }}
                    >
                        Adyapak Ji
                    </AppText>
                </Animated.View>

                {/* Tagline */}
                <Animated.View style={{ opacity: subOpacity, marginTop: 12 }}>
                    <AppText
                        variant="small"
                        align="center"
                        color={COLORS.cardBg}
                        style={{ opacity: 0.7 }}
                    >
                        Bridging Parents & Teachers
                    </AppText>
                </Animated.View>
            </View>

            {/* Bottom version / branding strip */}
            <View style={styles.footer}>
                <AppText
                    variant="small"
                    color={COLORS.cardBg}
                    align="center"
                    style={{ opacity: 0.5 }}
                >
                    School Connect v1.0
                </AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientTop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#1e40af',
        opacity: 0.35,
        borderBottomLeftRadius: 9999,
        borderBottomRightRadius: 9999,
        top: '-40%',
        left: '-20%',
        right: '-20%',
        height: '80%',
    },
    gradientBottom: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#1d4ed8',
        opacity: 0.2,
        borderTopLeftRadius: 9999,
        borderTopRightRadius: 9999,
        bottom: '-40%',
        left: '-20%',
        right: '-20%',
        height: '60%',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 140,
        height: 140,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    appName: {
        fontSize: 38,
        lineHeight: 46,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
    },
});
