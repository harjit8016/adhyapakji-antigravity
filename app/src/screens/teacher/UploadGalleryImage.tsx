import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { Image as ImageIcon, X, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import AppText from '../../components/AppText';

export default function UploadGalleryImage() {
    const { t } = useLang();
    const navigation = useNavigation();
    const { gallery, setGallery } = useAppStore();

    const [title, setTitle] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        if (!title || !image) {
            Alert.alert(t('error'), 'Please provide title and select image');
            return;
        }

        setIsUploading(true);
        // Pretend to upload
        setTimeout(() => {
            const newImage = {
                id: Date.now().toString(),
                uri: image,
                title,
                date: new Date().toISOString().split('T')[0],
            };
            setGallery([newImage, ...gallery]);
            setIsUploading(false);
            Alert.alert(t('success'), 'Image uploaded successfully');
            navigation.goBack();
        }, 1500);
    };

    return (
        <DismissKeyboardView>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <AppText variant="hero" weight="bold" color={COLORS.textDark} align="center" style={styles.title}>{t('upload_to_gallery') || 'Upload Photo'}</AppText>

                <View style={styles.form}>
                    <FormInput
                        label="Photo Title"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="e.g. Annual Sports Meet"
                        icon={<ImageIcon size={20} color={COLORS.primary} />}
                    />

                    <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.label}>Select Photo</AppText>
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        {image ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image source={{ uri: image }} style={styles.imagePreview} />
                                <TouchableOpacity style={styles.removeBtn} onPress={() => setImage(null)}>
                                    <X size={20} color={COLORS.textLight} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.pickPlaceholder}>
                                <Upload size={40} color={COLORS.textMuted} />
                                <AppText variant="body" color={COLORS.textMuted} style={styles.pickText}>Tap to choose from Gallery</AppText>
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={{ marginTop: SPACING.xl }}>
                        <PrimaryButton
                            label="Upload Now"
                            onPress={handleUpload}
                            loading={isUploading}
                            disabled={isUploading}
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
    imagePicker: {
        height: 250,
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.lg,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    pickPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickText: {
        marginTop: SPACING.sm,
    },
    imagePreviewContainer: {
        flex: 1,
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    removeBtn: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: RADIUS.full,
        padding: SPACING.xs,
    },
});
