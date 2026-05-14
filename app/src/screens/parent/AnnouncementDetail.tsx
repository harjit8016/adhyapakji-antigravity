import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import {
    ChevronLeft, Play, Pause, Download,
    MessageCircle, Calendar,
} from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import AppText from '../../components/AppText';

// Category → badge color
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    announcement: { bg: '#DBEAFE', text: '#1D4ED8' },
    homework:     { bg: '#EDE9FE', text: '#7C3AED' },
    event:        { bg: '#FFEDD5', text: '#EA580C' },
    reminder:     { bg: '#DCFCE7', text: '#16A34A' },
    audio:        { bg: '#DBEAFE', text: '#1D4ED8' },
};

export default function AnnouncementDetail() {
    const { t }       = useLang();
    const navigation  = useNavigation<any>();
    const route       = useRoute<any>();
    const { noticeId } = route.params || { noticeId: null };

    const notices = useAppStore(state => state.notices);
    const notice  = notices.find(n => n.id === noticeId) || notices[0];

    // Audio
    const [sound, setSound]         = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration]   = useState(0);
    const [position, setPosition]   = useState(0);

    useEffect(() => {
        return () => { sound?.unloadAsync(); };
    }, [sound]);

    const progress = duration > 0 ? position / duration : 0;

    const handlePlayPause = async () => {
        if (!notice?.audioUri) return;

        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
            return;
        }

        try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: notice.audioUri },
                { shouldPlay: true },
                (status: any) => {
                    if (status.isLoaded) {
                        setDuration(status.durationMillis || 0);
                        setPosition(status.positionMillis || 0);
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                            setPosition(0);
                        }
                    }
                }
            );
            setSound(newSound);
            setIsPlaying(true);
        } catch {
            // silent fail — keep UI intact
        }
    };

    const formatTime = (ms: number) => {
        const s = Math.floor(ms / 1000);
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };

    const catKey = (notice as any)?.category || notice?.type || 'announcement';
    const catStyle = CATEGORY_COLORS[catKey] || CATEGORY_COLORS['announcement'];

    const senderInitial = 'T'; // "Teacher"

    if (!notice) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
                <AppText color={COLORS.textMuted}>Notice not found</AppText>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* ── STICKY HEADER ── */}
            <View style={styles.stickyHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={26} color={COLORS.textDark} />
                </TouchableOpacity>
                <AppText weight="bold" style={styles.headerTitle} color={COLORS.textDark}>
                    {t('notice_details') || 'Notice Details'}
                </AppText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── SENDER ROW (Figma pattern) ── */}
                <View style={styles.senderRow}>
                    <View style={styles.senderAvatar}>
                        <AppText weight="bold" style={{ fontSize: 20, color: '#FFFFFF' }}>
                            {senderInitial}
                        </AppText>
                    </View>
                    <View style={{ flex: 1 }}>
                        <AppText weight="bold" style={styles.senderName} color={COLORS.textDark}>
                            {t('teacher_label') || 'Class Teacher'}
                        </AppText>
                        <AppText style={styles.senderRole} color={COLORS.textMuted}>
                            {t('teacher') || 'Teacher'}
                        </AppText>
                        <View style={styles.dateRow}>
                            <Calendar size={13} color={COLORS.textMuted} />
                            <AppText style={styles.dateText} color={COLORS.textMuted}>
                                {notice.date}
                            </AppText>
                        </View>
                    </View>
                    {/* Category badge */}
                    <View style={[styles.catBadge, { backgroundColor: catStyle.bg }]}>
                        <AppText style={[styles.catBadgeText, { color: catStyle.text }]}>
                            {catKey.charAt(0).toUpperCase() + catKey.slice(1)}
                        </AppText>
                    </View>
                </View>

                {/* ── TITLE ── */}
                <AppText weight="bold" style={styles.title} color={COLORS.textDark}>
                    {notice.titleKey ? t(notice.titleKey) : notice.titleRaw}
                </AppText>

                {/* ── AUDIO PLAYER (Figma: gradient blue card) ── */}
                {notice.type === 'audio' && (
                    <View style={styles.audioCard}>
                        <View style={styles.audioRow}>
                            <TouchableOpacity style={styles.playBtn} onPress={handlePlayPause}>
                                {isPlaying
                                    ? <Pause size={28} color={COLORS.primary} fill={COLORS.primary} />
                                    : <Play  size={28} color={COLORS.primary} fill={COLORS.primary} />}
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <AppText weight="bold" style={styles.audioLabel} color="#FFFFFF">
                                    {t('voice_message') || 'Voice Announcement'}
                                </AppText>
                                {/* Progress bar */}
                                <View style={styles.progressTrack}>
                                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                                </View>
                                <View style={styles.timeRow}>
                                    <AppText style={styles.timeText} color="rgba(255,255,255,0.75)">
                                        {formatTime(position)}
                                    </AppText>
                                    <AppText style={styles.timeText} color="rgba(255,255,255,0.75)">
                                        {duration > 0 ? formatTime(duration) : '--:--'}
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* ── BODY TEXT CARD ── */}
                {notice.type !== 'audio' && (notice.descRaw || notice.descKey) && (
                    <View style={styles.bodyCard}>
                        <AppText style={styles.bodyText} color={COLORS.textDark}>
                            {notice.descKey ? t(notice.descKey) : notice.descRaw}
                        </AppText>
                    </View>
                )}

                {/* ── IMAGE ATTACHMENT ── */}
                {notice.imageUri ? (
                    <View style={styles.attachCard}>
                        <Image
                            source={{ uri: notice.imageUri }}
                            style={styles.attachImage}
                            contentFit="cover"
                        />
                        <TouchableOpacity style={styles.downloadRow}>
                            <View style={styles.downloadIconBox}>
                                <Download size={20} color="#DC2626" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppText weight="bold" style={{ fontSize: 15 }} color={COLORS.textDark}>
                                    Attached Document
                                </AppText>
                                <AppText style={{ fontSize: 13 }} color={COLORS.textMuted}>Image file</AppText>
                            </View>
                            <TouchableOpacity style={styles.downloadBtn}>
                                <AppText weight="bold" style={{ fontSize: 13, color: COLORS.primary }}>Download</AppText>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </ScrollView>

            {/* ── FOOTER: Send Private Query ── */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.queryBtn}>
                    <MessageCircle size={20} color={COLORS.primary} />
                    <AppText weight="bold" style={styles.queryBtnText} color={COLORS.primary}>
                        {t('send_query') || 'Send Private Query to Teacher'}
                    </AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#F9FAFB' },

    // ── Sticky header ──
    stickyHeader: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 52,
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: '700' },

    scroll: { flex: 1 },

    // ── Sender row ──
    senderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.md,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    senderAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    senderName: { fontSize: 16, fontWeight: '700', lineHeight: 20 },
    senderRole: { fontSize: 13, marginBottom: 2 },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    dateText: { fontSize: 12 },
    catBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 99,
        alignSelf: 'flex-start',
    },
    catBadgeText: { fontSize: 12, fontWeight: '700' },

    // ── Title ──
    title: {
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 30,
        marginBottom: SPACING.md,
    },

    // ── Audio player (Figma: blue gradient card) ──
    audioCard: {
        backgroundColor: '#1D4ED8',
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
    },
    audioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    playBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    audioLabel: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
    progressTrack: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
    },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    timeText: { fontSize: 12 },

    // ── Body card ──
    bodyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    bodyText: { fontSize: 16, lineHeight: 26 },

    // ── Attachment ──
    attachCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    attachImage: { width: '100%', height: 200 },
    downloadRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        gap: SPACING.sm,
    },
    downloadIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    downloadBtn: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },

    // ── Footer ──
    footer: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    queryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: 14,
        borderRadius: RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    queryBtnText: { fontSize: 16, fontWeight: '700' },
});
