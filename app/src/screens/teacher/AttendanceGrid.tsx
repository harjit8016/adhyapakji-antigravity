import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { UserCheck, UserX, UserMinus, Save } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useMockApp } from '../../context/MockAppContext';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';

export default function AttendanceGrid() {
    const { t } = useLang();
    const { classStudents } = useMockApp();

    const [attendance, setAttendance] = useState<Record<string, string>>(() => {
        const init: Record<string, string> = {};
        classStudents.forEach((s: any) => init[s.id] = 'present');
        return init;
    });

    const toggleStatus = (id: string) => {
        setAttendance(prev => {
            const current = prev[id];
            if (current === 'present') return { ...prev, [id]: 'absent' };
            if (current === 'absent') return { ...prev, [id]: 'leave' };
            return { ...prev, [id]: 'present' };
        });
    };

    const markAll = (status: string) => {
        const next: Record<string, string> = {};
        classStudents.forEach((s: any) => next[s.id] = status);
        setAttendance(next);
    };

    const handleSave = () => {
        Alert.alert(t('save'), "Attendance saved successfully!");
    };

    const getStatusColor = (status: string) => {
        if (status === 'present') return COLORS.statusPresent;
        if (status === 'absent') return COLORS.statusAbsent;
        if (status === 'leave') return COLORS.statusLeave;
        return '#E5E7EB';
    };

    const getStatusBg = (status: string) => {
        if (status === 'present') return '#DCFCE7';
        if (status === 'absent') return '#FEE2E2';
        if (status === 'leave') return '#FEF3C7';
        return '#FFFFFF';
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{t('teacher_dashboard')}</Text>
                    <Text style={styles.headerSub}>Class 5A</Text>
                </View>

                <View style={styles.bulkRow}>
                    <TouchableOpacity style={[styles.bulkBtn, { backgroundColor: '#DCFCE7' }]} onPress={() => markAll('present')}>
                        <Text style={{ color: COLORS.statusPresent, fontWeight: 'bold' }}>{t('all_present')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bulkBtn, { backgroundColor: '#FEE2E2' }]} onPress={() => markAll('absent')}>
                        <Text style={{ color: COLORS.statusAbsent, fontWeight: 'bold' }}>{t('mark_absent_mode')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.grid}>
                    {classStudents.map((student: any) => {
                        const status = attendance[student.id];
                        const color = getStatusColor(status);
                        const bg = getStatusBg(status);

                        return (
                            <TouchableOpacity
                                key={student.id}
                                style={[styles.studentCard, { borderColor: color, backgroundColor: bg }]}
                                onPress={() => toggleStatus(student.id)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.avatar, { borderColor: color }]}>
                                    {status === 'present' && <UserCheck size={24} color={color} />}
                                    {status === 'absent' && <UserX size={24} color={color} />}
                                    {status === 'leave' && <UserMinus size={24} color={color} />}
                                </View>
                                <Text style={styles.roll}>{student.roll}</Text>
                                <Text style={styles.name} numberOfLines={1}>{student.name}</Text>
                                <View style={[styles.statusBadge, { borderColor: color }]}>
                                    <Text style={{ color: color, fontSize: 12, fontWeight: 'bold' }}>{t(status).toUpperCase()}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Save size={24} color={COLORS.textLight} />
                    <Text style={styles.saveBtnText}>{t('save')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SPACING.md,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: TYPOGRAPHY.h1,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    headerSub: {
        fontSize: TYPOGRAPHY.small,
        color: COLORS.textMuted,
    },
    bulkRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    bulkBtn: {
        flex: 1,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderRadius: RADIUS.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.md,
        justifyContent: 'space-between',
    },
    studentCard: {
        width: '48%',
        borderWidth: 2,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    roll: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    name: {
        fontSize: TYPOGRAPHY.small,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: SPACING.sm,
    },
    statusBadge: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 99,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.cardBg,
        padding: SPACING.md,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        gap: 8,
    },
    saveBtnText: {
        color: COLORS.textLight,
        fontWeight: 'bold',
        fontSize: TYPOGRAPHY.h2,
    }
});
