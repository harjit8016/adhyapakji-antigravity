import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/theme';

interface VoiceWavesProps {
    isRecording: boolean;
    audioLevel: number; // Raw dB value from -160 to 0
}

export default function VoiceWaves({ isRecording, audioLevel }: VoiceWavesProps) {
    // Defines the configuration for the vertical acoustic bars
    // Using simple math to offset each bar slightly from the raw audioLevel
    const bars = [
        { id: 1, min: 4, multiplier: 0.6 },
        { id: 2, min: 8, multiplier: 0.8 },
        { id: 3, min: 12, multiplier: 1.0 },
        { id: 4, min: 6, multiplier: 0.9 },
        { id: 5, min: 16, multiplier: 0.7 },
        { id: 6, min: 4, multiplier: 0.5 },
    ];

    return (
        <View style={styles.container}>
            {bars.map((bar) => (
                <WaveBar key={bar.id} {...bar} audioLevel={audioLevel} isRecording={isRecording} />
            ))}
        </View>
    );
}

// Separate component to handle independent Animation Refs
function WaveBar({ min, multiplier, audioLevel, isRecording }: { min: number, multiplier: number, audioLevel: number, isRecording: boolean }) {
    const height = useRef(new Animated.Value(min)).current;
    const fallbackLoop = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        if (!isRecording) {
            fallbackLoop.current?.stop();
            Animated.timing(height, {
                toValue: min,
                duration: 200,
                useNativeDriver: false,
            }).start();
            return;
        }

        if (audioLevel <= -150) {
            // WEB FALLBACK: expo-av metering is unsupported on Web and permanently returns -160.
            // Run a lightweight looping pulse so users see motion while recording.
            fallbackLoop.current?.stop();
            fallbackLoop.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(height, {
                        toValue: min + (Math.random() * 40 * multiplier),
                        duration: 220,
                        useNativeDriver: false,
                    }),
                    Animated.timing(height, {
                        toValue: min,
                        duration: 180,
                        useNativeDriver: false,
                    }),
                ])
            );
            fallbackLoop.current.start();
            return;
        }

        fallbackLoop.current?.stop();

        // NATIVE HARDWARE: expo-av metering usually ranges from -160dB (silence) to 0dB (loud)
        // Normalize this to a 0-1 scale.
        // Assuming realistic noise floor is around -60dB for standard ambient mics.
        const clampedDb = Math.max(-60, Math.min(0, audioLevel));
        const normalized = (clampedDb + 60) / 60; // 0.0 to 1.0

        // Target height based on raw audio energy * specific bar's multiplier
        const targetHeight = min + (normalized * 40 * multiplier);

        Animated.timing(height, {
            toValue: Math.max(min, targetHeight),
            duration: 100, // Fast reaction time for voice metering
            useNativeDriver: false,
        }).start();

    }, [audioLevel, isRecording, height, min, multiplier]);

    return (
        <Animated.View
            style={[
                styles.bar,
                { height }
            ]}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        gap: 4,
        paddingHorizontal: 12,
    },
    bar: {
        width: 4,
        backgroundColor: COLORS.statusAbsent, // Deep red to indicate LIVE recording
        borderRadius: 2,
    }
});
