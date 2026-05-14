import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CalendarPlus } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING } from '../../constants/theme';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';

export default function HolidayManagement() {
    const { t } = useLang();
    const navigation = useNavigation<any>();
    const { holidays } = useAppStore();

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <AppText variant="hero" align="center" style={styles.title}>
                {t('holidays')}
            </AppText>

            <AppButton
                title={t('add_holiday') || 'Add New Holiday'}
                onPress={() => navigation.navigate('AddHoliday')}
                icon={<CalendarPlus size={24} color={COLORS.textLight} />}
                style={styles.addBtn}
            />

            {holidays.map(h => (
                <AppCard key={h.id} style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={{ flex: 1 }}>
                            <AppText variant="h1" color={COLORS.textDark}>{h.name}</AppText>
                            <AppText color={COLORS.textMuted}>{t(h.type) || h.type}</AppText>
                        </View>
                        <AppText variant="h2" weight="bold" color={COLORS.primary}>
                            {h.date}
                        </AppText>
                    </View>
                </AppCard>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
        padding: SPACING.md,
    },
    title: {
        marginBottom: SPACING.xl,
    },
    addBtn: {
        marginBottom: SPACING.lg,
    },
    card: {
        marginBottom: SPACING.md,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});
