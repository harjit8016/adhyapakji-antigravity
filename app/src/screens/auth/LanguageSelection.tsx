import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Check } from 'lucide-react-native';

import ScreenWrapper from '../../components/ScreenWrapper';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { AuthStackParamList } from '../../types';

// Assuming English, Hindi, Punjabi for now based on reference app
type Language = 'english' | 'hindi' | 'punjabi';

const LANGUAGES: { value: Language; label: string }[] = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी' },
    { value: 'punjabi', label: 'ਪੰਜਾਬੀ' },
];

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'LanguageSelection'>;

export default function LanguageSelection() {
    const [selected, setSelected] = useState<Language>('english');
    const navigation = useNavigation<NavigationProp>();

    const handleContinue = () => {
        // TODO: Save to localized storage context or state manager
        navigation.navigate('RoleSelection'); // Or navigate to PhoneLogin depending on flow order, assume RoleSelection next for now or adjust
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <AppText variant="hero" align="center" style={styles.title}>
                        Choose Your Language
                    </AppText>
                    <AppText variant="body" color={COLORS.textMuted} align="center">
                        Select your preferred language
                    </AppText>
                </View>

                <View style={styles.listContainer}>
                    {LANGUAGES.map((lang) => {
                        const isSelected = selected === lang.value;
                        return (
                            <TouchableOpacity
                                key={lang.value}
                                activeOpacity={0.8}
                                onPress={() => setSelected(lang.value)}
                                style={styles.cardWrapper}
                            >
                                <AppCard
                                    noShadow
                                    style={[
                                        styles.langCard,
                                        isSelected && styles.langCardSelected,
                                    ]}
                                >
                                    <View style={styles.cardContent}>
                                        <AppText
                                            variant="h1"
                                            weight="500"
                                            color={isSelected ? COLORS.textDark : COLORS.textMuted}
                                        >
                                            {lang.label}
                                        </AppText>
                                        
                                        {isSelected && (
                                            <View style={styles.checkCircle}>
                                                <Check size={20} color="#FFF" />
                                            </View>
                                        )}
                                    </View>
                                </AppCard>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <AppButton
                        title="Continue"
                        onPress={handleContinue}
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
        marginTop: SPACING.xl * 2,
        marginBottom: SPACING.xl * 1.5,
    },
    title: {
        marginBottom: SPACING.sm,
    },
    listContainer: {
        flex: 1,
        gap: SPACING.md,
    },
    cardWrapper: {
        marginBottom: SPACING.md, // fallback gap
    },
    langCard: {
        borderWidth: 2,
        borderColor: COLORS.border,
        backgroundColor: COLORS.cardBg,
    },
    langCardSelected: {
        borderColor: COLORS.statusPresent,
        borderWidth: 4,
        elevation: 4,
        shadowColor: COLORS.statusPresent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.xs,
    },
    checkCircle: {
        backgroundColor: COLORS.statusPresent,
        borderRadius: RADIUS.full,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        paddingBottom: SPACING.xl,
        paddingTop: SPACING.md,
    },
});
