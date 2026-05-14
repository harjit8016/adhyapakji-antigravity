import React from 'react';
import {
    Keyboard,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ViewStyle
} from 'react-native';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    keyboardAvoiding?: boolean;
}

/**
 * A standard wrapper for screens that provides:
 * 1. Tap to dismiss keyboard
 * 2. Optional KeyboardAvoidingView
 * 3. Consistent layout foundations
 */
export default function ScreenWrapper({
    children,
    style,
    keyboardAvoiding = true
}: ScreenWrapperProps) {
    const Content = (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, style]}>
                {children}
            </View>
        </TouchableWithoutFeedback>
    );

    if (keyboardAvoiding) {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {Content}
            </KeyboardAvoidingView>
        );
    }

    return Content;
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
    }
});
