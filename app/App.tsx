import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { MockAppProvider } from './src/context/MockAppContext';
import { AppNavigator } from './src/navigation';

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <LanguageProvider>
                    <MockAppProvider>
                        <AppNavigator />
                        <StatusBar style="light" />
                    </MockAppProvider>
                </LanguageProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
