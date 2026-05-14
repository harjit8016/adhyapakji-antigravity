import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';

export default function ClassSelection({ navigation }: any) {
    const teacherClasses = useAppStore(state => state.teacherClasses);
    const setActiveTeacherClassId = useAppStore(state => state.setActiveTeacherClassId);

    const handleSelectClass = (classId: string) => {
        setActiveTeacherClassId(classId);
        // For now, redirecting directly to AttendanceGrid to match Figma's intent, 
        // but it could also just set active class and go back to dashboard.
        navigation.navigate('AttendanceGrid'); 
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            
            <AppText variant="h1" weight="bold" color={COLORS.textDark} style={styles.title}>
                Select Class
            </AppText>

            <View style={styles.list}>
                {teacherClasses.map((cls, index) => {
                    // Mock attendance pending logic
                    const isAttendancePending = index === 0 || index === 2;

                    return (
                        <AppCard
                            key={cls.id}
                            style={styles.classCard}
                            onPress={() => handleSelectClass(cls.id)}
                        >
                            <View style={styles.cardHeader}>
                                <AppText variant="h1" weight="bold" color={COLORS.textDark}>
                                    {cls.name}
                                </AppText>
                                {isAttendancePending && (
                                    <View style={styles.badgePending}>
                                        <AlertCircle size={14} color="#C2410C" />
                                        <AppText variant="small" weight="bold" style={styles.badgeText}>
                                            Pending
                                        </AppText>
                                    </View>
                                )}
                            </View>

                            <AppText color={COLORS.textMuted}>
                                {Math.floor(Math.random() * 10) + 25} Students
                            </AppText>
                        </AppCard>
                    );
                })}
            </View>

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
        fontSize: 28,
        marginBottom: SPACING.xl,
    },
    list: {
        gap: SPACING.md,
    },
    classCard: {
        padding: SPACING.xl,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.xs,
    },
    badgePending: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEDD5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
        gap: 4,
    },
    badgeText: {
        color: '#C2410C',
        fontSize: 12,
    }
});
