import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users, LayoutDashboard, Calendar, ChevronLeft } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

import { COLORS } from '../constants/theme';
import LanguageSwitcher from '../components/LanguageSwitcher';
import HeaderButton from '../components/HeaderButton';
import PwaInstallBanner from '../components/PwaInstallBanner';

// Parent Screens
import StudentSelection from '../screens/parent/StudentSelection';
import ParentSetup from '../screens/parent/ParentSetup';
import LinkChild from '../screens/parent/LinkChild';
import ParentDashboard from '../screens/parent/ParentDashboard';
import CommunicationFeed from '../screens/parent/CommunicationFeed';
import SchoolGallery from '../screens/parent/SchoolGallery';
import HomeworkScreen from '../screens/parent/HomeworkScreen';
import FeesScreen from '../screens/parent/FeesScreen';
import AttendanceHistory from '../screens/parent/AttendanceHistory';
import AnnouncementDetail from '../screens/parent/AnnouncementDetail';
import Profile from '../screens/parent/Profile';

// Auth Screens
import LanguageSelection from '../screens/auth/LanguageSelection';
import PhoneLogin from '../screens/auth/PhoneLogin';
import OTPVerification from '../screens/auth/OTPVerification';
import RoleSelection from '../screens/auth/RoleSelection';
import SplashScreen from '../screens/auth/SplashScreen';

// Teacher Screens
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import AttendanceGrid from '../screens/teacher/AttendanceGrid';
import ClassSelection from '../screens/teacher/ClassSelection';
import HolidayManagement from '../screens/teacher/HolidayManagement';
import TeacherAnnouncements from '../screens/teacher/TeacherAnnouncements';
import AddStudentScreen from '../screens/teacher/AddStudentScreen';
import FeesCollectionScreen from '../screens/teacher/FeesCollectionScreen';
import AddHoliday from '../screens/teacher/AddHoliday';
import UploadGalleryImage from '../screens/teacher/UploadGalleryImage';
import StudentProfile from '../screens/teacher/StudentProfile';

const Stack = createNativeStackNavigator<any>();
const Tab = createBottomTabNavigator<any>();

const HeaderRight = () => <LanguageSwitcher />;
const HeaderLeft = (props: any) => props.canGoBack ? <HeaderButton icon={<ChevronLeft size={24} color={COLORS.textLight} />} onPress={props.onPress} /> : null;

const commonHeaderOptions = {
    headerStyle: { backgroundColor: COLORS.primary },
    headerTintColor: COLORS.textLight,
    headerTitleStyle: { fontWeight: 'bold' as 'bold', fontSize: 20 },
    headerTitleAlign: 'center' as 'center',
    headerRight: () => <HeaderRight />,
    headerLeft: (props: any) => <HeaderLeft {...props} />
};
/**
 * Parent Navigational Stack
 * Contains all screens isolated for the 'Parent' role. 
 * Root Screen: StudentSelection -> Routes to ParentDashboard -> Routes to features (Fees, HW, etc)
 */
function ParentStack() {
    const { t } = useLang();
    return (
        <Stack.Navigator screenOptions={commonHeaderOptions}>
            <Stack.Screen name="StudentSelection" component={StudentSelection} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="ParentSetup" component={ParentSetup} options={{ title: 'Setup' }} />
            <Stack.Screen name="LinkChild" component={LinkChild} options={{ title: 'Link Child' }} />
            <Stack.Screen name="ParentDashboard" component={ParentDashboard} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="CommunicationFeed" component={CommunicationFeed} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="SchoolGallery" component={SchoolGallery} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="HomeworkScreen" component={HomeworkScreen} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="FeesScreen" component={FeesScreen} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="AttendanceHistory" component={AttendanceHistory} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetail} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="Profile" component={Profile} options={{ title: t('app_greeting_title') }} />
        </Stack.Navigator>
    );
}

/**
 * Teacher Main Dashboard Hierarchy (Bottom Tabs)
 * 
 * Unlike the Parent Stack, the Teacher UI relies heavily on a bottom TabNavigator 
 * to quickly swap between their primary Dashboard layout and their Attendance grids.
 */
function TeacherTabs() {
    const { t } = useLang();
    const insets = useSafeAreaInsets();

    /**
     * Platform Specific Safe Area Handling 
     * 
     * React Native `useSafeAreaInsets` accurately determines the physical screen notch bounds on iOS Native.
     * However, on iOS Safari (Web PWA), the dynamic browser chrome completely throws off JS window calculations, 
     * and aggressive bounding constraints cause React Native Web to visually truncate text tags underneath.
     * 
     * To permanently resolve text truncation:
     * - Web Platform: Hardcoded to an exceptionally spacious 70px outer bounding box with zero internal padding to let flex items breathe.
     * - Native Platform: Defaults to dynamic 65px + hardware inset math.
     */
    const bottomPadding = Platform.OS === 'web'
        ? 10
        : Math.max(insets.bottom, 10);

    const tabBarHeight = Platform.OS === 'web'
        ? 70
        : 65 + Math.max(insets.bottom, 10);

    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.textLight,
                headerTitleStyle: { fontWeight: 'bold', fontSize: 26 },
                headerRight: () => <HeaderRight />,
                headerLeft: (props: any) => <HeaderLeft {...props} />,
                headerLeftContainerStyle: { backgroundColor: 'transparent' },
                headerRightContainerStyle: { backgroundColor: 'transparent' },
                headerTitleAlign: 'center',
                tabBarStyle: {
                    height: tabBarHeight,
                    paddingBottom: bottomPadding,
                    paddingTop: 5,
                    elevation: 10,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.textMuted + '20'
                },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 4 }
            }}
        >
            <Tab.Screen
                name="TeacherDashboard"
                component={TeacherDashboard}
                options={{
                    title: t('app_greeting_title'),
                    tabBarLabel: t('teacher_dashboard'),
                    tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={28} />
                }}
            />
            <Tab.Screen
                name="AttendanceGrid"
                component={AttendanceGrid}
                options={{
                    title: t('app_greeting_title'),
                    tabBarLabel: t('attendance'),
                    tabBarIcon: ({ color }) => <Calendar color={color} size={28} />
                }}
            />
        </Tab.Navigator>
    );
}

/**
 * Teacher Navigational Stack
 * Wraps the TeacherTabs as the initial 'Home' route, and declares all the subsequent 
 * nested screens (Holiday Management, Student Additions, etc.) on top of the generic stack.
 */
function TeacherStack() {
    const { t } = useLang();
    return (
        <Stack.Navigator screenOptions={commonHeaderOptions}>
            <Stack.Screen name="TeacherTabs" component={TeacherTabs} options={{ headerShown: false }} />
            <Stack.Screen name="ClassSelection" component={ClassSelection} options={{ title: 'Select Class' }} />
            <Stack.Screen name="HolidayManagement" component={HolidayManagement} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="TeacherAnnouncements" component={TeacherAnnouncements} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="AddStudentScreen" component={AddStudentScreen} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="FeesCollectionScreen" component={FeesCollectionScreen} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="AddHoliday" component={AddHoliday} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="UploadGalleryImage" component={UploadGalleryImage} options={{ title: t('app_greeting_title') }} />
            <Stack.Screen name="StudentProfile" component={StudentProfile} options={{ title: t('app_greeting_title') }} />
        </Stack.Navigator>
    );
}

/**
 * Global Application Router Entrypoint
 * 
 * 1. Automatically injects the PWA Install Banner globally for web users.
 * 2. Listens to the `useAuth` context to conditionally render either the 
 *    Auth/RoleSelection layer, the internal ParentStack, or TeacherStack.
 */
export function AppNavigator() {
    const { role } = useAuth();
    const [splashDone, setSplashDone] = React.useState(false);

    return (
        <NavigationContainer>
            <PwaInstallBanner />
            {!splashDone ? (
                <SplashScreen onFinish={() => setSplashDone(true)} />
            ) : role === null ? (
                <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.bgLight } }}>
                    <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
                    <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
                    <Stack.Screen name="OTPVerification" component={OTPVerification} />
                    <Stack.Screen name="RoleSelection" component={RoleSelection} />
                </Stack.Navigator>
            ) : role === 'parent' ? (
                <ParentStack />
            ) : (
                <TeacherStack />
            )}
        </NavigationContainer>
    );
}
