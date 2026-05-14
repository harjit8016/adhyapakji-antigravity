import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { BookOpen, CheckCircle2, CalendarDays, ChevronRight } from 'lucide-react-native';

import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import type { Homework } from '../../types';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';

export default function HomeworkScreen({ navigation }: any) {
    const { t } = useLang();

    const homework = useAppStore(state => state.homework);
    const myChildren = useAppStore(state => state.myChildren);
    const activeStudentId = useAppStore(state => state.activeStudentId);

    const activeStudent = myChildren.find((c: any) => c.id === activeStudentId) || myChildren[0];

    // Filter homework
    const studentHomework = homework.filter((h: any) => h.classId === activeStudent.classId);

    // Helper to determine if homework is overdue based on mock dates
    // For a real app, this would compare with actual new Date()
    const isOverdue = (dueDateStr: string) => {
        const dueDate = new Date(dueDateStr);
        const today = new Date('2026-10-15'); // Using fixed mock 'today'
        return dueDate < today;
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            {/* Title */}
            <AppText variant="h1" weight="bold" color={COLORS.textDark} style={styles.title}>
                {t('homework')}
            </AppText>

            {studentHomework.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <CheckCircle2 size={64} color={COLORS.success} />
                    <AppText variant="h1" weight="bold" color={COLORS.textDark} style={styles.emptyText}>All caught up!</AppText>
                    <AppText variant="body" color={COLORS.textMuted} style={styles.emptySubText}>No pending homework</AppText>
                </View>
            ) : (
                studentHomework.map((item: Homework) => {
                    const overdue = isOverdue(item.dueDate);
                    const isCompleted = item.completed;
                    return (
                        <AppCard key={item.id} style={styles.card} onPress={() => navigation.navigate('HomeworkDetail', { homeworkId: item.id })}>
                            <View style={styles.cardHeader}>
                                <View style={styles.subjectRow}>
                                    <View style={styles.subjectChip}>
                                        <BookOpen size={16} color={COLORS.primary} />
                                        <AppText variant="body" weight="bold" style={styles.subjectText}>{item.subject}</AppText>
                                    </View>
                                    {isCompleted && (
                                        <View style={styles.completedRow}>
                                            <CheckCircle2 size={16} color={COLORS.success} />
                                            <AppText variant="small" weight="bold" color={COLORS.success}>Done</AppText>
                                        </View>
                                    )}
                                </View>
                                <View style={[styles.dateChip, overdue && !isCompleted && styles.dateChipOverdue]}>
                                    <CalendarDays size={14} color={(overdue && !isCompleted) ? '#EF4444' : COLORS.textMuted} />
                                    <AppText variant="small" style={[styles.dateText, (overdue && !isCompleted) && styles.dateTextOverdue]}>
                                        Due: {item.dueDate}
                                    </AppText>
                                </View>
                            </View>

                            <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.cardTitle}>{item.title}</AppText>
                            <AppText variant="body" color={COLORS.textMuted} numberOfLines={2} style={styles.cardDesc}>{item.description}</AppText>

                            <View style={styles.footerAction}>
                                <AppText weight="bold" color={COLORS.primary}>View Details</AppText>
                                <ChevronRight size={18} color={COLORS.primary} />
                            </View>
                        </AppCard>
                    );
                })
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xl * 2,
    },
    title: {
        marginBottom: SPACING.lg,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.lg,
    },
    emptyText: {
        marginTop: SPACING.md,
    },
    emptySubText: {
        marginTop: SPACING.xs,
    },
    card: {
        padding: SPACING.lg,
        marginBottom: SPACING.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    subjectRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    subjectChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.infoBlueBg,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.sm,
        gap: 6,
    },
    subjectText: {
        color: COLORS.primary,
    },
    completedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateChipOverdue: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.sm,
    },
    dateText: {
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    dateTextOverdue: {
        color: '#EF4444',
        fontWeight: 'bold',
    },
    cardTitle: {
        marginBottom: SPACING.sm,
    },
    cardDesc: {
        lineHeight: 22,
        marginBottom: SPACING.lg,
    },
    footerAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: SPACING.xs,
    }
});
