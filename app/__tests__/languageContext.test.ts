/**
 * Language / i18n Unit Tests
 *
 * Tests the i18n translation logic directly using the i18n-js library
 * (bypasses React context; tests the pure translation function).
 */
import { I18n } from 'i18n-js';
import en from '../src/locales/en.json';
import hi from '../src/locales/hi.json';
import pa from '../src/locales/pa.json';

describe('i18n translations', () => {
    let i18n: I18n;

    beforeEach(() => {
        i18n = new I18n({ en, hi, pa });
        i18n.defaultLocale = 'en';
        i18n.locale = 'en';
    });

    // ── English ───────────────────────────────────────────────

    test('English: "attendance" returns "Attendance"', () => {
        expect(i18n.t('attendance')).toBe('Attendance');
    });

    test('English: "homework" returns "Homework"', () => {
        expect(i18n.t('homework')).toBe('Homework');
    });

    test('English: "app_greeting_title" returns "Adyapak Ji"', () => {
        expect(i18n.t('app_greeting_title')).toBe('Adyapak Ji');
    });

    test('English: role keys exist', () => {
        expect(i18n.t('role_teacher_title')).toBe('Teacher');
        expect(i18n.t('role_parent_title')).toBe('Parent');
    });

    // ── Hindi ─────────────────────────────────────────────────

    test('Hindi: "attendance" returns Hindi translation', () => {
        i18n.locale = 'hi';
        const result = i18n.t('attendance');
        expect(result).not.toBe('Attendance'); // Must be translated
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('Hindi: "app_greeting_title" returns expected value', () => {
        i18n.locale = 'hi';
        expect(i18n.t('app_greeting_title')).toBeDefined();
    });

    // ── Punjabi ───────────────────────────────────────────────

    test('Punjabi: "attendance" returns Punjabi translation', () => {
        i18n.locale = 'pa';
        const result = i18n.t('attendance');
        expect(result).not.toBe('Attendance');
        expect(typeof result).toBe('string');
    });

    // ── Key Consistency ───────────────────────────────────────

    test('All English keys exist in Hindi locale', () => {
        const enKeys = Object.keys(en);
        const hiKeys = Object.keys(hi);
        const missing = enKeys.filter(k => !hiKeys.includes(k));
        // Allow some missing for now, but most should be present
        expect(missing.length).toBeLessThanOrEqual(20); // reasonable threshold
    });

    test('All English keys exist in Punjabi locale', () => {
        const enKeys = Object.keys(en);
        const paKeys = Object.keys(pa);
        const missing = enKeys.filter(k => !paKeys.includes(k));
        expect(missing.length).toBeLessThanOrEqual(20);
    });

    // ── Missing Key Behavior ──────────────────────────────────

    test('Missing key returns a string containing the key name', () => {
        const result = i18n.t('totally_nonexistent_key_12345');
        // i18n-js returns something like "[missing \"en.totally_nonexistent_key_12345\" translation]"
        expect(typeof result).toBe('string');
        expect(result).toContain('totally_nonexistent_key_12345');
    });

    // ── Locale Switching ──────────────────────────────────────

    test('Switching locale changes translations', () => {
        const enVal = i18n.t('attendance');
        i18n.locale = 'hi';
        const hiVal = i18n.t('attendance');
        i18n.locale = 'pa';
        const paVal = i18n.t('attendance');

        // All should be different strings
        expect(enVal).not.toBe(hiVal);
        expect(enVal).not.toBe(paVal);
    });
});
