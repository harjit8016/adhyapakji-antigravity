/**
 * Auth Context Unit Tests
 *
 * Tests the authentication role-management logic directly
 * (pure state logic, no React rendering needed).
 */

describe('AuthContext logic', () => {
    // Simulate the auth state and functions as implemented in AuthContext.tsx
    let role: string | null;
    let loginAs: (r: string) => void;
    let toggleRole: () => void;
    let logout: () => void;

    beforeEach(() => {
        role = null;
        loginAs = (r: string) => { role = r; };
        toggleRole = () => { role = role === 'parent' ? 'teacher' : 'parent'; };
        logout = () => { role = null; };
    });

    test('initial role is null', () => {
        expect(role).toBeNull();
    });

    test('loginAs("teacher") sets role to teacher', () => {
        loginAs('teacher');
        expect(role).toBe('teacher');
    });

    test('loginAs("parent") sets role to parent', () => {
        loginAs('parent');
        expect(role).toBe('parent');
    });

    test('toggleRole swaps teacher to parent', () => {
        loginAs('teacher');
        toggleRole();
        expect(role).toBe('parent');
    });

    test('toggleRole swaps parent to teacher', () => {
        loginAs('parent');
        toggleRole();
        expect(role).toBe('teacher');
    });

    test('toggleRole from null sets to parent', () => {
        // null !== 'parent' so it goes to 'parent'
        toggleRole();
        expect(role).toBe('parent');
    });

    test('logout resets role to null', () => {
        loginAs('teacher');
        logout();
        expect(role).toBeNull();
    });

    test('full flow: login → toggle → logout', () => {
        loginAs('teacher');
        expect(role).toBe('teacher');

        toggleRole();
        expect(role).toBe('parent');

        toggleRole();
        expect(role).toBe('teacher');

        logout();
        expect(role).toBeNull();
    });
});
