import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { IndianRupee, CheckCircle2, Clock, Save } from 'lucide-react-native';
import ClassSelector from '../../components/ClassSelector';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import type { ClassStudent } from '../../types';
import AppText from '../../components/AppText';

type FeeStatus = 'paid' | 'pending';
type FeeStateMap = Record<string, FeeStatus>;

export default function FeesCollectionScreen() {
    const { t } = useLang();

    const classStudents = useAppStore(state => state.classStudents);

    const [feeStatuses, setFeeStatuses] = useState<FeeStateMap>({});

    // Initialize mock fee status for the currently selected class
    useEffect(() => {
        const init: FeeStateMap = {};
        classStudents.forEach((s: ClassStudent) => {
            // Randomly assign some to pending, some to paid for demonstration
            init[s.id] = Math.random() > 0.5 ? 'paid' : 'pending';
        });
        setFeeStatuses(init);
    }, [classStudents]);

    const toggleStatus = (id: string) => {
        setFeeStatuses(prev => {
            const current = prev[id];
            return {
                ...prev,
                [id]: current === 'paid' ? 'pending' : 'paid'
            };
        });
    };

    const handleSave = () => {
        Alert.alert("Success", "Fee collection records updated!");
    };

    const getStatusColor = (status: FeeStatus) => {
        return status === 'paid' ? COLORS.success : '#F59E0B'; // Amber for pending
    };

    const getStatusBg = (status: FeeStatus) => {
        return status === 'paid' ? '#D1FAE5' : '#FEF3C7';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AppText variant="h1" weight="bold" color={COLORS.textLight} align="center" style={styles.headerTitle}>{t('collect_fees')}</AppText>
            </View>

            <View style={{ paddingHorizontal: SPACING.md }}>
                <ClassSelector />
            </View>

            <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                    <AppText variant="small" weight="bold" color={COLORS.textMuted} style={styles.summaryLabel}>{t('collected')}</AppText>
                    <AppText variant="hero" weight="bold" color={COLORS.success} style={styles.summaryCount}>
                        {Object.values(feeStatuses).filter(s => s === 'paid').length}
                    </AppText>
                </View>
                <View style={styles.summaryCard}>
                    <AppText variant="small" weight="bold" color={COLORS.textMuted} style={styles.summaryLabel}>{t('pending')}</AppText>
                    <AppText variant="hero" weight="bold" color="#F59E0B" style={styles.summaryCount}>
                        {Object.values(feeStatuses).filter(s => s === 'pending').length}
                    </AppText>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.listContainer}>
                {classStudents.map((student: ClassStudent) => {
                    const status = feeStatuses[student.id] || 'pending';
                    const color = getStatusColor(status);
                    const bg = getStatusBg(status);

                    return (
                        <TouchableOpacity
                            key={student.id}
                            style={[styles.studentCard]}
                            onPress={() => toggleStatus(student.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.avatar, { backgroundColor: bg }]}>
                                {status === 'paid' ? (
                                    <CheckCircle2 size={24} color={color} />
                                ) : (
                                    <Clock size={24} color={color} />
                                )}
                            </View>

                            <View style={styles.studentInfo}>
                                <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.name} numberOfLines={1}>{student.name}</AppText>
                                <AppText variant="small" color={COLORS.textMuted} style={styles.roll}>Roll: {student.roll}</AppText>
                            </View>

                            <View style={[styles.statusBadge, { backgroundColor: bg }]}>
                                <IndianRupee size={16} color={color} />
                                <AppText weight="bold" style={{ color: color }}>
                                    {status.toUpperCase()}
                                </AppText>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <TouchableOpacity style={styles.floatingSave} onPress={handleSave}>
                <Save size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: SPACING.lg,
        paddingTop: SPACING.xl,
        borderBottomLeftRadius: RADIUS.lg,
        borderBottomRightRadius: RADIUS.lg,
        marginBottom: SPACING.md,
    },
    headerTitle: {
    },
    summaryRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    summaryCard: {
        backgroundColor: COLORS.cardBg,
        width: '48%',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    summaryLabel: {
        textTransform: 'uppercase',
    },
    summaryCount: {
        marginTop: SPACING.xs,
    },
    listContainer: {
        paddingHorizontal: SPACING.md,
        paddingBottom: 100,
    },
    studentCard: {
        backgroundColor: COLORS.cardBg,
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    studentInfo: {
        flex: 1,
    },
    name: {
        marginBottom: 2,
    },
    roll: {
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
    },
    floatingSave: {
        position: 'absolute',
        bottom: SPACING.xl,
        right: SPACING.xl,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});
