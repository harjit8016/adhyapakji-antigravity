import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import { User, BookOpen, GraduationCap, ArrowRight, Trash2, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import PrimaryButton from '../../components/PrimaryButton';
import type { ClassStudent } from '../../types';
import AppText from '../../components/AppText';

export default function StudentProfile() {
    const { t } = useLang();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { studentId } = route.params;

    const { classStudents, setClassStudents } = useAppStore();
    const student = classStudents.find(s => s.id === studentId);

    if (!student) {
        return (
            <View style={styles.centered}>
                <AppText variant="body" color={COLORS.textDark} align="center">Student not found</AppText>
            </View>
        );
    }

    const statuses: ClassStudent['status'][] = ['active', 'repeat', 'left', 'transferred', 'graduated'];

    const handleStatusChange = (newStatus: ClassStudent['status']) => {
        const updatedStudents = classStudents.map(s =>
            s.id === studentId ? { ...s, status: newStatus } : s
        );
        setClassStudents(updatedStudents);
        Alert.alert(t('success'), `Status updated to ${newStatus}`);
    };

    const pickImage = async () => {
        Alert.alert(
            'Select Photo',
            'Choose a source',
            [
                {
                    text: 'Take Photo', onPress: async () => {
                        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
                        if (!result.canceled) {
                            const updatedStudents = classStudents.map(s => s.id === studentId ? { ...s, photo: result.assets[0].uri } : s);
                            setClassStudents(updatedStudents);
                        }
                    }
                },
                {
                    text: 'Gallery', onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
                        if (!result.canceled) {
                            const updatedStudents = classStudents.map(s => s.id === studentId ? { ...s, photo: result.assets[0].uri } : s);
                            setClassStudents(updatedStudents);
                        }
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleRemove = () => {
        Alert.alert(
            "Remove Student",
            "Are you sure you want to remove this student from the class?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                        setClassStudents(classStudents.filter(s => s.id !== studentId));
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                    {student.photo ? (
                        <Image source={{ uri: student.photo }} style={styles.avatarImage} />
                    ) : (
                        <User size={60} color={COLORS.textMuted} />
                    )}
                    <View style={styles.cameraIcon}>
                        <Camera size={20} color="#FFF" />
                    </View>
                </TouchableOpacity>
                <AppText variant="h1" weight="bold" color={COLORS.textDark}>{student.name}</AppText>
                <AppText variant="body" color={COLORS.textMuted} style={styles.subText}>Roll No: {student.roll} • {t('admission_no') || 'Adm'}: {student.admissionNo}</AppText>
            </View>

            <View style={styles.section}>
                <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.sectionTitle}>Status Management</AppText>
                <View style={styles.statusGrid}>
                    {statuses.map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[
                                styles.statusChip,
                                student.status === s && styles.statusChipActive
                            ]}
                            onPress={() => handleStatusChange(s)}
                        >
                            <AppText weight="bold" style={[
                                styles.statusChipText,
                                student.status === s && styles.statusChipTextActive
                            ]}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.sectionTitle}>Promotion Information</AppText>
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <BookOpen size={20} color={COLORS.primary} />
                        <AppText variant="body" color={COLORS.textMuted} style={styles.infoLabel}>Current Class:</AppText>
                        <AppText variant="body" weight="bold" color={COLORS.textDark}>Class 5A</AppText>
                    </View>
                    <View style={styles.infoRow}>
                        <GraduationCap size={20} color={COLORS.primary} />
                        <AppText variant="body" color={COLORS.textMuted} style={styles.infoLabel}>Next Session:</AppText>
                        <AppText variant="body" weight="bold" color={COLORS.textDark}>Class 6A</AppText>
                    </View>
                </View>
            </View>

            <View style={styles.actions}>
                <PrimaryButton
                    label="Promote to Next Class"
                    onPress={() => {
                        Alert.alert(
                            "Confirm Promotion",
                            `Promote ${student.name} to Class 6A?`,
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Promote",
                                    onPress: () => {
                                        const updatedStudents = classStudents.map(s =>
                                            s.id === studentId ? { ...s, status: 'graduated' as const } : s
                                        );
                                        setClassStudents(updatedStudents);
                                        Alert.alert("Success", "Student promoted and marked as graduated from current class.");
                                    }
                                }
                            ]
                        );
                    }}
                    icon={<ArrowRight size={20} color="#FFF" />}
                />

                <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
                    <Trash2 size={20} color={COLORS.statusAbsent} />
                    <AppText variant="body" weight="bold" color={COLORS.statusAbsent}>Remove Student</AppText>
                </TouchableOpacity>
            </View>
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
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    subText: {
        marginTop: SPACING.xs,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        marginBottom: SPACING.md,
    },
    statusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    statusChip: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.cardBg,
    },
    statusChipActive: {
        backgroundColor: COLORS.primary,
    },
    statusChipText: {
        color: COLORS.primary,
    },
    statusChipTextActive: {
        color: COLORS.textLight,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        gap: 12,
    },
    infoLabel: {
        flex: 1,
    },
    actions: {
        marginTop: SPACING.lg,
        gap: SPACING.md,
    },
    removeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        gap: 8,
        marginTop: SPACING.md,
    }
});
