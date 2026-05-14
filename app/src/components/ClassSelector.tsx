import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';
import type { TeacherClass } from '../types';
import AppText from './AppText';

import { useAppStore } from '../store/appStore';

export default function ClassSelector() {

    const teacherClasses = useAppStore(state => state.teacherClasses);
    const activeTeacherClassId = useAppStore(state => state.activeTeacherClassId);
    const setActiveTeacherClassId = useAppStore(state => state.setActiveTeacherClassId);
    const [showPicker, setShowPicker] = React.useState(false);

    const activeClass = teacherClasses.find((c: TeacherClass) => c.id === activeTeacherClassId);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowPicker(!showPicker)}
            >
                <AppText variant="h2" weight="bold" color={COLORS.primary}>Managing: {activeClass?.name}</AppText>
                <ChevronDown size={24} color={COLORS.primary} />
            </TouchableOpacity>

            {showPicker && (
                <View style={styles.dropdown}>
                    {teacherClasses.map((cls: TeacherClass) => (
                        <TouchableOpacity
                            key={cls.id}
                            style={styles.item}
                            onPress={() => {
                                setActiveTeacherClassId(cls.id);
                                setShowPicker(false);
                            }}
                        >
                            <AppText variant="body" color={COLORS.textDark}>{cls.name}</AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
        zIndex: 10,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    dropdown: {
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.md,
        marginTop: SPACING.sm,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 100,
    },
    item: {
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    }
});
