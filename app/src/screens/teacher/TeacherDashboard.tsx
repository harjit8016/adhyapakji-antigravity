import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Bell, AlertCircle, Users, LogOut, ArrowRight, Play, Pause } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';

const QUICK_ACTION_KEYS = [
    { icon: Calendar, labelKey: 'take_attendance', color: '#3B82F6', path: 'AttendanceGrid' },
    { icon: Bell, labelKey: 'new_announcement', color: '#F97316', path: 'TeacherAnnouncements' },
    { icon: AlertCircle, labelKey: 'pending_leaves', color: '#EAB308', path: 'HolidayManagement' },
    { icon: Users, labelKey: 'my_classes', color: '#A855F7', path: 'ClassSelection' }
];

export default function TeacherDashboard() {
    const navigation = useNavigation<any>();
    const { logout } = useAuth();
    const { t } = useLang();
    
    const { teacherClasses, offlineAttendance, notices } = useAppStore();

    const classesToday = teacherClasses.length || 4;
    
    // Dynamic stats calculation
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysRecords = offlineAttendance.filter(r => r.date.startsWith(todayStr));
    
    // Number of distinct classes with attendance marked today
    const uniqueStudents = new Set(todaysRecords.map(r => r.studentId));
    const attendanceMarked = uniqueStudents.size > 0 ? 1 : 0; 

    // Count pending announcements (future/today) or use total notices as a metric
    const pendingAnnouncements = notices.length || 3;
    
    const latestNotice = notices[0];

    const handleLogout = () => {
        logout();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* ── HEADER ── */}
            <LinearGradient colors={['#2563EB', '#1e40af']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
                <View style={styles.headerTop}>
                    <AppText variant="h2" weight="bold" color="#FFFFFF">
                        {t('teacher_dashboard')}
                    </AppText>
                    <TouchableOpacity
                        style={styles.headerIconBtn}
                        onPress={handleLogout}
                    >
                        <LogOut size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <AppText color="rgba(255,255,255,0.9)">
                    {t('welcome_back_teacher')}
                </AppText>
            </LinearGradient>

            <View style={styles.contentWrap}>
                {/* ── QUICK ACTIONS ── */}
                <View style={styles.grid}>
                    {QUICK_ACTION_KEYS.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={styles.actionCardWrapper}
                                onPress={() => navigation.navigate(action.path as never)}
                                activeOpacity={0.8}
                            >
                                <AppCard style={styles.actionCard}>
                                    <View style={[styles.iconBox, { backgroundColor: action.color }]}>
                                        <Icon size={32} color="#FFFFFF" />
                                    </View>
                                    <AppText weight="bold" color={COLORS.textDark} align="center" style={styles.actionLabel}>
                                        {t(action.labelKey)}
                                    </AppText>
                                </AppCard>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* ── TODAY'S SUMMARY ── */}
                <AppCard style={styles.summaryCard}>
                    <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.sectionTitle}>
                        {t('todays_summary')}
                    </AppText>
                    <View style={styles.summaryList}>
                        <View style={styles.summaryRow}>
                            <AppText color={COLORS.textMuted}>{t('classes_today')}</AppText>
                            <AppText weight="bold" color={COLORS.textDark}>{classesToday}</AppText>
                        </View>
                        <View style={styles.summaryRow}>
                            <AppText color={COLORS.textMuted}>{t('attendance_marked')}</AppText>
                            <AppText weight="bold" color={COLORS.success}>{attendanceMarked} / {classesToday}</AppText>
                        </View>
                        <View style={styles.summaryRow}>
                            <AppText color={COLORS.textMuted}>{t('pending_announcements')}</AppText>
                            <AppText weight="bold" color="#EA580C">{pendingAnnouncements}</AppText>
                        </View>
                    </View>
                </AppCard>

                {/* ── LATEST NOTICE ── */}
                {latestNotice && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('TeacherAnnouncements' as never)}
                        activeOpacity={0.85}
                        style={{ marginTop: SPACING.xl }}
                    >
                        <AppCard style={styles.noticeCard}>
                            <View style={styles.noticeCardTop}>
                                <AppText variant="small" weight="bold" color={COLORS.textDark}>
                                    {t('latest_announcement') || 'Latest Update'}
                                </AppText>
                                <View style={[styles.typeBadge, { backgroundColor: '#DBEAFE' }]}>
                                    <AppText style={{ fontSize: 12, color: COLORS.primary, fontWeight: '700' }}>
                                        {(latestNotice as any).category || latestNotice.type || 'Notice'}
                                    </AppText>
                                </View>
                            </View>
                            <AppText variant="body" weight="bold" color={COLORS.textDark} numberOfLines={2} style={styles.noticeTitle}>
                                {latestNotice.titleKey ? t(latestNotice.titleKey) : latestNotice.titleRaw}
                            </AppText>
                            {latestNotice.type !== 'audio' && (
                                <AppText color={COLORS.textMuted} numberOfLines={2} style={styles.noticeBody}>
                                    {latestNotice.descKey ? t(latestNotice.descKey) : latestNotice.descRaw}
                                </AppText>
                            )}
                            {latestNotice.type === 'audio' && (
                                <View style={styles.audioBtn}>
                                    <Play size={20} color="#FFF" />
                                    <AppText weight="bold" color="#FFF" style={{ marginLeft: 8 }}>
                                        {t('play_audio') || 'Play Audio'}
                                    </AppText>
                                </View>
                            )}
                        </AppCard>
                    </TouchableOpacity>
                )}
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
        paddingBottom: 100,
    },
    header: {
        padding: SPACING.xl,
        paddingTop: SPACING.xl * 1.5,
        paddingBottom: SPACING.xl * 1.5,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    headerIconBtn: {
        padding: 8,
        borderRadius: RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    contentWrap: {
        padding: SPACING.lg,
        marginTop: -SPACING.md, 
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    actionCardWrapper: {
        flexBasis: '47%',
        flexGrow: 1,
    },
    actionCard: {
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    actionLabel: {
        fontSize: 16,
    },
    summaryCard: {
        padding: SPACING.xl,
    },
    sectionTitle: {
        marginBottom: SPACING.lg,
    },
    summaryList: {
        gap: SPACING.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    noticeCard: {
        padding: SPACING.lg,
    },
    noticeCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: RADIUS.full,
    },
    noticeTitle: {
        marginBottom: SPACING.xs,
    },
    noticeBody: {
        marginBottom: SPACING.sm,
    },
    audioBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
    },
});
