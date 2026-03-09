import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CalendarPlus } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';

export default function HolidayManagement() {
    const { t } = useLang();
    const [holidays] = useState([
        { id: 1, name: 'Diwali', date: 'Nov 12', type: 'Festival' },
        { id: 2, name: 'Independence Day', date: 'Aug 15', type: 'Government' },
    ]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{t('holidays')}</Text>

            <TouchableOpacity style={styles.addBtn}>
                <CalendarPlus size={24} color={COLORS.textLight} />
                <Text style={styles.addBtnText}>Add New Holiday</Text>
            </TouchableOpacity>

            {holidays.map(h => (
                <View key={h.id} style={styles.card}>
                    <View>
                        <Text style={styles.hName}>{h.name}</Text>
                        <Text style={styles.hType}>{h.type}</Text>
                    </View>
                    <Text style={styles.hDate}>{h.date}</Text>
                </View>
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
        fontSize: TYPOGRAPHY.hero,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.textDark,
        marginBottom: SPACING.xl,
    },
    addBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.lg,
        gap: 8,
    },
    addBtnText: {
        color: COLORS.textLight,
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: COLORS.cardBg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    hName: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    hType: {
        fontSize: TYPOGRAPHY.small,
        color: COLORS.textMuted,
    },
    hDate: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: 'bold',
        color: COLORS.primary,
    }
});
