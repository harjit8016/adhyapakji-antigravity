import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Volume2, Book } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useMockApp } from '../../context/MockAppContext';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';

export default function CommunicationFeed() {
    const { t } = useLang();
    const { notices } = useMockApp();

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>{t('announcements')}</Text>

            {notices.map((notice: any) => (
                <View key={notice.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{notice.title}</Text>
                        <Text style={styles.cardDate}>{notice.date}</Text>
                    </View>

                    <Text style={styles.cardBody}>{notice.description}</Text>

                    {notice.type === 'audio' && (
                        <TouchableOpacity style={styles.audioBtn} onPress={() => Alert.alert('Playing Audio...')}>
                            <Volume2 size={24} color={COLORS.textLight} />
                            <Text style={styles.audioBtnText}>{t('play_audio')}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Science Homework</Text>
                    <Text style={styles.cardDate}>Oct 14</Text>
                </View>
                <Text style={styles.cardBody}>Read Chapter 4 and complete exercises at the back.</Text>
                <View style={styles.badge}>
                    <Book size={16} color={COLORS.primary} />
                    <Text style={styles.badgeText}>Homework</Text>
                </View>
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
    pageTitle: {
        fontSize: TYPOGRAPHY.h1,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: SPACING.lg,
        color: COLORS.textDark,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    cardTitle: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    cardDate: {
        fontSize: TYPOGRAPHY.small,
        color: COLORS.textMuted,
    },
    cardBody: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textMuted,
        marginBottom: SPACING.md,
    },
    audioBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        gap: 8,
    },
    audioBtnText: {
        color: COLORS.textLight,
        fontSize: TYPOGRAPHY.body,
        fontWeight: 'bold',
    },
    badge: {
        backgroundColor: '#E0E7FF',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 99,
    },
    badgeText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: TYPOGRAPHY.small,
    }
});
