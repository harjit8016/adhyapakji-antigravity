import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Megaphone, BookOpen, Calendar, Bell, Play, Pause, FileAudio } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';
import type { Notice } from '../../types';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../components/AppText';

// Map notice category → badge color + icon
const CATEGORY_META: Record<string, { color: string; bg: string; icon: any; labelKey: string }> = {
    announcement: { color: COLORS.primary, bg: '#EFF6FF', icon: Megaphone, labelKey: 'announcement' },
    homework:     { color: '#7C3AED', bg: '#F5F3FF', icon: BookOpen, labelKey: 'homework' },
    event:        { color: '#EA580C', bg: '#FFF7ED', icon: Calendar, labelKey: 'event' },
    reminder:     { color: COLORS.secondary, bg: '#F0FDF4', icon: Bell, labelKey: 'reminder' },
    audio:        { color: COLORS.primary, bg: '#EFF6FF', icon: FileAudio, labelKey: 'voice_message' },
};

export default function CommunicationFeed() {
    const { t } = useLang();
    const navigation = useNavigation<any>();

    const notices = useAppStore(state => state.notices);
    const activeStudentId = useAppStore(state => state.activeStudentId);
    const myChildren = useAppStore(state => state.myChildren);

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);

    // Identify active child to extract their class ID
    const student = myChildren.find((c) => c.id === activeStudentId);

    // Apply strict filtering to prevent cross-class data leaks
    const myNotices = notices.filter(n => {
        if (n.targetClassId === 'all') return true;
        if (student && n.targetClassId === student.classId) return true;
        if (n.targetStudents && n.targetStudents.includes(activeStudentId || '')) return true;
        return false;
    });

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const playAudio = async (uri: string | undefined, id: string) => {
        if (!uri) return Alert.alert('Error', 'Audio file not found');

        if (sound) {
            await sound.unloadAsync();
            setSound(null);
            if (playingId === id) {
                setPlayingId(null);
                return;
            }
        }

        try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true }
            );
            setSound(newSound);
            setPlayingId(id);

            newSound.setOnPlaybackStatusUpdate((status: any) => {
                if (status.didJustFinish) setPlayingId(null);
            });
        } catch {
            Alert.alert('Error', 'Could not play audio');
            setPlayingId(null);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
            <AppText variant="h1" weight="bold" align="center" style={styles.pageTitle}>{t('announcements')}</AppText>

            {myNotices.map((notice: Notice) => {
                const catKey = (notice as any).category || (notice.type === 'audio' ? 'audio' : 'announcement');
                const cat = CATEGORY_META[catKey] || CATEGORY_META['announcement'];
                const CatIcon = cat.icon;

                return (
                    <TouchableOpacity
                        key={notice.id}
                        style={styles.card}
                        onPress={() => navigation.navigate('AnnouncementDetail' as any, { noticeId: notice.id })}
                    >
                        {/* Sender Row */}
                        <View style={styles.senderRow}>
                            <View style={styles.senderAvatar}>
                                <AppText weight="bold" style={{ fontSize: 16 }} color={COLORS.cardBg}>T</AppText>
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppText variant="small" weight="bold" color={COLORS.textDark}>
                                    {t('teacher_label') || 'Class Teacher'}
                                </AppText>
                                <AppText variant="small" color={COLORS.textMuted}>{notice.date}</AppText>
                            </View>
                            <View style={[styles.typeBadge, { backgroundColor: cat.bg, borderColor: cat.color }]}>
                                <CatIcon size={12} color={cat.color} />
                                <AppText style={{ fontSize: 11, marginLeft: 3 }} weight="bold" color={cat.color}>
                                    {t(cat.labelKey) || cat.labelKey}
                                </AppText>
                            </View>
                        </View>

                        {/* Content */}
                        <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.noticeTitle}>
                            {notice.titleKey ? t(notice.titleKey) : notice.titleRaw}
                        </AppText>

                        {notice.type !== 'audio' && (
                            <AppText variant="body" color={COLORS.textMuted} style={styles.cardBody} numberOfLines={3}>
                                {notice.descKey ? t(notice.descKey) : notice.descRaw}
                            </AppText>
                        )}

                        {notice.type === 'audio' && (
                            <TouchableOpacity
                                style={styles.audioBtn}
                                onPress={() => playAudio(notice.audioUri, notice.id)}
                            >
                                {playingId === notice.id
                                    ? <Pause size={22} color={COLORS.textLight} />
                                    : <Play size={22} color={COLORS.textLight} />}
                                <AppText variant="body" weight="bold" color={COLORS.textLight}>
                                    {playingId === notice.id ? (t('pause_audio') || 'Pause Audio') : (t('play_audio') || 'Play Audio')}
                                </AppText>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
        padding: SPACING.md,
    },
    pageTitle: {
        marginBottom: SPACING.lg,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
    },
    senderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    senderAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 99,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    noticeTitle: {
        marginBottom: SPACING.xs,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    cardBody: {
        marginBottom: SPACING.md,
    },
    audioBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        gap: 8,
    },
    badge: {
        backgroundColor: COLORS.infoBlueBg,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 99,
    }
});
