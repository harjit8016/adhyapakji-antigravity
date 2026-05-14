import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { Image as ImageIcon, Plus } from 'lucide-react-native';
import { useLang } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import AppText from '../../components/AppText';

export default function SchoolGallery() {
    const { t } = useLang();
    const { role } = useAuth();
    const navigation = useNavigation<any>();
    const { gallery } = useAppStore();

    return (
        <ScrollView style={styles.container}>
            <AppText variant="h1" weight="bold" color={COLORS.textDark} align="center" style={styles.pageTitle}>{t('gallery')}</AppText>

            {role === 'teacher' && (
                <TouchableOpacity
                    style={styles.uploadBtn}
                    onPress={() => navigation.navigate('UploadGalleryImage')}
                >
                    <Plus size={24} color={COLORS.textLight} />
                    <AppText variant="body" weight="bold" color={COLORS.textLight}>{t('upload_to_gallery') || 'Upload Photo'}</AppText>
                </TouchableOpacity>
            )}

            <View style={styles.grid}>
                {gallery.map((img) => (
                    <View key={img.id} style={styles.photoCard}>
                        {img.uri.startsWith('http') ? (
                            <Image source={{ uri: img.uri }} style={styles.photo} />
                        ) : (
                            <View style={styles.placeholder}>
                                <ImageIcon size={48} color={COLORS.textMuted} />
                            </View>
                        )}
                        <View style={styles.captionContainer}>
                            <AppText variant="small" weight="bold" color={COLORS.textDark} numberOfLines={1}>{img.title}</AppText>
                            <AppText variant="small" color={COLORS.textMuted} style={styles.date}>{img.date}</AppText>
                        </View>
                    </View>
                ))}
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
    pageTitle: {
        marginBottom: SPACING.lg,
    },
    uploadBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.lg,
        gap: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    photoCard: {
        width: '48%',
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    photo: {
        width: '100%',
        height: 120,
        backgroundColor: '#E5E7EB',
    },
    placeholder: {
        width: '100%',
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
    },
    captionContainer: {
        padding: SPACING.sm,
    },
    date: {
        marginTop: 2,
    }
});
