import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserPlus, UserCircle, Hash, Phone, IndianRupee } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import FormInput from '../../components/FormInput';
import PhotoPicker from '../../components/PhotoPicker';
import AppButton from '../../components/AppButton';
import ClassSelector from '../../components/ClassSelector';
import AppText from '../../components/AppText';

export default function AddStudentScreen() {
    const { t } = useLang();
    const navigation = useNavigation<any>();

    const setClassStudents = useAppStore(state => state.setClassStudents);
    const classStudents = useAppStore(state => state.classStudents);


    const [name, setName] = useState('');
    const [roll, setRoll] = useState('');
    const [phone, setPhone] = useState('');
    const [monthlyFee, setMonthlyFee] = useState('');
    const [photoUri, setPhotoUri] = useState<string | null>(null);



    const handleSave = () => {
        if (!name.trim() || !roll.trim()) {
            Alert.alert(t('error') || 'Error', t('fill_required_fields') || 'Please fill required fields');
            return;
        }

        if (classStudents.some((s: any) => s.roll === roll.trim())) {
            Alert.alert(t('error') || 'Error', t('roll_exists') || 'Roll number already exists');
            return;
        }

        const generatedLoginId = `STD${Math.floor(100 + Math.random() * 900)}`;
        const generatedPassword = `pass${Math.floor(1000 + Math.random() * 9000)}`;

        const newStudent = {
            id: `student_${Date.now()}`,
            name: name.trim(),
            roll: roll.trim(),
            phone: phone.trim(),
            monthlyFee: parseInt(monthlyFee.trim()) || 0,
            hasPhoto: !!photoUri,
            photoUri: photoUri || undefined,
            admissionNo: generatedLoginId,
            status: 'active' as const,
        };

        setClassStudents([...classStudents, newStudent]);
        const successMessage = `${t('student_added_success') || 'Student enrolled successfully.'}\n\nShare these credentials with the parent:\nLogin ID: ${generatedLoginId}\nPassword: ${generatedPassword}`;

        if (Platform.OS === 'web') {
            window.alert('Success: ' + successMessage);
            navigation.goBack();
        } else {
            Alert.alert(
                t('success') || 'Success',
                successMessage,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }
    };

    return (
        <DismissKeyboardView>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <AppText variant="h1" weight="bold" color={COLORS.textDark}>{t('enroll_student')}</AppText>
                    </View>

                    {/* Class Selector */}
                    <View style={styles.classSelectorWrap}>
                        <ClassSelector />
                    </View>

                    {/* Photo Picker */}
                    <PhotoPicker
                        imageUri={photoUri}
                        onImageSelected={setPhotoUri}
                        size={100}
                    />
                    <AppText variant="small" color={COLORS.textMuted} align="center" style={styles.photoHint}>{t('tap_to_add_photo')}</AppText>

                    {/* Form Card */}
                    <View style={styles.formContainer}>
                        <FormInput
                            label={t('student_full_name')}
                            placeholder={t('student_name_placeholder')}
                            value={name}
                            onChangeText={setName}
                            icon={<UserCircle size={20} color={COLORS.textMuted} />}
                        />

                        <FormInput
                            label={t('roll_number')}
                            placeholder={t('roll_placeholder')}
                            value={roll}
                            onChangeText={setRoll}
                            keyboardType="numeric"
                            icon={<Hash size={20} color={COLORS.textMuted} />}
                        />

                        <FormInput
                            label={t('phone_number')}
                            placeholder={t('phone_placeholder')}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            icon={<Phone size={20} color={COLORS.textMuted} />}
                        />

                        <FormInput
                            label={t('monthly_fee')}
                            placeholder={t('fee_placeholder')}
                            value={monthlyFee}
                            onChangeText={setMonthlyFee}
                            keyboardType="numeric"
                            icon={<IndianRupee size={20} color={COLORS.textMuted} />}
                        />

                        <AppButton
                            title={t('save') || 'Save'}
                            onPress={handleSave}
                            icon={<UserPlus color="#FFF" size={20} />}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </DismissKeyboardView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    scrollContent: {
        padding: SPACING.md,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        marginVertical: SPACING.md,
    },
    classSelectorWrap: {
        marginBottom: SPACING.sm,
        zIndex: 100, // Ensure dropdown renders above the photo picker below
    },
    photoHint: {
        marginBottom: SPACING.md,
    },
    formContainer: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.xl,
        borderRadius: RADIUS.lg,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});
