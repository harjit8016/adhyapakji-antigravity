import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CheckCircle2, Clock, Paperclip } from 'lucide-react-native';

import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';

export default function HomeworkDetail({ route, navigation }: any) {
    const { homeworkId } = route.params;
    const homework = useAppStore(state => state.homework.find(h => h.id === homeworkId));
    const setHomeworkStatus = useAppStore(state => state.setHomeworkStatus);

    if (!homework) {
        return (
            <View style={styles.errorContainer}>
                <AppText>Homework not found.</AppText>
            </View>
        );
    }

    const dueDate = new Date(homework.dueDate);
    const today = new Date('2026-10-15'); // using fixed mock
    const isOverdue = dueDate < today && !homework.completed;
    const isCompleted = homework.completed;

    const handleToggleComplete = () => {
        setHomeworkStatus(homeworkId, !isCompleted);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            
            {/* Subject Badge */}
            <View style={styles.headerRow}>
                <View style={styles.subjectBadge}>
                    <AppText weight="bold" color={COLORS.primary} style={styles.subjectText}>
                        {homework.subject}
                    </AppText>
                </View>

                {isCompleted && (
                    <View style={styles.completedBadge}>
                        <CheckCircle2 size={18} color={COLORS.success} />
                        <AppText weight="bold" color={COLORS.success} style={{ marginLeft: 4 }}>
                            Completed
                        </AppText>
                    </View>
                )}
            </View>

            {/* Title */}
            <AppText variant="h1" weight="bold" color={COLORS.textDark} style={styles.title}>
                {homework.title}
            </AppText>

            {/* Due Date Card */}
            <AppCard style={[styles.dateCard, isOverdue ? styles.dateCardOverdue : null]}>
                <View style={styles.dateRow}>
                    <Clock size={24} color={isOverdue ? '#DC2626' : COLORS.textMuted} />
                    <View style={styles.dateInfo}>
                        <AppText variant="small" color={COLORS.textMuted}>Due Date</AppText>
                        <AppText weight="bold" color={isOverdue ? '#DC2626' : COLORS.textDark}>
                            {homework.dueDate} {isOverdue ? '(Overdue)' : ''}
                        </AppText>
                    </View>
                </View>
            </AppCard>

            {/* Instructions */}
            <AppCard style={styles.instructionsCard}>
                <AppText weight="bold" color={COLORS.textDark} style={styles.sectionTitle}>
                    Instructions
                </AppText>
                <AppText style={styles.instructionsText}>
                    {homework.description}
                </AppText>
            </AppCard>

            {/* Mock Attachments */}
            {homework.attachments && homework.attachments.length > 0 && (
                <AppCard style={styles.attachmentCard}>
                    <AppText weight="bold" color={COLORS.textDark} style={styles.sectionTitle}>
                        Attachments
                    </AppText>
                    {homework.attachments.map((att: any, idx: number) => (
                        <View key={idx} style={styles.attachmentItem}>
                            <Paperclip size={20} color={COLORS.textMuted} />
                            <AppText style={styles.attachmentText}>Attachment {idx + 1}</AppText>
                            <AppButton title="View" onPress={() => {}} variant="outline" size="small" />
                        </View>
                    ))}
                </AppCard>
            )}

            {/* Mock Teacher Notes/Image */}
            <AppCard style={styles.notesCard}>
                <AppText weight="bold" color={COLORS.textDark} style={styles.sectionTitle}>
                    Teacher&apos;s Notes
                </AppText>
                <View style={styles.placeholderBox}>
                    <AppText variant="small" color={COLORS.textMuted} align="center">
                        Blackboard/Worksheet image would appear here
                    </AppText>
                </View>
            </AppCard>

            {/* Action Button */}
            <AppButton
                title={isCompleted ? "Mark as Incomplete" : "Mark as Done"}
                variant={isCompleted ? "secondary" : "primary"}
                onPress={handleToggleComplete}
                style={styles.actionBtn}
                textStyle={{ fontSize: 16 }}
            />
            
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    subjectBadge: {
        backgroundColor: COLORS.infoBlueBg,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
    },
    subjectText: {
        fontSize: 16,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: SPACING.xl,
    },
    dateCard: {
        padding: SPACING.md,
        marginBottom: SPACING.lg,
    },
    dateCardOverdue: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
        borderWidth: 2,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    dateInfo: {
        flex: 1,
    },
    instructionsCard: {
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        marginBottom: SPACING.md,
        fontSize: 16,
    },
    instructionsText: {
        lineHeight: 24,
        color: COLORS.textDark,
    },
    attachmentCard: {
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgLight,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
    },
    attachmentText: {
        flex: 1,
        marginLeft: SPACING.sm,
    },
    notesCard: {
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    placeholderBox: {
        backgroundColor: COLORS.bgLight,
        padding: SPACING.xl,
        borderRadius: RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.textMuted,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionBtn: {
        width: '100%',
        paddingVertical: SPACING.md,
    }
});
