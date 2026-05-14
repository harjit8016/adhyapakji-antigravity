import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';

import ScreenWrapper from '../../components/ScreenWrapper';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';
import { ParentStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext'; // Usually where student linkage state lives

type NavigationProp = NativeStackNavigationProp<ParentStackParamList, 'LinkChild'>;

export default function LinkChild() {
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation<NavigationProp>();
    
    // In actual implementation, we'd use the AppContext or AuthContext to link
    // const { linkStudent } = useAppContext();

    const handleVerify = () => {
        // Mock verification
        if (studentId.toLowerCase() === 'adm001' || studentId.toLowerCase() === 'adm002') {
            setError('');
            // Assuming successful link, we'd route into the main ParentDashboard 
            // Depending on architecture, ParentSetup/LinkChild might be entirely separate from Root ParentStack
            navigation.navigate('ParentDashboard');
        } else {
            setError('Student not found. Please check the ID and try again.');
        }
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <AppText variant="hero" weight="bold" align="center" style={styles.title}>
                            Link Your Child
                        </AppText>
                        <AppText variant="body" color={COLORS.textMuted} align="center">
                            Enter Student ID or Admission Number
                        </AppText>
                    </View>

                    <AppCard style={styles.inputCard}>
                        <AppText variant="small" weight="500" style={styles.inputLabel}>
                            Student ID / Admission Number
                        </AppText>

                        <View style={[styles.inputContainer, error ? styles.inputErrorBorder : null]}>
                            <TextInput
                                style={styles.input}
                                value={studentId}
                                onChangeText={(text) => {
                                    setStudentId(text);
                                    if (error) setError('');
                                }}
                                placeholder="e.g., ADM001"
                                placeholderTextColor={COLORS.textMuted + '80'}
                                autoCapitalize="characters"
                            />
                            <Search size={24} color={COLORS.textMuted} />
                        </View>

                        {error ? (
                            <AppText variant="small" color={COLORS.statusAbsent} style={styles.errorText}>
                                {error}
                            </AppText>
                        ) : null}
                    </AppCard>

                    <AppButton
                        title="Verify & Link"
                        onPress={handleVerify}
                        disabled={studentId.trim().length === 0}
                        variant="primary"
                        style={styles.verifyButton}
                    />

                    <View style={styles.tipBox}>
                        <AppText variant="small" color="#1E3A8A" weight="bold" style={styles.tipTitle}>
                            Tip:
                        </AppText>
                        <AppText variant="small" color="#1E3A8A">
                            You can find the Student ID on the school ID card or contact the school office.
                        </AppText>
                        <AppText variant="small" color="#1D4ED8" style={styles.demoTip}>
                            For demo, try <AppText weight="bold" color="#1D4ED8">ADM001</AppText>
                        </AppText>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl * 1.5,
        paddingBottom: SPACING.xl,
    },
    header: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    title: {
        marginBottom: SPACING.xs,
    },
    inputCard: {
        marginBottom: SPACING.lg,
        padding: SPACING.lg,
    },
    inputLabel: {
        marginBottom: SPACING.sm,
        color: COLORS.textDark,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.cardBg,
    },
    inputErrorBorder: {
        borderColor: COLORS.statusAbsent,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textDark,
    },
    errorText: {
        marginTop: SPACING.sm,
    },
    verifyButton: {
        marginBottom: SPACING.xl,
    },
    tipBox: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
    },
    tipTitle: {
        marginBottom: 4,
    },
    demoTip: {
        marginTop: SPACING.sm,
        fontSize: 12, // Distinct styling for demo note
    },
});
