import React, { useState } from 'react';
import { View, Modal, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useLang } from '../context/LanguageContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import AppText from './AppText';
import HeaderButton from './HeaderButton';

const LANGUAGES = [
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'English' },
];

export default function LanguageSwitcher({ showMargin = true }: { showMargin?: boolean }) {
    const { lang, setLang, t } = useLang();
    const [visible, setVisible] = useState(false);

    const currentLabel = LANGUAGES.find(l => l.code === lang)?.label || 'English';

    const handleSelect = (code: string) => {
        setLang(code);
        setVisible(false);
    };

    return (
        <>
            <HeaderButton
                onPress={() => setVisible(true)}
                position="left"
                style={!showMargin && { marginLeft: 0 }}
                icon={
                    <AppText color={COLORS.textLight} weight="bold" variant="h2">
                        {currentLabel}
                    </AppText>
                }
            />

            {visible && (
                <Modal
                    visible={visible}
                    animationType="slide"
                    presentationStyle="pageSheet"
                    onRequestClose={() => setVisible(false)}
                >
                    <SafeAreaView style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <AppText variant="hero" color={COLORS.textDark}>{t('select_language')}</AppText>
                            <Pressable onPress={() => setVisible(false)} style={styles.closeBtn}>
                                <X size={28} color={COLORS.textDark} />
                            </Pressable>
                        </View>

                        <View style={styles.modalContent}>
                            {LANGUAGES.map((l) => {
                                const isActive = lang === l.code;
                                return (
                                    <Pressable
                                        key={l.code}
                                        style={[styles.langBtn, isActive && styles.langBtnActive]}
                                        onPress={() => handleSelect(l.code)}
                                    >
                                        <AppText
                                            style={styles.langBtnText}
                                            color={isActive ? COLORS.primary : COLORS.textDark}
                                            weight="bold"
                                            align="center"
                                        >
                                            {l.label}
                                        </AppText>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </SafeAreaView>
                </Modal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.xl,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.bgLight,
    },
    closeBtn: {
        padding: SPACING.xs,
    },
    modalContent: {
        flex: 1,
        padding: SPACING.xl,
        justifyContent: 'center',
        gap: SPACING.xl,
    },
    langBtn: {
        backgroundColor: COLORS.cardBg,
        paddingVertical: SPACING.xl * 1.5,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    langBtnActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.infoBlueBg,
    },
    langBtnText: {
        fontSize: 40,
    },
});
