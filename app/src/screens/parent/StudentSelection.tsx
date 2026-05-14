import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, User } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';
import type { ChildStudent } from '../../types';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';

export default function StudentSelection() {
    const { t } = useLang();
    const navigation = useNavigation<any>();
    const myChildren = useAppStore(state => state.myChildren);
    const setActiveStudentId = useAppStore(state => state.setActiveStudentId);

    const [showAddForm, setShowAddForm] = useState(false);
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const { setMyChildren } = useAppStore();

    const handleLinkChild = () => {
        if (!loginId || !password) {
            const errorMsg = t('fill_required_fields') || "Please enter both Login ID and Password";
            if (Platform.OS === 'web') window.alert(errorMsg);
            else Alert.alert('Error', errorMsg);
            return;
        }

        if (loginId.toUpperCase() === 'STD201' && password === 'pass123') {
            const newChild: ChildStudent = {
                id: '201',
                classId: 'c2',
                name: 'Simran Kaur',
                className: 'Class 2B',
                roll: '1'
            };
            if (!myChildren.find(c => c.id === '201')) {
                setMyChildren([...myChildren, newChild]);
            }
            setShowAddForm(false);
            setLoginId('');
            setPassword('');
        } else {
            const errorMsg = t('invalid_credentials') || "Invalid Student Login ID or Password";
            if (Platform.OS === 'web') window.alert(errorMsg);
            else Alert.alert('Error', errorMsg);
        }
    };

    const handleSelect = (id: string) => {
        setActiveStudentId(id);
        navigation.navigate('ParentDashboard');
    };

    return (
        <ScreenWrapper>
            <ScrollView style={styles.container}>
                <AppText variant="h1" align="center" style={styles.title}>
                    {t('select_student')}
                </AppText>

                {myChildren.map((child: ChildStudent) => (
                    <AppCard
                        key={child.id}
                        style={styles.card}
                    >
                        <View onTouchEnd={() => handleSelect(child.id)} style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: SPACING.lg }}>
                            <View style={styles.avatar}>
                                <User size={32} color={COLORS.textMuted} />
                            </View>
                            <View>
                                <AppText variant="h1">{child.name}</AppText>
                                <AppText variant="h2" color={COLORS.textMuted}>{child.className}</AppText>
                            </View>
                        </View>
                    </AppCard>
                ))}

                {showAddForm ? (
                    <AppCard style={styles.formCard}>
                        <AppText weight="bold" style={styles.label}>{t('student_login_id') || 'Student Login ID'}</AppText>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. STD201"
                            value={loginId}
                            onChangeText={setLoginId}
                            autoCapitalize="characters"
                        />

                        <AppText weight="bold" style={styles.label}>{t('password') || 'Password'}</AppText>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <AppButton title={t('link_child')} onPress={handleLinkChild} />
                        <AppButton title={t('cancel')} variant="ghost" onPress={() => setShowAddForm(false)} style={{ marginTop: SPACING.sm }} />
                    </AppCard>
                ) : (
                    <AppButton
                        title={t('add_child')}
                        variant="outline"
                        onPress={() => setShowAddForm(true)}
                        icon={<Plus size={24} color={COLORS.primary} />}
                        style={{ marginTop: SPACING.md }}
                    />
                )}
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
        padding: SPACING.lg,
    },
    title: {
        marginBottom: SPACING.xl,
    },
    card: {
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formCard: {
        marginTop: SPACING.md,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        fontSize: TYPOGRAPHY.body,
        marginBottom: SPACING.md,
    },
    label: {
        marginBottom: SPACING.sm,
    },
    classScroll: {
        marginBottom: SPACING.md,
    },
    classChip: {
        marginRight: 8,
        minHeight: 0,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
});
