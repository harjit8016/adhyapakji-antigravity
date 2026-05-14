import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View, Platform } from 'react-native';

interface Props {
    children: React.ReactNode;
    style?: any;
}

/**
 * Wraps content so tapping outside any TextInput dismisses the keyboard.
 * Use this as the outermost wrapper on any screen that contains text inputs.
 */
export default function DismissKeyboardView({ children, style }: Props) {
    if (Platform.OS === 'web') {
        return <View style={[{ flex: 1 }, style]}>{children}</View>;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[{ flex: 1 }, style]}>
                {children}
            </View>
        </TouchableWithoutFeedback>
    );
}
