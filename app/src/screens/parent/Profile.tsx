import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { User, LogOut, Globe, Bell, Shield, ChevronRight, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import AppText from '../../components/AppText';

export default function Profile() {
    const { t } = useLang();
    const { logout, role } = useAuth();
    const [image, setImage] = React.useState<string | null>(null);

    const pickImage = async () => {
        Alert.alert(
            t('select_photo') || 'Select Photo',
            'Choose a source',
            [
                {
                    text: 'Take Photo', onPress: async () => {
                        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
                        if (!result.canceled) setImage(result.assets[0].uri);
                    }
                },
                {
                    text: 'Gallery', onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
                        if (!result.canceled) setImage(result.assets[0].uri);
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            t('logout') || "Logout",
            "Are you sure you want to exit?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: logout }
            ]
        );
    };

    const ProfileItem = ({ icon, label, onPress, value }: { icon: React.ReactNode, label: string, onPress?: () => void, value?: string }) => (
        <TouchableOpacity style={styles.item} onPress={onPress} disabled={!onPress}>
            <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                    {icon}
                </View>
                <AppText variant="h2" weight="bold" style={styles.itemLabel}>{label}</AppText>
            </View>
            <View style={styles.itemRight}>
                {value && <AppText variant="body" style={styles.itemValue}>{value}</AppText>}
                {onPress && <ChevronRight size={20} color={COLORS.textMuted} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.avatarImage} />
                    ) : (
                        <User size={50} color={COLORS.textMuted} />
                    )}
                    <View style={styles.cameraIcon}>
                        <Camera size={20} color="#FFF" />
                    </View>
                </TouchableOpacity>
                <AppText variant="h1" weight="bold" color={COLORS.textDark} style={styles.name}>Parent Name</AppText>
                <AppText variant="body" weight="bold" color={COLORS.primary} style={styles.roleText}>{role === 'teacher' ? 'Teacher' : 'Parent'}</AppText>
            </View>

            <View style={styles.section}>
                <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.sectionTitle}>Account Settings</AppText>
                <View style={styles.card}>
                    <ProfileItem
                        icon={<User size={20} color={COLORS.primary} />}
                        label="Personal Info"
                        onPress={() => { }}
                    />
                    <ProfileItem
                        icon={<Bell size={20} color={COLORS.primary} />}
                        label="Notifications"
                        onPress={() => { }}
                    />
                    <ProfileItem
                        icon={<Shield size={20} color={COLORS.primary} />}
                        label="Privacy & Security"
                        onPress={() => { }}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.sectionTitle}>Preferences</AppText>
                <View style={styles.card}>
                    <View style={styles.langItem}>
                        <View style={styles.itemLeft}>
                            <View style={styles.iconContainer}>
                                <Globe size={20} color={COLORS.primary} />
                            </View>
                            <AppText variant="h2" weight="bold" style={styles.itemLabel}>Language</AppText>
                        </View>
                        <LanguageSwitcher />
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <LogOut size={20} color={COLORS.statusAbsent} />
                <AppText variant="h2" weight="bold" style={styles.logoutText}>{t('logout') || 'Logout'}</AppText>
            </TouchableOpacity>

            <AppText variant="small" color={COLORS.textMuted} style={styles.version}>Version 1.0.0 (Adyapak Ji)</AppText>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.cardBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        position: 'relative',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        padding: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: COLORS.bgLight,
    },
    name: {
    },
    roleText: {
        marginTop: 4,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        marginBottom: SPACING.md,
        paddingLeft: SPACING.sm,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    langItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.infoBlueBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemLabel: {
        color: COLORS.textDark,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemValue: {
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        gap: 12,
        marginTop: SPACING.md,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        color: COLORS.statusAbsent,
    },
    version: {
        textAlign: 'center',
        marginTop: SPACING.xl,
        marginBottom: SPACING.xl,
    }
});
