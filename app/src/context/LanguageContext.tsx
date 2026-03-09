import React, { createContext, useState, useContext } from 'react';
import { I18n } from 'i18n-js';

const translations = {
    en: {
        attendance: "Attendance",
        homework: "Homework",
        notices: "Notices",
        fees: "Fees",
        select_student: "Select Student",
        add_child: "+ Add Another Child",
        class_label: "Class",
        teacher_dashboard: "Teacher Dashboard",
        parent_dashboard: "Parent Dashboard",
        present: "Present",
        absent: "Absent",
        leave: "Leave",
        save: "Save",
        all_present: "All Present",
        clear: "Clear Selection",
        holidays: "Holidays",
        announcements: "Announcements",
        student_id: "Student ID or Admission No.",
        link_child: "Link Child",
        cancel: "Cancel",
        switch_role: "Switch Role",
        latest_announcement: "Latest Announcement",
        play_audio: "Play Audio Message",
        mark_absent_mode: "Mark Absent Mode",
    },
    hi: {
        attendance: "उपस्थिति",
        homework: "होमवर्क",
        notices: "सूचनाएं",
        fees: "फीस",
        select_student: "छात्र चुनें",
        add_child: "+ एक और बच्चा जोड़ें",
        class_label: "कक्षा",
        teacher_dashboard: "शिक्षक डैशबोर्ड",
        parent_dashboard: "अभिभावक डैशबोर्ड",
        present: "उपस्थित",
        absent: "अनुपस्थित",
        leave: "छुट्टी",
        save: "सहेजें",
        all_present: "सभी उपस्थित",
        clear: "चयन साफ़ करें",
        holidays: "छुट्टियां",
        announcements: "घोषणाएँ",
        student_id: "छात्र आईडी या प्रवेश संख्या",
        link_child: "बच्चे को जोड़ें",
        cancel: "रद्द करें",
        switch_role: "भूमिका बदलें",
        latest_announcement: "नवीनतम घोषणा",
        play_audio: "ऑडियो संदेश चलाएं",
        mark_absent_mode: "अनुपस्थित मोड",
    },
    pa: {
        attendance: "ਹਾਜ਼ਰੀ",
        homework: "ਹੋਮਵਰਕ",
        notices: "ਨੋਟਿਸ",
        fees: "ਫੀਸ",
        select_student: "ਵਿਦਿਆਰਥੀ ਚੁਣੋ",
        add_child: "+ ਇੱਕ ਹੋਰ ਬੱਚਾ ਸ਼ਾਮਲ ਕਰੋ",
        class_label: "ਕਲਾਸ",
        teacher_dashboard: "ਅਧਿਆਪਕ ਡੈਸ਼ਬੋਰਡ",
        parent_dashboard: "ਮਾਤਾ-ਪਿਤਾ ਡੈਸ਼ਬੋਰਡ",
        present: "ਹਾਜ਼ਰ",
        absent: "ਗੈਰਹਾਜ਼ਰ",
        leave: "ਛੁੱਟੀ",
        save: "ਸੇਵ ਕਰੋ",
        all_present: "ਸਾਰੇ ਹਾਜ਼ਰ",
        clear: "ਚੋਣ ਸਾਫ਼ ਕਰੋ",
        holidays: "ਛੁੱਟੀਆਂ",
        announcements: "ਘੋਸ਼ਣਾਵਾਂ",
        student_id: "ਵਿਦਿਆਰਥੀ ਆਈਡੀ ਜਾਂ ਦਾਖਲਾ ਨੰਬਰ",
        link_child: "ਬੱਚੇ ਨੂੰ ਜੋੜੋ",
        cancel: "ਰੱਦ ਕਰੋ",
        switch_role: "ਭੂਮਿਕਾ ਬਦਲੋ",
        latest_announcement: "ਤਾਜ਼ਾ ਘੋਸ਼ਣਾ",
        play_audio: "ਆਡੀਓ ਸੁਣੋ",
        mark_absent_mode: "ਗੈਰਹਾਜ਼ਰ ਮੋਡ",
    }
};

const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.locale = 'en';

export const LanguageContext = createContext({
    lang: 'en',
    setLang: (lang: string) => { },
    t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState('en');

    const setLanguage = (newLang: string) => {
        i18n.locale = newLang;
        setLang(newLang);
    };

    const t = (key: string) => i18n.t(key);

    return (
        <LanguageContext.Provider value={{ lang, setLang: setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    return useContext(LanguageContext);
}
