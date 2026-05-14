import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Platform, Modal, Text } from 'react-native';
import { Image } from 'expo-image';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import AppButton from './AppButton';

/**
 * PhotoPicker Component Interface
 * Controls the circular avatar profile picture uploader.
 */
interface PhotoPickerProps {
    /** The current image to display, or null to show the default Camera icon */
    imageUri: string | null;
    /** Callback fired when a new valid image string (base64 or local URI) is captured */
    onImageSelected: (uri: string) => void;
    /** The fixed width and height of the circular container */
    size?: number;
}

/**
 * Circular avatar photo picker.
 * Shows camera icon when empty, displays selected image when set.
 */
export default function PhotoPicker({ imageUri, onImageSelected, size = 100 }: PhotoPickerProps) {
    const [showWebCamera, setShowWebCamera] = useState(false);
    const videoRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);
    const [stream, setStream] = useState<any>(null);

    // Clean up media stream when component unmounts or modal closes
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track: any) => track.stop());
            }
        };
    }, [stream]);

    /**
     * Primary Interaction Handler
     * Cross-platform divergence point: Web PWAs immediately attempt to launch
     * an inline HTML5 video stream, whereas Native iOS/Android apps trigger
     * the OS-level Native ActionSheet for Camera vs Gallery selection.
     */
    const handlePick = async () => {
        if (Platform.OS === 'web') {
            await startWebCamera();
            return;
        }

        Alert.alert(
            'Select Photo',
            'Choose a source for the photo',
            [
                { text: 'Take Photo', onPress: handleCamera },
                { text: 'Choose from Gallery', onPress: handleGallery },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleCamera = async () => {
        // Request permissions natively, but wrap securely for web 
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please allow camera access to take student photos.');
                return;
            }
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            onImageSelected(result.assets[0].uri);
        }
    };

    const handleGallery = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please allow photo access to add student photos.');
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            onImageSelected(result.assets[0].uri);
        }
    };

    // =========================================================================
    // Web Specific HTML5 Camera Logic
    // React Native `expo-image-picker` has limited support for live browser 
    // cameras. This section manually requests `navigator.mediaDevices` and 
    // pipes the stream into a floating HTML `<video>` Modal.
    // =========================================================================

    const startWebCamera = async () => {
        try {
            // Attempt to get video stream
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setShowWebCamera(true);
        } catch {
            console.log("Web camera access unavailable (likely HTTP or permission denied). Falling back to native picker.");
            // Silently fallback without triggering native browser alerts
            setShowWebCamera(false);
            handleGallery();
        }
    };

    const stopWebCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track: any) => track.stop());
            setStream(null);
        }
        setShowWebCamera(false);
    };

    const captureWebPhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to base64 image URI
            const dataUri = canvas.toDataURL('image/jpeg', 0.7);
            onImageSelected(dataUri);
            stopWebCamera();
        }
    };

    // Attach stream to video tag dynamically
    useEffect(() => {
        if (showWebCamera && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [showWebCamera, stream]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePick} activeOpacity={0.7}>
                <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={{ width: size, height: size, borderRadius: size / 2 }}
                        />
                    ) : (
                        <Camera size={size * 0.35} color={COLORS.textMuted} />
                    )}
                </View>
            </TouchableOpacity>

            {/* Web Camera Modal */}
            {Platform.OS === 'web' && showWebCamera && (
                <Modal visible={showWebCamera} transparent={true} animationType="fade">
                    <View style={styles.webModalOverlay}>
                        <View style={styles.webModalContent}>
                            <View style={styles.webModalHeader}>
                                <Text style={styles.webModalTitle}>Take Photo</Text>
                                <TouchableOpacity onPress={stopWebCamera} style={{ padding: 4 }}>
                                    <X size={24} color={COLORS.textDark} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.videoContainer}>
                                {/* @ts-ignore - React Native Web supports standard HTML elements but TS might complain */}
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: RADIUS.md }}
                                />
                                {/* Hidden canvas to capture image frame */}
                                {/* @ts-ignore */}
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                            </View>

                            <AppButton
                                title="Capture Photo"
                                onPress={captureWebPhoto}
                                icon={<Camera size={20} color="#FFF" />}
                            />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: SPACING.md,
    },
    circle: {
        backgroundColor: COLORS.bgLight,
        borderWidth: 2,
        borderColor: COLORS.textMuted + '40',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    webModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    webModalContent: {
        backgroundColor: COLORS.cardBg,
        width: '100%',
        maxWidth: 500,
        borderRadius: RADIUS.lg,
        padding: SPACING.xl,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    webModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    webModalTitle: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 1, // Keep it square just like the mobile photo picker output
        backgroundColor: '#000',
        borderRadius: RADIUS.md,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
    }
});
