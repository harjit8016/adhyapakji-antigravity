import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Mic, Send, Paperclip } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';

export default function TeacherAnnouncements() {
    const { t } = useLang();
    const [text, setText] = useState('');
    const [recording, setRecording] = useState(false);

    const handleSend = () => {
        Alert.alert("Success", "Announcement Sent to parents!");
        setText('');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{t('announcements')}</Text>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="Write announcement..."
                    multiline
                    textAlignVertical="top"
                    value={text}
                    onChangeText={setText}
                />

                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.btnOutline}>
                        <Paperclip size={24} color={COLORS.primary} />
                        <Text style={styles.btnOutlineText}>Attach</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btnOutline, recording && { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}
                        onPress={() => setRecording(!recording)}
                    >
                        <Mic size={24} color={recording ? '#EF4444' : COLORS.primary} />
                        <Text style={[styles.btnOutlineText, recording && { color: '#EF4444' }]}>
                            {recording ? 'Stop' : 'Record'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleSend}>
                <Send size={24} color={COLORS.textLight} />
                <Text style={styles.btnPrimaryText}>Broadcast to Class 5A</Text>
            </TouchableOpacity>

            <Text style={styles.subTitle}>Recent Broadcasts</Text>
            <View style={[styles.card, { opacity: 0.7 }]}>
                <Text style={styles.body}>Tomorrow school will remain closed due to heavy rain.</Text>
                <Text style={styles.small}>Sent to: All Parents • Oct 15</Text>
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
    title: {
        fontSize: TYPOGRAPHY.hero,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.textDark,
        marginBottom: SPACING.xl,
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
    input: {
        minHeight: 120,
        fontSize: TYPOGRAPHY.body,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: RADIUS.md,
        marginBottom: SPACING.lg,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnOutline: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
    },
    btnOutlineText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: TYPOGRAPHY.body,
    },
    btnPrimary: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.xl,
        gap: 8,
    },
    btnPrimaryText: {
        color: COLORS.textLight,
        fontWeight: 'bold',
        fontSize: TYPOGRAPHY.h2,
    },
    subTitle: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: SPACING.sm,
    },
    body: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textDark,
        marginBottom: SPACING.sm,
    },
    small: {
        fontSize: TYPOGRAPHY.small,
        color: COLORS.textMuted,
    }
});
