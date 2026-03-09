import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, User } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useMockApp } from '../../context/MockAppContext';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';

export default function StudentSelection() {
    const { t } = useLang();
    const navigation = useNavigation<any>();
    const { myChildren, setActiveStudentId } = useMockApp();
    const [showAddForm, setShowAddForm] = useState(false);

    const handleSelect = (id: string) => {
        setActiveStudentId(id);
        navigation.navigate('ParentDashboard');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{t('select_student')}</Text>

            {myChildren.map((child: any) => (
                <TouchableOpacity
                    key={child.id}
                    style={styles.card}
                    onPress={() => handleSelect(child.id)}
                >
                    <View style={styles.avatar}>
                        <User size={32} color={COLORS.textMuted} />
                    </View>
                    <View>
                        <Text style={styles.childName}>{child.name}</Text>
                        <Text style={styles.childClass}>{child.className}</Text>
                    </View>
                </TouchableOpacity>
            ))}

            {showAddForm ? (
                <View style={styles.formCard}>
                    <TextInput
                        style={styles.input}
                        placeholder={t('student_id')}
                    />
                    <TouchableOpacity style={styles.btnPrimary}>
                        <Text style={styles.btnText}>{t('link_child')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnOutline} onPress={() => setShowAddForm(false)}>
                        <Text style={styles.btnOutlineText}>{t('cancel')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.btnOutline} onPress={() => setShowAddForm(true)}>
                    <Plus size={24} color={COLORS.primary} />
                    <Text style={styles.btnOutlineText}>{t('add_child')}</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
        padding: SPACING.lg,
    },
    title: {
        fontSize: TYPOGRAPHY.h1,
        fontWeight: 'bold',
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.lg,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    childName: {
        fontSize: TYPOGRAPHY.h1,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    childClass: {
        fontSize: TYPOGRAPHY.h2,
        color: COLORS.textMuted,
        marginTop: 4,
    },
    formCard: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginTop: SPACING.md,
        elevation: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        fontSize: TYPOGRAPHY.body,
        marginBottom: SPACING.md,
    },
    btnPrimary: {
        backgroundColor: COLORS.primary,
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    btnText: {
        color: COLORS.textLight,
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
    },
    btnOutline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: COLORS.primary,
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        marginTop: SPACING.md,
    },
    btnOutlineText: {
        color: COLORS.primary,
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
    },
});
