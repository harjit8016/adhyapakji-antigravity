import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
    Pressable,
    Animated,
} from 'react-native';
import {
    School, Users, UserCheck,
    Mic, Square, Play, Trash2, Pause,
    Camera, Image as ImageIcon,
    CheckCircle2, ChevronRight, Send,
    BookOpen, Bell, Calendar, Megaphone,
} from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useLang } from '../../context/LanguageContext';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/theme';
import type { ClassStudent } from '../../types';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';
import VoiceWaves from '../../components/VoiceWaves';
import { createAnnouncement } from '../../services/announcementService';
import { supabase } from '../../services/supabaseClient';
import { buildTargets, formatTargetLabel, Scope } from './announcementUtils';

type WizardStep = 'target' | 'compose' | 'category' | 'review';
type NoticeCategory = 'announcement' | 'homework' | 'event' | 'reminder';

const STEPS: WizardStep[] = ['target', 'compose', 'category', 'review'];

const CATEGORIES: { key: NoticeCategory; icon: any; color: string; labelKey: string }[] = [
    { key: 'announcement', icon: Megaphone, color: COLORS.primary, labelKey: 'announcement' },
    { key: 'homework', icon: BookOpen, color: '#7C3AED', labelKey: 'homework' },
    { key: 'event', icon: Calendar, color: '#EA580C', labelKey: 'event' },
    { key: 'reminder', icon: Bell, color: COLORS.secondary, labelKey: 'reminder' },
];

export default function TeacherAnnouncements() {
    const { t } = useLang();
    const { classStudents, notices, setNotices, activeTeacherClassId, teacherClasses, setActiveTeacherClassId } = useAppStore();

    // Wizard navigation state
    const [step, setStep] = useState<WizardStep>('target');

    // Target (Step 1) state
    const [scope, setScope] = useState<Scope>('school');
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([activeTeacherClassId]);
    const [studentClassId, setStudentClassId] = useState<string>(activeTeacherClassId);
    const [studentSelectionMode, setStudentSelectionMode] = useState<'whole' | 'subset'>('whole');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Compose (Step 2) state
    const [message, setMessage] = useState('');
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioLevel, setAudioLevel] = useState(-160);
    const [recordingTime, setRecordingTime] = useState(0);
    const [showClassDropdown, setShowClassDropdown] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Category (Step 3) state
    const [category, setCategory] = useState<NoticeCategory>('announcement');

    // Sending state
    const [isSending, setIsSending] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const successAnim = useRef(new Animated.Value(0)).current;
    const sendSoundRef = useRef<Audio.Sound | null>(null);

    const filteredStudents = useMemo(() =>
        classStudents.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.roll.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [classStudents, searchQuery]);

    useEffect(() => {
        return () => { sendSoundRef.current?.unloadAsync(); };
    }, []);

    useEffect(() => {
        if (scope === 'students') {
            setStudentClassId(activeTeacherClassId);
            setSelectedStudents([]);
            setStudentSelectionMode('whole');
        }
    }, [activeTeacherClassId, scope]);

    // ─── Helpers ───────────────────────────────────────────────────────────────

    const classNameById = (id: string | undefined) => teacherClasses.find(c => c.id === id)?.name || '';

    const getScopeLabel = () => {
        if (scope === 'school') return t('announcement_scope_school') || 'Whole School';
        if (scope === 'classes') return selectedClassIds.length
            ? `${selectedClassIds.length} ${t('classes') || 'Classes'}`
            : t('select_classes') || 'Select classes';
        if (studentSelectionMode === 'whole') return `${classNameById(studentClassId)} • ${t('whole_class') || 'Whole Class'}`;
        if (selectedStudents.length === 0) return t('announcement_select_students') || 'Select students';
        return `${classNameById(studentClassId)} • ${selectedStudents.length} ${t('students') || 'Students'}`;
    };

    const canProceedFromTarget = () => {
        if (scope === 'school') return true;
        if (scope === 'classes') return selectedClassIds.length > 0;
        return true; // students — defaults to whole class
    };

    const canProceedFromCompose = () => message.trim().length > 0 || !!audioUri;

    const formatLabel = (notice: any) => formatTargetLabel(notice, teacherClasses);

    // ─── Audio ─────────────────────────────────────────────────────────────────

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
            const recordingOptions: Audio.RecordingOptions = {
                ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
                isMeteringEnabled: true,
            };
            const { recording: rec } = await Audio.Recording.createAsync(recordingOptions);
            rec.setProgressUpdateInterval(50);
            rec.setOnRecordingStatusUpdate((status) => {
                if (status.isRecording && status.metering !== undefined) setAudioLevel(status.metering);
            });
            setRecording(rec);
            
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch {
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        setRecording(null);
        if (timerRef.current) clearInterval(timerRef.current);
        await recording.stopAndUnloadAsync();
        setAudioUri(recording.getURI());
    };

    const playPreview = async () => {
        if (!audioUri) return;
        if (isPlaying && sound) { await sound.pauseAsync(); setIsPlaying(false); return; }
        try {
            const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri }, { shouldPlay: true });
            setSound(newSound);
            setIsPlaying(true);
            newSound.setOnPlaybackStatusUpdate((status: any) => { if (status.didJustFinish) setIsPlaying(false); });
        } catch { Alert.alert('Error', 'Failed to play audio'); }
    };

    const discardAudio = () => { 
        sound?.unloadAsync(); 
        setAudioUri(null); 
        setIsPlaying(false); 
        setRecordingTime(0);
    };

    const pickImage = async (useCamera: boolean) => {
        const { status } = await (useCamera ? ImagePicker.requestCameraPermissionsAsync() : ImagePicker.requestMediaLibraryPermissionsAsync());
        if (status !== 'granted') return Alert.alert('Permission denied');
        const result = useCamera ? await ImagePicker.launchCameraAsync({ quality: 0.7 }) : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
        if (!result.canceled) Alert.alert('Success', 'Image attached');
    };

    // ─── Send ──────────────────────────────────────────────────────────────────

    const uploadAudioIfNeeded = async (): Promise<string | undefined> => {
        if (!audioUri) return undefined;
        try {
            const response = await fetch(audioUri);
            const blob = await response.blob();
            const filePath = `audio/${Date.now()}.m4a`;
            const { data, error } = await supabase.storage.from('announcements').upload(filePath, blob, { cacheControl: '3600', upsert: false });
            if (error) throw error;
            const { data: publicUrl } = supabase.storage.from('announcements').getPublicUrl(data.path);
            return publicUrl.publicUrl;
        } catch { return undefined; }
    };

    const handleSend = async () => {
        setIsSending(true);
        const targets = buildTargets(scope, teacherClasses, selectedClassIds, studentSelectionMode, studentClassId, selectedStudents);
        const { data: userData } = await supabase.auth.getUser();
        const authorId = userData?.user?.id || 'demo-teacher';
        const uploadedAudioUrl = await uploadAudioIfNeeded();

        const newNotice = {
            id: Date.now().toString(),
            titleRaw: getCategoryLabel(),
            descRaw: message,
            type: audioUri ? 'audio' : 'text' as 'audio' | 'text',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            audioUri: uploadedAudioUrl || audioUri || undefined,
            scope,
            targetStudents: scope === 'students' && studentSelectionMode === 'subset' ? selectedStudents : undefined,
            targetClassIds: scope === 'classes' ? selectedClassIds : scope === 'school' ? teacherClasses.map(c => c.id) : studentSelectionMode === 'whole' ? [studentClassId] : undefined,
            targetClassId: studentSelectionMode === 'whole' ? studentClassId : undefined,
            category,
        };

        try {
            await createAnnouncement({ authorId, title: newNotice.titleRaw, description: newNotice.descRaw, type: newNotice.type, audioUrl: uploadedAudioUrl, fileUrl: undefined, targets });
        } catch { /* keep local fallback */ }

        setNotices([newNotice, ...notices]);

        // Reset state
        setMessage('');
        setAudioUri(null);
        setSelectedStudents([]);
        setStudentSelectionMode('whole');
        setScope('school');
        setCategory('announcement');
        setStep('target');
        setIsSending(false);
        setShowSuccess(true);

        Animated.sequence([
            Animated.timing(successAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.delay(900),
            Animated.timing(successAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => setShowSuccess(false));
    };

    // ─── UI Helpers ────────────────────────────────────────────────────────────

    const getCategoryLabel = () => {
        const cat = CATEGORIES.find(c => c.key === category);
        return cat ? (t(cat.labelKey) || cat.labelKey) : 'Announcement';
    };

    const getCategoryColor = () => CATEGORIES.find(c => c.key === category)?.color || COLORS.primary;

    const stepIndex = STEPS.indexOf(step);

    const goNext = () => {
        const nextStep = STEPS[stepIndex + 1];
        if (nextStep) setStep(nextStep);
    };

    const goBack = () => {
        const prevStep = STEPS[stepIndex - 1];
        if (prevStep) setStep(prevStep);
    };

    // ─── Step 1: Target ────────────────────────────────────────────────────────

    const renderTarget = () => (
        <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
            {/* Scope Cards */}
            <View style={styles.scopeCardsWrap}>
                {[
                    { key: 'school', icon: School, label: t('announcement_scope_school') || 'Whole School', desc: t('scope_school_desc') || 'All students and parents', color: COLORS.primary },
                    { key: 'classes', icon: Users, label: t('announcement_scope_classes') || 'Multiple Classes', desc: t('scope_classes_desc') || 'Select specific classes', color: '#A855F7' }, // purple-500
                    { key: 'students', icon: UserCheck, label: t('announcement_scope_students') || 'Specific Students', desc: t('scope_students_desc') || 'Target individual students', color: '#F97316' }, // orange-500
                ].map((option) => {
                    const Icon = option.icon;
                    const isActive = scope === option.key;
                    return (
                        <Pressable
                            key={option.key}
                            onPress={() => setScope(option.key as Scope)}
                            style={({ pressed }) => [
                                styles.scopeCard,
                                isActive && { borderColor: COLORS.primary, borderWidth: 4 }, // Thick blue border like Figma
                                pressed && { opacity: 0.85 }
                            ]}
                        >
                            <View style={[styles.scopeIconBox, { backgroundColor: option.color }]}>
                                <Icon size={32} color="#FFF" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppText variant="h2" weight="bold" color={COLORS.textDark}>{option.label}</AppText>
                                <AppText color={COLORS.textMuted}>{option.desc}</AppText>
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            {/* Class selector when 'classes' scope */}
            {scope === 'classes' && (
                <View style={styles.subCard}>
                    <AppText weight="bold" style={styles.label}>{t('select_classes') || 'Select Classes'}</AppText>
                    <View style={styles.classGridSquare}>
                        {teacherClasses.map(cls => {
                            const active = selectedClassIds.includes(cls.id);
                            return (
                                <Pressable
                                    key={cls.id}
                                    onPress={() => setSelectedClassIds(prev => active ? prev.filter(id => id !== cls.id) : [...prev, cls.id])}
                                    style={[
                                        styles.classBox,
                                        active ? styles.classBoxActive : styles.classBoxInactive
                                    ]}
                                >
                                    <AppText weight="bold" color={active ? COLORS.statusPresent : COLORS.textDark}>Class {cls.name}</AppText>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            )}

            {/* Student selector when 'students' scope */}
            {scope === 'students' && (
                <AppCard style={styles.subCard}>
                    <AppText variant="h2" weight="bold" style={styles.label}>{t('select_class_first') || 'Choose Class'}</AppText>
                    {/* Fake Dropdown */}
                    <Pressable
                        onPress={() => setShowClassDropdown(!showClassDropdown)}
                        style={styles.dropdownToggle}
                    >
                        <AppText weight="bold">Class {classNameById(studentClassId)}</AppText>
                        <ChevronRight size={20} color={COLORS.textDark} style={{ transform: [{ rotate: showClassDropdown ? '90deg' : '0deg' }] }} />
                    </Pressable>
                    
                    {showClassDropdown && (
                        <View style={styles.dropdownMenu}>
                            {teacherClasses.map(cls => (
                                <Pressable
                                    key={cls.id}
                                    onPress={() => {
                                        setStudentClassId(cls.id);
                                        setActiveTeacherClassId(cls.id);
                                        setSelectedStudents([]);
                                        setShowClassDropdown(false);
                                    }}
                                    style={[styles.dropdownItem, studentClassId === cls.id && { backgroundColor: '#EFF6FF' }]}
                                >
                                    <AppText weight={studentClassId === cls.id ? 'bold' : 'normal'} color={studentClassId === cls.id ? COLORS.primary : COLORS.textDark}>
                                        Class {cls.name}
                                    </AppText>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    <View style={styles.tabRow}>
                        {(['whole', 'subset'] as const).map(mode => (
                            <Pressable
                                key={mode}
                                onPress={() => { setStudentSelectionMode(mode); if (mode === 'whole') setSelectedStudents([]); }}
                                style={[styles.tabButton, studentSelectionMode === mode && styles.tabButtonActive]}
                            >
                                <AppText weight="bold" color={studentSelectionMode === mode ? COLORS.textLight : COLORS.primary}>
                                    {mode === 'whole' ? (t('whole_class') || 'Whole Class') : (t('pick_students') || 'Pick Students')}
                                </AppText>
                            </Pressable>
                        ))}
                    </View>

                    {studentSelectionMode === 'subset' && (
                        <>
                            <TextInput
                                style={styles.searchInput}
                                placeholder={t('search_students') || 'Search students...'}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <Pressable onPress={() => setSelectedStudents(filteredStudents.length === selectedStudents.length ? [] : filteredStudents.map(s => s.id))} style={styles.selectAllRow}>
                                <View style={styles.checkbox}>
                                    {selectedStudents.length === classStudents.length && classStudents.length > 0 && <CheckCircle2 size={24} color={COLORS.primary} />}
                                </View>
                                <AppText weight="bold" color={COLORS.primary}>{t('select_all_students') || 'Select all'}</AppText>
                            </Pressable>
                            {filteredStudents.map((s: ClassStudent) => {
                                const sel = selectedStudents.includes(s.id);
                                return (
                                    <Pressable key={s.id} onPress={() => setSelectedStudents(prev => sel ? prev.filter(id => id !== s.id) : [...prev, s.id])} style={styles.studentRow}>
                                        <View style={styles.checkbox}>{sel && <CheckCircle2 size={24} color={COLORS.primary} />}</View>
                                        <AppText weight="bold" style={{ width: 40 }} color={COLORS.textMuted}>{s.roll}</AppText>
                                        <AppText weight="bold" style={{ flex: 1 }}>{s.name}</AppText>
                                        <ChevronRight size={20} color={COLORS.textMuted} />
                                    </Pressable>
                                );
                            })}
                        </>
                    )}
                </AppCard>
            )}
        </ScrollView>
    );

    // ─── Step 2: Compose ───────────────────────────────────────────────────────

    const renderCompose = () => (
        <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <AppText variant="hero" weight="bold" color={COLORS.textDark} style={styles.stepHeading}>
                {t('compose_message') || 'Compose Message'}
            </AppText>
            <AppText color={COLORS.textMuted} style={styles.stepSub}>
                {t('sending_to') || 'Sending to'}: <AppText weight="bold" color={COLORS.primary}>{getScopeLabel()}</AppText>
            </AppText>

            <AppCard style={styles.composeCard}>
                <TextInput
                    style={styles.textInput}
                    placeholder={t('write_message') || 'Write your message here...'}
                    multiline
                    value={message}
                    onChangeText={setMessage}
                    placeholderTextColor={COLORS.textMuted}
                />
            </AppCard>

            {/* Voice Note Section */}
            <AppCard style={styles.voiceCard}>
                <AppText variant="h2" weight="bold" style={styles.label}>{t('voice_message') || 'Voice Note'}</AppText>

                {!audioUri && !recording && (
                    <Pressable style={styles.recordBtn} onPress={startRecording}>
                        <Mic size={32} color={COLORS.primary} />
                        <AppText variant="small" weight="bold" color={COLORS.primary} style={{ marginTop: 8 }}>
                            {t('tap_to_record') || 'Tap to Record'}
                        </AppText>
                    </Pressable>
                )}

                {recording && (
                    <AppCard style={styles.recordingActiveCard}>
                        <View style={styles.micPulseCircle}>
                            <Mic size={40} color="#FFF" />
                        </View>
                        <AppText variant="hero" weight="bold" color="#FFF" style={{ marginBottom: 8 }}>{recordingTime}s</AppText>
                        <View style={styles.pulsingBarsGroup}>
                            <View style={[styles.pulseBar, { height: 30 }]} />
                            <View style={[styles.pulseBar, { height: 45 }]} />
                            <View style={[styles.pulseBar, { height: 25 }]} />
                            <View style={[styles.pulseBar, { height: 35 }]} />
                        </View>
                        <AppButton 
                            title={t('stop_recording') || 'Stop Recording'} 
                            onPress={stopRecording} 
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 0, marginTop: SPACING.md }} 
                            textStyle={{ color: '#FFF' }}
                        />
                    </AppCard>
                )}

                {audioUri && (
                    <AppCard style={styles.audioPreviewCard}>
                        <View style={styles.audioPreviewLeft}>
                            <Pressable style={styles.playBtnSquare} onPress={playPreview}>
                                {isPlaying ? <Pause size={24} color="#FFF" /> : <Play size={24} color="#FFF" />}
                            </Pressable>
                            <View>
                                <AppText weight="bold" color={COLORS.textDark}>{t('audio_message') || 'Audio Message'}</AppText>
                                <AppText variant="small" color={COLORS.textMuted}>{recordingTime}s</AppText>
                            </View>
                        </View>
                        <Pressable onPress={discardAudio} style={styles.discardBtnMinimal}>
                            <Trash2 size={24} color={COLORS.statusAbsent} />
                        </Pressable>
                    </AppCard>
                )}
            </AppCard>

            {/* Media Toolbar */}
            <View style={styles.mediaRow}>
                <Pressable style={styles.mediaBtn} onPress={() => pickImage(true)}>
                    <Camera size={22} color={COLORS.primary} />
                    <AppText variant="small" weight="bold" color={COLORS.primary}>{t('camera') || 'Camera'}</AppText>
                </Pressable>
                <Pressable style={styles.mediaBtn} onPress={() => pickImage(false)}>
                    <ImageIcon size={22} color={COLORS.primary} />
                    <AppText variant="small" weight="bold" color={COLORS.primary}>{t('gallery') || 'Gallery'}</AppText>
                </Pressable>
            </View>
        </ScrollView>
    );

    // ─── Step 3: Category ──────────────────────────────────────────────────────

    const renderCategory = () => (
        <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
            <AppText variant="hero" weight="bold" color={COLORS.textDark} style={styles.stepHeading}>
                {t('choose_category') || 'Choose Category'}
            </AppText>
            <AppText color={COLORS.textMuted} style={styles.stepSub}>
                {t('category_hint') || 'This helps parents find it easily'}
            </AppText>

            <View style={styles.categoryGrid}>
                {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const active = category === cat.key;
                    return (
                        <Pressable
                            key={cat.key}
                            onPress={() => setCategory(cat.key)}
                            style={({ pressed }) => [styles.categoryCard, active && { borderColor: cat.color, borderWidth: 2 }, pressed && { opacity: 0.85 }]}
                        >
                            <View style={[styles.catIconBox, { backgroundColor: active ? cat.color : COLORS.bgLight }]}>
                                <Icon size={28} color={active ? COLORS.cardBg : cat.color} />
                            </View>
                            <AppText variant="small" weight="bold" align="center" color={active ? cat.color : COLORS.textDark}>
                                {t(cat.labelKey) || cat.labelKey}
                            </AppText>
                            {active && (
                                <View style={[styles.activeDot, { backgroundColor: cat.color }]} />
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </ScrollView>
    );

    // ─── Step 4: Review ────────────────────────────────────────────────────────

    const renderReview = () => (
        <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
            <AppText variant="hero" weight="bold" color={COLORS.textDark} style={styles.stepHeading}>
                {t('review_and_send') || 'Review & Send'}
            </AppText>
            <AppText color={COLORS.textMuted} style={styles.stepSub}>
                {t('preview_notice') || 'This is how parents will see your notice'}
            </AppText>

            {/* Preview Card — mimics what parents see */}
            <AppCard style={styles.previewCard}>
                <View style={styles.previewHeaderNew}>
                    <View style={styles.previewAvatarT}>
                        <AppText weight="bold" color={COLORS.cardBg} style={{ fontSize: 20 }}>T</AppText>
                    </View>
                    <View style={styles.previewHeaderRight}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <AppText weight="bold" color={COLORS.textDark}>{t('teacher_label') || 'Teacher'}</AppText>
                            <View style={[styles.categoryBadgeMinimal, { backgroundColor: getCategoryColor() + '20' }]}>
                                <AppText style={{ fontSize: 12, fontWeight: '700', color: getCategoryColor() }}>
                                    {getCategoryLabel()}
                                </AppText>
                            </View>
                        </View>
                        <AppText variant="small" color={COLORS.textMuted}>{getScopeLabel()}</AppText>
                    </View>
                </View>

                {message ? (
                    <View>
                        <AppText variant="h2" weight="bold" color={COLORS.textDark} style={{ marginBottom: 4 }}>{t('announcement_title') || getCategoryLabel()}</AppText>
                        <AppText color={COLORS.textDark} style={styles.previewMessage}>{message}</AppText>
                    </View>
                ) : null}

                {audioUri && (
                    <View style={styles.audioPreviewMinimal}>
                        <Play size={20} color={COLORS.primary} />
                        <AppText variant="small" color={COLORS.textDark} style={{ marginLeft: 8 }}>
                            {t('audio_message') || 'Audio message'} ({recordingTime}s)
                        </AppText>
                    </View>
                )}
            </AppCard>

            {/* Send Button */}
            <AppButton
                title={t('send_notice') || 'Send Notification'}
                onPress={handleSend}
                loading={isSending}
                icon={<Send size={22} color={COLORS.cardBg} />}
                style={styles.sendBtn}
            />
        </ScrollView>
    );

    // ─── Full Render ───────────────────────────────────────────────────────────

    return (
        <View style={styles.root}>
            {/* Progress Bar */}
            <View style={styles.progressBarRow}>
                {STEPS.map((s, i) => (
                    <View
                        key={s}
                        style={[
                            styles.progressSegment,
                            i <= stepIndex && { backgroundColor: COLORS.primary }
                        ]}
                    />
                ))}
            </View>

            {/* Step labels */}
            <View style={styles.stepLabelRow}>
                {STEPS.map((s, i) => (
                    <AppText
                        key={s}
                        variant="small"
                        weight={i === stepIndex ? 'bold' : undefined}
                        color={i === stepIndex ? COLORS.primary : COLORS.textMuted}
                        style={{ flex: 1, textAlign: 'center', fontSize: 11 }}
                    >
                        {['Target', 'Compose', 'Category', 'Review'][i]}
                    </AppText>
                ))}
            </View>

            {/* Step content */}
            <View style={{ flex: 1 }}>
                {step === 'target' && renderTarget()}
                {step === 'compose' && renderCompose()}
                {step === 'category' && renderCategory()}
                {step === 'review' && renderReview()}
            </View>

            {/* Bottom nav (prev / next) */}
            {step !== 'review' && (
                <View style={styles.navRow}>
                    {stepIndex > 0 ? (
                        <AppButton
                            title={t('back') || 'Back'}
                            variant="outline"
                            onPress={goBack}
                            style={styles.navBtnBack}
                        />
                    ) : <View style={styles.navBtnBack} />}
                    <AppButton
                        title={step === 'category' ? (t('preview') || 'Preview') : (t('continue') || 'Continue')}
                        onPress={goNext}
                        style={styles.navBtnNext}
                        disabled={
                            (step === 'target' && !canProceedFromTarget()) ||
                            (step === 'compose' && !canProceedFromCompose())
                        }
                    />
                </View>
            )}
            {step === 'review' && stepIndex > 0 && (
                <View style={styles.navRow}>
                    <AppButton title={t('back') || 'Back'} variant="outline" onPress={goBack} style={[styles.navBtnBack, { flex: 1 }]} />
                </View>
            )}

            {/* Recent Notices — only show on first step */}
            {step === 'target' && notices.length > 0 && (
                <View style={styles.recentSection}>
                    <AppText variant="h2" weight="bold" style={styles.recentTitle}>
                        {t('recent_notices') || 'Recent Notices'}
                    </AppText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {notices.slice(0, 5).map((notice) => (
                            <AppCard key={notice.id} style={styles.recentCard}>
                                <AppText variant="small" weight="bold" numberOfLines={1}>{notice.titleRaw}</AppText>
                                {notice.type === 'audio' ? (
                                    <AppText variant="small" color={COLORS.textMuted}>🎵 Voice note</AppText>
                                ) : (
                                    <AppText variant="small" color={COLORS.textMuted} numberOfLines={2}>{notice.descRaw}</AppText>
                                )}
                                <AppText variant="small" color={COLORS.textMuted} style={{ marginTop: 4 }}>{notice.date}</AppText>
                            </AppCard>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Success toast */}
            {showSuccess && (
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.successToast,
                        { opacity: successAnim, transform: [{ scale: successAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }
                    ]}
                >
                    <CheckCircle2 size={28} color={COLORS.textLight} />
                    <AppText weight="bold" color={COLORS.textLight} style={{ marginLeft: 8 }}>
                        {t('notice_sent') || 'Notice sent!'}
                    </AppText>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    // Progress Bar
    progressBarRow: {
        flexDirection: 'row',
        gap: 4,
        padding: SPACING.md,
        paddingBottom: 4,
    },
    progressSegment: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D1D5DB',
    },
    stepLabelRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.sm,
    },
    // Step content
    stepContent: {
        padding: SPACING.md,
        paddingBottom: 20,
    },
    stepHeading: {
        marginBottom: SPACING.xs,
    },
    stepSub: {
        marginBottom: SPACING.lg,
    },
    // Target step
    scopeCardsWrap: {
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    scopeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        gap: SPACING.md,
        borderWidth: 4,
        borderColor: 'transparent',
    },
    scopeIconBox: {
        width: 64,
        height: 64,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subCard: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.xl,
    },
    label: {
        marginBottom: SPACING.sm,
    },
    classGridSquare: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    classBox: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: RADIUS.full,
        borderWidth: 2,
    },
    classBoxActive: {
        borderColor: COLORS.statusPresent,
        backgroundColor: '#DCFCE7', // green-50
    },
    classBoxInactive: {
        borderColor: '#D1D5DB', // gray-300
        backgroundColor: 'transparent',
    },
    classChipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    classChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.primary,
        minHeight: 38,
        justifyContent: 'center',
    },
    classChipActive: {
        backgroundColor: COLORS.primary,
    },
    tabRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    tabButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.primary,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: COLORS.primary,
    },
    searchInput: {
        backgroundColor: COLORS.cardBg,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textDark,
    },
    selectAllRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.infoBlueBg,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
    },
    checkbox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: COLORS.cardBg,
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    // Compose step
    composeCard: {
        marginBottom: SPACING.md,
    },
    textInput: {
        minHeight: 140,
        fontSize: TYPOGRAPHY.body,
        padding: SPACING.md,
        backgroundColor: COLORS.bgLight,
        borderRadius: RADIUS.md,
        textAlignVertical: 'top',
        color: COLORS.textDark,
    },
    voiceCard: {
        marginBottom: SPACING.md,
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    recordBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
        backgroundColor: COLORS.infoBlueBg,
        borderRadius: RADIUS.full,
        width: 130,
        height: 130,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        marginTop: SPACING.sm,
    },
    recordingActive: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        padding: SPACING.md,
        marginTop: SPACING.md,
    },
    redDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.statusAbsent,
    },
    stopBtn: {
        backgroundColor: COLORS.statusAbsent,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    audioPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.infoBlueBg,
        padding: SPACING.md,
        borderRadius: RADIUS.full,
        width: '100%',
        gap: SPACING.md,
        marginTop: SPACING.sm,
    },
    playBtn: {
        backgroundColor: COLORS.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discardBtn: {
        padding: SPACING.sm,
    },
    mediaRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    mediaBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.cardBg,
    },
    // Category step
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: '47%',
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.md,
        borderWidth: 2,
        borderColor: 'transparent',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        gap: SPACING.sm,
    },
    catIconBox: {
        width: 64,
        height: 64,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 4,
    },
    // Target Step Extensions
    dropdownToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.bgLight,
        marginBottom: SPACING.md,
    },
    dropdownMenu: {
        backgroundColor: COLORS.bgLight,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        marginBottom: SPACING.md,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownItem: {
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    // Compose Audio Extensions
    recordingActiveCard: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#EF4444', 
        marginBottom: SPACING.md,
    },
    micPulseCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    pulsingBarsGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 60,
    },
    pulseBar: {
        width: 4,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 2,
    },
    audioPreviewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    audioPreviewLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    playBtnSquare: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discardBtnMinimal: {
        padding: SPACING.xs,
        backgroundColor: '#FEF2F2',
        borderRadius: RADIUS.sm,
    },
    // Review step Extensions
    previewHeaderNew: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    previewAvatarT: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewHeaderRight: {
        flex: 1,
    },
    categoryBadgeMinimal: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    audioPreviewMinimal: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: SPACING.sm,
        borderRadius: RADIUS.md,
        marginTop: SPACING.sm,
    },

    // Review step (Legacy items below, kept for backwards compatibility if used)
    previewCard: {
        marginBottom: SPACING.lg,
        padding: SPACING.lg,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    previewAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
        borderWidth: 1,
    },
    previewMessage: {
        lineHeight: 24,
        marginBottom: SPACING.sm,
    },
    sendBtn: {
        marginBottom: SPACING.xl,
    },
    // Bottom nav
    navRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        padding: SPACING.md,
        backgroundColor: COLORS.cardBg,
        borderTopWidth: 1,
        borderTopColor: COLORS.bgLight,
    },
    navBtnBack: {
        flex: 1,
    },
    navBtnNext: {
        flex: 2,
    },
    // Recent section
    recentSection: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.bgLight,
        maxHeight: 200,
    },
    recentTitle: {
        marginBottom: SPACING.sm,
    },
    recentCard: {
        width: 200,
        marginRight: SPACING.md,
        padding: SPACING.md,
    },
    // Toast
    successToast: {
        position: 'absolute',
        bottom: SPACING.xl,
        alignSelf: 'center',
        backgroundColor: COLORS.secondary,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.full,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
});
