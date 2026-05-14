import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { Users, School, ShieldCheck } from 'lucide-react-native';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';


export default function RoleSelection() {
    const { loginAs } = useAuth();
    const { t } = useLang();

    const roles = [
        {
            value: 'parent',
            label: t('role_parent_title'),
            icon: Users,
            description: t('role_parent_desc'),
        },
        {
            value: 'teacher',
            label: t('role_teacher_title'),
            icon: School,
            description: t('role_teacher_desc'),
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <AppText variant="hero" weight="bold" align="center" style={styles.title}>
                        {t('select_role_title')}
                    </AppText>
                    <AppText variant="body" color={COLORS.textMuted} align="center">
                        {t('select_role_sub')}
                    </AppText>
                </View>

                <View style={styles.roleList}>
                    {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                            <TouchableOpacity
                                key={role.value}
                                activeOpacity={0.8}
                                onPress={() => loginAs(role.value as 'teacher' | 'parent')}
                                style={styles.rolePressable}
                            >
                                <AppCard style={styles.roleCard}>
                                    <View style={styles.iconContainer}>
                                        <Icon size={32} color="#FFF" />
                                    </View>
                                    <View style={styles.roleTextContainer}>
                                        <AppText variant="h2" weight="bold" style={styles.roleLabel}>
                                            {role.label}
                                        </AppText>
                                        <AppText variant="small" color={COLORS.textMuted}>
                                            {role.description}
                                        </AppText>
                                    </View>
                                </AppCard>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    scrollContent: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl * 2,
        paddingBottom: SPACING.xl * 2,
    },
    header: {
        marginBottom: SPACING.xl * 1.5,
        alignItems: 'center',
    },
    title: {
        marginBottom: SPACING.xs,
    },
    roleList: {
        gap: SPACING.md,
    },
    rolePressable: {
        marginBottom: SPACING.sm, // fallback for older RN gap
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.xl,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    iconContainer: {
        backgroundColor: COLORS.primary, // #030213 for the reference Primary
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginRight: SPACING.lg,
    },
    roleTextContainer: {
        flex: 1,
    },
    roleLabel: {
        marginBottom: SPACING.xs / 2,
    },
});
