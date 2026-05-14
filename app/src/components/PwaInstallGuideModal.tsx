import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Animated, Platform } from 'react-native';
import { Share, PlusSquare, X } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import AppButton from './AppButton';

interface PwaInstallGuideModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function PwaInstallGuideModal({ visible, onClose }: PwaInstallGuideModalProps) {
    // We will build a lightweight looping animation to draw the user's eye to the steps
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (visible) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [visible, pulseAnim]);

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Install Adyapak Ji</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color={COLORS.textDark} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.description}>
                        Install this app on your device for fast, offline access. Just follow these 2 simple steps:
                    </Text>

                    <View style={styles.stepContainer}>
                        <View style={styles.stepIndicator}>
                            <Text style={styles.stepNumber}>1</Text>
                        </View>
                        <View style={styles.iconBox}>
                            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                <Share size={28} color={COLORS.primary} />
                            </Animated.View>
                        </View>
                        <View style={styles.stepTextWrap}>
                            <Text style={styles.stepTitle}>Tap the Share Icon</Text>
                            <Text style={styles.stepSub}>Located at the {Platform.OS === 'ios' ? 'bottom' : 'top'} of your Safari or Chrome browser.</Text>
                        </View>
                    </View>

                    <View style={styles.connector} />

                    <View style={styles.stepContainer}>
                        <View style={styles.stepIndicator}>
                            <Text style={styles.stepNumber}>2</Text>
                        </View>
                        <View style={styles.iconBox}>
                            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                <PlusSquare size={28} color={COLORS.primary} />
                            </Animated.View>
                        </View>
                        <View style={styles.stepTextWrap}>
                            <Text style={styles.stepTitle}>Add to Home Screen</Text>
                            <Text style={styles.stepSub}>Scroll down the menu and tap &apos;Add to Home Screen&apos;.</Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <AppButton title="Got it!" onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: COLORS.cardBg,
        borderTopLeftRadius: RADIUS.lg,
        borderTopRightRadius: RADIUS.lg,
        padding: SPACING.xl,
        paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    closeBtn: {
        padding: SPACING.xs,
    },
    description: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textMuted,
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    stepIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.textDark,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    stepNumber: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.bgLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    stepTextWrap: {
        flex: 1,
    },
    stepTitle: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 4,
    },
    stepSub: {
        fontSize: TYPOGRAPHY.small,
        color: COLORS.textMuted,
        lineHeight: 18,
    },
    connector: {
        width: 2,
        height: 20,
        backgroundColor: COLORS.bgLight,
        marginLeft: 11, // align with stepIndicator center
        marginVertical: 4,
    },
    footer: {
        marginTop: SPACING.xl,
    }
});
