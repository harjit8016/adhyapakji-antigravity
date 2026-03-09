import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CalendarCheck, BookOpen, BellRing, Coins, Volume2 } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useMockApp } from '../../context/MockAppContext';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';

export default function ParentDashboard() {
    const { t } = useLang();
    const navigation = useNavigation<any>();
    const { activeStudentId, myChildren, notices } = useMockApp();

    const student = myChildren.find((c: any) => c.id === activeStudentId);
    const latestNotice = notices[0];

    if (!student) return null;

    const navigateFeed = () => navigation.navigate('CommunicationFeed');

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentClass}>{student.className}</Text>
            </View>

            <View style={styles.grid}>
                <TouchableOpacity style={styles.gridItem} onPress={navigateFeed}>
                    <CalendarCheck size={48} color={COLORS.primary} />
                    <Text style={styles.gridLabel}>{t('attendance')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={navigateFeed}>
                    <BookOpen size={48} color={COLORS.primary} />
                    <Text style={styles.gridLabel}>{t('homework')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={navigateFeed}>
                    <BellRing size={48} color={COLORS.primary} />
                    <Text style={styles.gridLabel}>{t('notices')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={navigateFeed}>
                    <Coins size={48} color={COLORS.primary} />
                    <Text style={styles.gridLabel}>{t('fees')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.noticeCard}>
                <Text style={styles.noticeTag}>{t('latest_announcement')}</Text>
                <Text style={styles.noticeTitle}>{latestNotice.title}</Text>

                {latestNotice.type === 'audio' ? (
                    <TouchableOpacity style={styles.audioBtn} onPress={() => Alert.alert('Playing Audio...')}>
                        <Volume2 size={24} color={COLORS.textLight} />
                        <Text style={styles.audioBtnText}>{t('play_audio')}</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.noticeBody}>{latestNotice.description}</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
        padding: SPACING.md,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    studentName: {
        fontSize: TYPOGRAPHY.h1,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    studentClass: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textMuted,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    gridItem: {
        width: '48%',
        backgroundColor: COLORS.cardBg,
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.sm,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gridLabel: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginTop: SPACING.md,
    },
    noticeCard: {
        backgroundColor: '#EFF6FF',
        borderColor: COLORS.primary,
        borderWidth: 1,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.xl,
    },
    noticeTag: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: TYPOGRAPHY.small,
        marginBottom: SPACING.sm,
    },
    noticeTitle: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: SPACING.md,
    },
    noticeBody: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textDark,
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
    audioBtnText: {
        color: COLORS.textLight,
        fontSize: TYPOGRAPHY.body,
        fontWeight: 'bold',
    }
});
