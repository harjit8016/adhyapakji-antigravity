import React, { useState, useMemo } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import AppText from '../../components/AppText';

type AttStatus = 'present' | 'absent' | 'leave' | undefined;

// Mock attendance data — in a real app this would come from appStore/Supabase
const MOCK_DATA: Record<string, AttStatus> = {
    '2026-03-01': 'present', '2026-03-03': 'present', '2026-03-04': 'absent',
    '2026-03-05': 'present', '2026-03-06': 'present', '2026-03-07': 'present',
    '2026-03-08': 'leave',   '2026-03-10': 'present', '2026-03-11': 'present',
    '2026-03-12': 'absent',
};

const DOT_COLORS: Record<string, string> = {
    present: '#16A34A',
    absent:  '#EF4444',
    leave:   '#F59E0B',
};

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AttendanceHistory() {
    const { t }         = useLang();
    const myChildren    = useAppStore(state => state.myChildren);
    const activeStudentId = useAppStore(state => state.activeStudentId);
    const student       = myChildren.find(c => c.id === activeStudentId);

    const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026

    // Build calendar days array for current month
    const { days, monthLabel, year } = useMemo(() => {
        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        const firstDay = new Date(y, m, 1).getDay();
        const lastDate = new Date(y, m + 1, 0).getDate();
        const daysArr: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) daysArr.push(null);
        for (let d = 1; d <= lastDate; d++) daysArr.push(d);
        const label = new Date(y, m, 1).toLocaleString('default', { month: 'long' });
        return { days: daysArr, monthLabel: label, year: y };
    }, [currentDate]);

    const getStatus = (day: number): AttStatus => {
        const y = currentDate.getFullYear();
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return MOCK_DATA[`${y}-${m}-${d}`];
    };

    const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

    // Stats
    let presentCount = 0, absentCount = 0, leaveCount = 0;
    days.forEach(day => {
        if (!day) return;
        const s = getStatus(day);
        if (s === 'present') presentCount++;
        else if (s === 'absent') absentCount++;
        else if (s === 'leave') leaveCount++;
    });
    const totalMarked = presentCount + absentCount + leaveCount;
    const pct = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />

            {/* ── GRADIENT HEADER ── */}
            <View style={styles.header}>
                <AppText weight="bold" style={styles.headerTitle} color="#FFFFFF">
                    {t('attendance') || 'Attendance'}
                </AppText>
                {student && (
                    <AppText style={styles.headerSub} color="rgba(255,255,255,0.85)">
                        {student.name}  •  {student.className}
                    </AppText>
                )}
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: SPACING.md }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── CALENDAR CARD ── */}
                <View style={styles.card}>
                    {/* Month navigation */}
                    <View style={styles.monthNav}>
                        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                            <ChevronLeft size={22} color={COLORS.textDark} />
                        </TouchableOpacity>
                        <AppText weight="bold" style={styles.monthLabel} color={COLORS.textDark}>
                            {monthLabel} {year}
                        </AppText>
                        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                            <ChevronRight size={22} color={COLORS.textDark} />
                        </TouchableOpacity>
                    </View>

                    {/* Day headers */}
                    <View style={styles.calRow}>
                        {DAY_HEADERS.map(h => (
                            <View key={h} style={styles.dayHeaderCell}>
                                <AppText style={styles.dayHeaderText} color={COLORS.textMuted}>{h}</AppText>
                            </View>
                        ))}
                    </View>

                    {/* Calendar grid */}
                    <View style={styles.calGrid}>
                        {days.map((day, idx) => {
                            const status = day ? getStatus(day) : undefined;
                            const isToday = day === 12 && currentDate.getMonth() === 2; // hardcoded for demo
                            return (
                                <View key={idx} style={styles.dayCell}>
                                    {day && (
                                        <View style={[styles.dayCellInner, isToday && styles.todayCell]}>
                                            <AppText
                                                style={styles.dayNumber}
                                                weight={isToday ? 'bold' : undefined}
                                                color={isToday ? '#FFFFFF' : COLORS.textDark}
                                            >
                                                {day}
                                            </AppText>
                                            <View
                                                style={[
                                                    styles.statusDot,
                                                    { backgroundColor: status ? DOT_COLORS[status] : '#E5E7EB' }
                                                ]}
                                            />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    {/* Legend */}
                    <View style={styles.legend}>
                        {[
                            { label: t('present') || 'Present', color: '#16A34A' },
                            { label: t('absent')  || 'Absent',  color: '#EF4444' },
                            { label: t('leave')   || 'Leave',   color: '#F59E0B' },
                            { label: 'No data',                 color: '#E5E7EB' },
                        ].map(item => (
                            <View key={item.label} style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                <AppText style={styles.legendText} color={COLORS.textMuted}>{item.label}</AppText>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── STATS 2×2 ── */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { borderTopColor: '#16A34A', borderTopWidth: 3 }]}>
                        <AppText weight="bold" style={[styles.statNumber, { color: '#16A34A' }]}>{presentCount}</AppText>
                        <AppText style={styles.statLabel} color={COLORS.textMuted}>{t('present') || 'Present'}</AppText>
                    </View>
                    <View style={[styles.statCard, { borderTopColor: '#EF4444', borderTopWidth: 3 }]}>
                        <AppText weight="bold" style={[styles.statNumber, { color: '#EF4444' }]}>{absentCount}</AppText>
                        <AppText style={styles.statLabel} color={COLORS.textMuted}>{t('absent') || 'Absent'}</AppText>
                    </View>
                    <View style={[styles.statCard, { borderTopColor: '#F59E0B', borderTopWidth: 3 }]}>
                        <AppText weight="bold" style={[styles.statNumber, { color: '#F59E0B' }]}>{leaveCount}</AppText>
                        <AppText style={styles.statLabel} color={COLORS.textMuted}>{t('leave') || 'Leave'}</AppText>
                    </View>
                    <View style={[styles.statCard, { borderTopColor: COLORS.primary, borderTopWidth: 3 }]}>
                        <AppText weight="bold" style={[styles.statNumber, { color: COLORS.primary }]}>{pct}%</AppText>
                        <AppText style={styles.statLabel} color={COLORS.textMuted}>{t('attendance') || 'Attendance'}</AppText>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    // ── Header ──
    header: {
        backgroundColor: '#1D4ED8',
        paddingTop: 52,
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 4,
    },
    headerSub: {
        fontSize: 15,
    },

    scroll: {
        flex: 1,
    },

    // ── Calendar card ──
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    navBtn: {
        padding: 8,
        borderRadius: RADIUS.md,
        backgroundColor: '#F3F4F6',
    },
    monthLabel: {
        fontSize: 18,
        fontWeight: '700',
    },
    calRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    dayHeaderCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6,
    },
    dayHeaderText: {
        fontSize: 12,
        fontWeight: '600',
    },
    calGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',          // 7 columns
        aspectRatio: 0.9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 2,
    },
    dayCellInner: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        aspectRatio: 1,
        borderRadius: 8,
    },
    todayCell: {
        backgroundColor: COLORS.primary,
    },
    dayNumber: {
        fontSize: 13,
        fontWeight: '500',
    },
    statusDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        marginTop: 2,
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    legendText: {
        fontSize: 13,
    },

    // ── Stats grid ──
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    statCard: {
        flexBasis: '47%',
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    statNumber: {
        fontSize: 36,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 14,
        marginTop: 2,
    },
});
