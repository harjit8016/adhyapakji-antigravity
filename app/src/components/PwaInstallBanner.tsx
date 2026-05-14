import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { Download, X } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import AppButton from './AppButton';
import PwaInstallGuideModal from './PwaInstallGuideModal';

export default function PwaInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        // This feature is highly web-specific
        if (Platform.OS !== 'web') return;

        // Check if we are already running as an installed PWA
        const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
        const isIosStandalone = (window.navigator as any).standalone === true;

        if (!isStandalone && !isIosStandalone && !isDismissed) {
            setIsVisible(true);
        }

        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            // Hide the app-provided install promotion
            setIsVisible(false);
            // Clear the deferredPrompt so it can be garbage collected
            setDeferredPrompt(null);
            console.log('Adyapak Ji was successfully installed.');
        };

        // Standard Chrome/Edge PWA Event
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [isDismissed]);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Show the native Chromium install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);

            // We've used the prompt, and can't use it again, throw it away
            setDeferredPrompt(null);
            setIsVisible(false);
        } else {
            // Show our custom instructional guide modal instead of a generic window.alert
            setShowGuide(true);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true); // Don't show it again this session
    };

    if (Platform.OS !== 'web' || !isVisible) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.banner}>
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Download size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Install Adyapak Ji</Text>
                        <Text style={styles.subtitle}>Add to your home screen for quick offline access.</Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={handleDismiss} style={styles.dismissBtn}>
                        <X size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                    <View style={styles.installBtnWrap}>
                        <AppButton title="INSTALL" onPress={handleInstallClick} />
                    </View>
                </View>
            </View>

            <PwaInstallGuideModal
                visible={showGuide}
                onClose={() => setShowGuide(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999, // Extremely high to sit globally over navigation headers
        padding: SPACING.md,
    },
    banner: {
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.lg, // Give it breathing room below browser notch
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        flexWrap: 'wrap', // Allow wrap on very thin mobile web browsers
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        minWidth: 200,
    },
    iconContainer: {
        backgroundColor: COLORS.bgLight,
        padding: SPACING.sm,
        borderRadius: RADIUS.full,
        marginRight: SPACING.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.small,
        color: COLORS.textMuted,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Platform.select({ web: 0, default: SPACING.sm }),
    },
    dismissBtn: {
        padding: SPACING.sm,
        marginRight: SPACING.sm,
    },
    installBtnWrap: {
        minWidth: 100, // keep the INSTALL button solidly sized
    }
});
