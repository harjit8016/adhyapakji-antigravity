import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ClipboardList, CalendarDays, Mic } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';

export default function TeacherDashboard() {
    const { t } = useLang();
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('teacher_dashboard')}</Text>

            <View style={styles.grid}>
                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('AttendanceGrid')}>
                    <ClipboardList size={48} color={COLORS.primary} />
                    <Text style={styles.label}>{t('attendance')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('HolidayManagement')}>
                    <CalendarDays size={48} color={COLORS.primary} />
                    <Text style={styles.label}>{t('holidays')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.gridItem, { width: '100%' }]} onPress={() => navigation.navigate('TeacherAnnouncements')}>
                    <Mic size={48} color={COLORS.primary} />
                    <Text style={styles.label}>{t('announcements')}</Text>
                </TouchableOpacity>
            </View>
        </View>
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
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: SPACING.md,
    },
    gridItem: {
        width: '47%',
        backgroundColor: COLORS.cardBg,
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    label: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginTop: SPACING.md,
    }
});
