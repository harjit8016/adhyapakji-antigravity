import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { AppNavigator } from './src/navigation';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <LanguageProvider>
                    <AppNavigator />
                    <StatusBar style="light" />
                </LanguageProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
