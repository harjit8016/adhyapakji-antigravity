import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text } from 'react-native';
import { Languages, Users, LayoutDashboard, Calendar, Bell } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { COLORS } from '../constants/theme';

// Parent Screens
import StudentSelection from '../screens/parent/StudentSelection';
import ParentDashboard from '../screens/parent/ParentDashboard';
import CommunicationFeed from '../screens/parent/CommunicationFeed';

// Teacher Screens
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import AttendanceGrid from '../screens/teacher/AttendanceGrid';
import HolidayManagement from '../screens/teacher/HolidayManagement';
import TeacherAnnouncements from '../screens/teacher/TeacherAnnouncements';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Header Right to switch language and roles
const HeaderRight = () => {
    const { lang, setLang } = useLang();
    const { toggleRole } = useAuth();

    const handleLang = () => {
        const next = lang === 'en' ? 'hi' : lang === 'hi' ? 'pa' : 'en';
        setLang(next);
    };

    return (
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', marginRight: 16 }}>
            <TouchableOpacity onPress={handleLang} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Languages size={20} color={COLORS.textLight} />
                <Text style={{ color: COLORS.textLight, fontWeight: 'bold' }}>{lang.toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleRole}>
                <Users size={20} color={COLORS.textLight} />
            </TouchableOpacity>
        </View>
    );
};

const commonHeaderOptions = {
    headerStyle: { backgroundColor: COLORS.primary },
    headerTintColor: COLORS.textLight,
    headerTitleStyle: { fontWeight: 'bold' as 'bold', fontSize: 24 },
    headerRight: () => <HeaderRight />
};

function ParentStack() {
    return (
        <Stack.Navigator screenOptions={commonHeaderOptions}>
            <Stack.Screen name="StudentSelection" component={StudentSelection} options={{ title: 'ਅਧਿਆਪਕ ਜੀ' }} />
            <Stack.Screen name="ParentDashboard" component={ParentDashboard} options={{ title: 'ਅਧਿਆਪਕ ਜੀ' }} />
            <Stack.Screen name="CommunicationFeed" component={CommunicationFeed} options={{ title: 'ਅਧਿਆਪਕ ਜੀ' }} />
        </Stack.Navigator>
    );
}

function TeacherTabs() {
    const { t } = useLang();
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.textLight,
                headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
                headerRight: () => <HeaderRight />,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 }
            }}
        >
            <Tab.Screen
                name="TeacherDashboard"
                component={TeacherDashboard}
                options={{
                    title: 'ਅਧਿਆਪਕ ਜੀ',
                    tabBarLabel: t('teacher_dashboard'),
                    tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="AttendanceGrid"
                component={AttendanceGrid}
                options={{
                    title: 'ਅਧਿਆਪਕ ਜੀ',
                    tabBarLabel: t('attendance'),
                    tabBarIcon: ({ color }) => <Calendar color={color} size={24} />
                }}
            />
        </Tab.Navigator>
    );
}

function TeacherStack() {
    return (
        <Stack.Navigator screenOptions={commonHeaderOptions}>
            <Stack.Screen name="TeacherTabs" component={TeacherTabs} options={{ headerShown: false }} />
            <Stack.Screen name="HolidayManagement" component={HolidayManagement} options={{ title: 'ਅਧਿਆਪਕ ਜੀ' }} />
            <Stack.Screen name="TeacherAnnouncements" component={TeacherAnnouncements} options={{ title: 'ਅਧਿਆਪਕ ਜੀ' }} />
        </Stack.Navigator>
    );
}

export function AppNavigator() {
    const { role } = useAuth();

    return (
        <NavigationContainer>
            {role === 'parent' ? <ParentStack /> : <TeacherStack />}
        </NavigationContainer>
    );
}
