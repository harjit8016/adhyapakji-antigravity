import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Calendar, BookOpen, Bell, IndianRupee, Image as ImageIcon,
    User, Play, Pause, ArrowRight, LogOut, ChevronLeft,
} from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';
import type { ChildStudent } from '../../types';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';

// Figma quick action cards: colored icon boxes like the reference
const MENU_ITEMS = [
    { labelKey: 'attendance',  icon: Calendar,     color: '#2563EB', bg: '#DBEAFE', nav: 'AttendanceHistory' },
    { labelKey: 'homework',    icon: BookOpen,     color: '#7C3AED', bg: '#EDE9FE', nav: 'HomeworkScreen'    },
    { labelKey: 'notices',     icon: Bell,         color: '#EA580C', bg: '#FFEDD5', nav: 'CommunicationFeed' },
    { labelKey: 'fees',        icon: IndianRupee,  color: '#16A34A', bg: '#DCFCE7', nav: 'FeesScreen'        },
    { labelKey: 'gallery',     icon: ImageIcon,    color: '#0EA5E9', bg: '#E0F2FE', nav: 'SchoolGallery'     },
];

export default function ParentDashboard() {
    const { t } = useLang();
    const navigation = useNavigation<any>();
    const activeStudentId = useAppStore(state => state.activeStudentId);
    const myChildren     = useAppStore(state => state.myChildren);
    const notices        = useAppStore(state => state.notices);

    const [sound, setSound]       = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    // Navigation fallback
    useEffect(() => {
        if (!activeStudentId || myChildren.length === 0) {
            navigation.replace('StudentSelection');
        }
    }, [activeStudentId, myChildren, navigation]);

    const student = myChildren.find((c: ChildStudent) => c.id === activeStudentId);

    const myNotices = notices.filter(n => {
        if (n.targetClassId === 'all') return true;
        if (student && n.targetClassId === student.classId) return true;
        if (n.targetStudents && n.targetStudents.includes(activeStudentId || '')) return true;
        return false;
    });

    const latestNotice = myNotices[0] || notices[0];

    if (!student) return null;

    const playAudio = async (uri: string | undefined) => {
        if (!uri) return Alert.alert('Error', 'Audio file not found');
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
            if (isPlaying) { setIsPlaying(false); return; }
        }
        try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound: newSound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
            setSound(newSound);
            setIsPlaying(true);
            newSound.setOnPlaybackStatusUpdate((s: any) => { if (s.didJustFinish) setIsPlaying(false); });
        } catch {
            Alert.alert('Error', 'Could not play audio');
            setIsPlaying(false);
        }
    };

    const handleLogout = () => {
        navigation.navigate('RoleSelection'); // Or clear specific state first
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── HEADER ── */}
                <LinearGradient
                    colors={['#2563EB', '#1E40AF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >
                    <View style={styles.headerTopRow}>
                        <TouchableOpacity
                            style={styles.headerIconBtn}
                            onPress={() => navigation.navigate('StudentSelection')}
                        >
                            <ChevronLeft size={24} color="#FFF" />
                        </TouchableOpacity>
                        
                        <AppText variant="h2" weight="bold" color={COLORS.textLight}>
                            {t('parent_dashboard') || 'Parent Dashboard'}
                        </AppText>
                        
                        <TouchableOpacity
                            style={styles.headerIconBtn}
                            onPress={handleLogout}
                        >
                            <LogOut size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.studentRow}>
                        <View style={[styles.avatarCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <AppText weight="bold" style={{ fontSize: 26, color: COLORS.textLight }}>
                                {student.name.charAt(0).toUpperCase()}
                            </AppText>
                        </View>
                        <View style={{ flex: 1 }}>
                            <AppText variant="h1" weight="bold" color={COLORS.textLight}>
                                {student.name}
                            </AppText>
                            <AppText color="rgba(255,255,255,0.9)">
                                {t('class')} {student.className} {(student as any).roll ? `• ${t('roll')} ${(student as any).roll}` : ''}
                            </AppText>
                        </View>
                    </View>
                </LinearGradient>

                {/* ── MAIN MENU GRID ── */}
                <View style={styles.gridWrap}>
                    {MENU_ITEMS.map(item => {
                        const Icon = item.icon;
                        return (
                            <TouchableOpacity
                                key={item.labelKey}
                                style={styles.gridCardWrapper}
                                onPress={() => navigation.navigate(item.nav)}
                                activeOpacity={0.8}
                            >
                                <AppCard style={styles.gridCard}>
                                    <View style={[styles.gridIconBox, { backgroundColor: item.bg }]}>
                                        <Icon size={32} color={item.color} />
                                    </View>
                                    <AppText weight="bold" align="center" color={COLORS.textDark}>
                                        {t(item.labelKey) || item.labelKey}
                                    </AppText>
                                </AppCard>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* ── LATEST NOTICE CARD ── */}
                {latestNotice && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AnnouncementDetail', { noticeId: latestNotice.id })}
                        activeOpacity={0.85}
                    >
                        <AppCard style={styles.noticeCard}>
                            <View style={styles.noticeCardTop}>
                                <AppText variant="h2" weight="bold" color={COLORS.textDark}>
                                    {t('latest_announcement') || 'Latest Update'}
                                </AppText>
                                <View style={[styles.typeBadge, { 
                                    backgroundColor: (latestNotice as any).category === 'event' ? '#FFEDD5' : (latestNotice as any).category === 'reminder' ? '#DCFCE7' : '#DBEAFE' 
                                }]}>
                                    <AppText style={{ 
                                        fontSize: 12, 
                                        fontWeight: '700',
                                        color: (latestNotice as any).category === 'event' ? '#C2410C' : (latestNotice as any).category === 'reminder' ? '#15803D' : '#1D4ED8' 
                                    }}>
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
                                <TouchableOpacity
                                    style={styles.audioBtn}
                                    onPress={() => playAudio(latestNotice.audioUri)}
                                >
                                    {isPlaying ? <Pause size={20} color="#FFF" /> : <Play size={20} color="#FFF" />}
                                    <AppText weight="bold" color="#FFF" style={{ marginLeft: 8 }}>
                                        {isPlaying ? (t('pause_audio') || 'Pause') : (t('play_audio') || 'Play Audio')}
                                    </AppText>
                                </TouchableOpacity>
                            )}

                            <View style={styles.viewAllRow}>
                                <AppText weight="bold" color={COLORS.primary} style={{ fontSize: 14 }}>
                                    {t('view_all_updates') || 'View all updates'}
                                </AppText>
                                <ArrowRight size={16} color={COLORS.primary} />
                            </View>
                        </AppCard>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    scroll: {
        flex: 1,
    },
    header: {
        paddingTop: 52,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl * 1.5,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },
    headerIconBtn: {
        padding: 8,
        borderRadius: RADIUS.sm,
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    avatarCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
        overflow: 'hidden',
    },
    gridWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.lg,
        marginTop: -SPACING.xl,
        gap: SPACING.md,
        marginBottom: SPACING.lg,
        zIndex: 10,
    },
    gridCardWrapper: {
        flexBasis: '47%',
        flexGrow: 1,
    },
    gridCard: {
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    gridIconBox: {
        width: 64,
        height: 64,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    noticeCard: {
        marginHorizontal: SPACING.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        elevation: 2,
    },
    noticeCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
    },
    noticeTitle: {
        marginBottom: SPACING.xs,
        fontSize: 16,
    },
    noticeBody: {
        marginBottom: SPACING.md,
        lineHeight: 20,
    },
    audioBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
    },
    viewAllRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: SPACING.xs,
    },
});
