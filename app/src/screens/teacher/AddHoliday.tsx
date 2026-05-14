import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Tag } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import type { Holiday } from '../../types';
import AppText from '../../components/AppText';

export default function AddHoliday() {
    const { t } = useLang();
    const navigation = useNavigation();
    const { holidays, setHolidays } = useAppStore();

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<Holiday['type']>('festival');

    const holidayTypes: Holiday['type'][] = ['festival', 'government', 'school_event', 'emergency'];

    const handleAdd = () => {
        if (!name || !date) {
            Alert.alert(t('error'), 'Please fill all fields');
            return;
        }

        const newHoliday: Holiday = {
            id: Date.now().toString(),
            name,
            date,
            type,
        };

        setHolidays([...holidays, newHoliday]);
        Alert.alert(t('success'), 'Holiday added successfully');
        navigation.goBack();
    };

    return (
        <DismissKeyboardView>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <AppText variant="hero" weight="bold" color={COLORS.textDark} align="center" style={styles.title}>{t('add_holiday') || 'Add New Holiday'}</AppText>

                <View style={styles.form}>
                    <FormInput
                        label="Holiday Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Diwali Vacation"
                        icon={<Tag size={20} color={COLORS.primary} />}
                    />

                    <FormInput
                        label="Date"
                        value={date}
                        onChangeText={setDate}
                        placeholder="YYYY-MM-DD"
                        icon={<Calendar size={20} color={COLORS.primary} />}
                    />

                    <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.label}>Holiday Type</AppText>
                    <View style={styles.typeGrid}>
                        {holidayTypes.map((tOp) => (
                            <TouchableOpacity
                                key={tOp}
                                style={[
                                    styles.typeChip,
                                    type === tOp && styles.typeChipActive
                                ]}
                                onPress={() => setType(tOp)}
                            >
                                <AppText weight="bold" style={[
                                    styles.typeChipText,
                                    type === tOp && styles.typeChipTextActive
                                ]}>
                                    {tOp.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ marginTop: SPACING.xl }}>
                        <PrimaryButton
                            label="Add Holiday"
                            onPress={handleAdd}
                        />
                    </View>
                </View>
            </ScrollView>
        </DismissKeyboardView>
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
    title: {
        marginBottom: SPACING.xl,
    },
    form: {
        gap: SPACING.md,
    },
    label: {
        marginBottom: SPACING.xs,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    typeChip: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.cardBg,
    },
    typeChipActive: {
        backgroundColor: COLORS.primary,
    },
    typeChipText: {
        color: COLORS.primary,
    },
    typeChipTextActive: {
        color: COLORS.textLight,
    },
});
