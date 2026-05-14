import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserCheck, UserX, UserMinus, WifiOff, CheckCircle2 } from 'lucide-react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import type { ClassStudent } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';

export default function AttendanceGrid() {
    const { t } = useLang();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const netInfo = useNetInfo();
    const isOffline = netInfo.isConnected === false;
    
    const { classStudents, activeTeacherClassId, teacherClasses, holidays, offlineAttendance, setOfflineAttendance } = useAppStore();
    const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'leave'>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    const activeClass = teacherClasses.find(c => c.id === activeTeacherClassId);

    const activeStudents = useMemo(() => {
        return classStudents.filter(s => s.status === 'active' || s.status === 'repeat');
    }, [classStudents]);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysHoliday = holidays.find(h => h.date === todayStr);

    useEffect(() => {
        const initial: any = {};
        // Check if we already have records for today in offline storage
        const todaysRecords = offlineAttendance.filter(r => r.date.startsWith(todayStr));
        
        activeStudents.forEach(s => { 
            const existingRecord = todaysRecords.find(r => r.studentId === s.id);
            initial[s.id] = existingRecord ? existingRecord.status : 'present'; 
        });
        setAttendance(initial);
    }, [activeTeacherClassId, activeStudents, offlineAttendance, todayStr]);

    const toggleStatus = (studentId: string) => {
        setAttendance(prev => {
            const current = prev[studentId];
            let next: 'present' | 'absent' | 'leave' = 'present';
            if (current === 'present') next = 'absent';
            else if (current === 'absent') next = 'leave';
            return { ...prev, [studentId]: next };
        });
    };

    const markAll = (status: 'present' | 'absent' | 'leave') => {
        const next: any = {};
        activeStudents.forEach(s => { next[s.id] = status; });
        setAttendance(next);
    };

    const handleSave = () => {
        const existingOtherDays = offlineAttendance.filter(r => !r.date.startsWith(todayStr));
        const newRecords = activeStudents.map(student => ({
            id: Date.now().toString() + '_' + student.id,
            studentId: student.id,
            date: todayStr,
            status: attendance[student.id] || 'present',
            markedBy: 'teacher',
            synced: !isOffline
        }));
        
        setOfflineAttendance([...existingOtherDays, ...newRecords]);
        
        // Show success screen
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            navigation.goBack();
        }, 1500);
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'present': return { color: COLORS.statusPresent, bg: '#DCFCE7' };
            case 'absent': return { color: COLORS.statusAbsent, bg: '#FEE2E2' };
            case 'leave': return { color: COLORS.statusLeave, bg: '#FEF3C7' };
            default: return { color: COLORS.textMuted, bg: '#F3F4F6' };
        }
    };

    if (showSuccess) {
        return (
            <View style={styles.successContainer}>
                <CheckCircle2 size={80} color="#16A34A" />
                <AppText variant="h1" weight="bold" color={COLORS.textDark} style={{ marginTop: SPACING.xl }}>
                    Attendance Saved!
                </AppText>
                {isOffline && (
                    <AppText color={COLORS.textMuted} style={{ marginTop: SPACING.sm }}>
                        Saved locally. Will sync when online.
                    </AppText>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isOffline && (
                <View style={[styles.offlineBanner, { paddingTop: Math.max(insets.top, SPACING.md) }]}>
                    <WifiOff size={16} color="#B45309" />
                    <AppText variant="small" weight="bold" color="#B45309" style={{ marginLeft: 8 }}>
                        Offline Mode - Changes will be saved locally
                    </AppText>
                </View>
            )}
            <View style={[styles.header, !isOffline && { paddingTop: Math.max(insets.top, SPACING.lg) }]}>
                <View style={styles.headerTop}>
                    <View>
                        <AppText variant="h2" weight="bold" color={COLORS.textDark}>
                            {activeClass?.name || ''} {t('attendance')}
                        </AppText>
                        <AppText color={COLORS.textMuted}>
                            {new Date().toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </AppText>
                    </View>
                </View>

                {/* Quick Actions / Stats */}
                <View style={styles.statsRow}>
                    <AppButton
                        title={t('all_present') || 'All Present'}
                        onPress={() => markAll('present')}
                        variant="outline"
                        style={styles.allPresentBtn}
                    />
                    <View style={styles.statsCounters}>
                        <View style={styles.statCountBadge}>
                            <View style={[styles.dot, { backgroundColor: COLORS.statusPresent }]} />
                            <AppText weight="bold">{Object.values(attendance).filter(v => v === 'present').length}</AppText>
                        </View>
                        <View style={styles.statCountBadge}>
                            <View style={[styles.dot, { backgroundColor: COLORS.statusAbsent }]} />
                            <AppText weight="bold">{Object.values(attendance).filter(v => v === 'absent').length}</AppText>
                        </View>
                        <View style={styles.statCountBadge}>
                            <View style={[styles.dot, { backgroundColor: COLORS.statusLeave }]} />
                            <AppText weight="bold">{Object.values(attendance).filter(v => v === 'leave').length}</AppText>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {todaysHoliday ? (
                    <View style={styles.holidayBanner}>
                        <AppText variant="h2" weight="bold" color={COLORS.primary}>
                            {t('today_is_holiday') || 'Today is a Holiday'}
                        </AppText>
                        <AppText style={{ marginTop: SPACING.sm }}>
                            {todaysHoliday.name}
                        </AppText>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {activeStudents.map((student: ClassStudent) => {
                            const status = attendance[student.id] || 'present';
                            const { color, bg } = getStatusStyles(status);

                            return (
                                <Pressable
                                    key={student.id}
                                    style={({ pressed }) => [
                                        styles.studentCardContainer,
                                        pressed && { transform: [{ scale: 0.98 }] }
                                    ]}
                                    onPress={() => toggleStatus(student.id)}
                                    onLongPress={() => navigation.navigate('StudentProfile', { studentId: student.id })}
                                >
                                    <AppCard style={[styles.studentCard, { borderColor: color, backgroundColor: bg }]}>
                                        <View style={[styles.avatar, { borderColor: color, backgroundColor: color + '20' }]}>
                                            <AppText weight="bold" style={{ fontSize: 22 }} color={color}>{student.name.charAt(0).toUpperCase()}</AppText>
                                            <View style={[styles.statusIconOverlay, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
                                                {status === 'present' && <UserCheck size={14} color="#FFF" />}
                                                {status === 'absent' && <UserX size={14} color="#FFF" />}
                                                {status === 'leave' && <UserMinus size={14} color="#FFF" />}
                                            </View>
                                        </View>
                                        <AppText weight="bold" align="center" style={{ marginBottom: 4 }}>{student.name}</AppText>
                                        <AppText variant="small" color={COLORS.textMuted} align="center">{t('roll_number')} {student.roll}</AppText>
                                    </AppCard>
                                </Pressable>
                            )
                        })}
                    </View>
                )}
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, SPACING.md) }]}>
                <AppButton
                    title={t('save') + ' ' + t('attendance')}
                    onPress={handleSave}
                    style={styles.saveBtn}
                    textStyle={{ fontSize: 18, fontWeight: 'bold' }}
                    disabled={!!todaysHoliday}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bgLight,
        padding: SPACING.xl,
    },
    offlineBanner: {
        backgroundColor: '#FEF3C7',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: SPACING.lg,
    },
    header: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    allPresentBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        minHeight: 0,
    },
    statsCounters: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    statCountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: 120,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    studentCardContainer: {
        width: '48%',
        marginBottom: SPACING.md,
    },
    studentCard: {
        borderWidth: 4, 
        padding: SPACING.md,
        alignItems: 'center',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E5E7EB',
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        position: 'relative',
        overflow: 'hidden',
    },
    statusIconOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.bgLight,
        paddingTop: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    saveBtn: {
        width: '100%',
        paddingVertical: SPACING.md,
    },
    holidayBanner: {
        backgroundColor: '#EFF6FF',
        padding: SPACING.xl,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
    }
});
