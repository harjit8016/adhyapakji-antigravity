/**
 * Announcement Service Unit Tests
 *
 * Mocks the Supabase client to test:
 *  - createAnnouncement (insert announcement + targets)
 *  - getAnnouncementsForClass
 *  - getAnnouncementsForStudent
 */

// ── Mock Setup ────────────────────────────────────────────
const mockSelect = jest.fn().mockReturnThis();
const mockSingle = jest.fn();
const mockEq = jest.fn().mockReturnThis();
const mockOrder = jest.fn().mockReturnThis();
const mockInsert = jest.fn().mockReturnThis();
const mockFrom = jest.fn(() => ({
    insert: mockInsert,
    select: mockSelect,
    single: mockSingle,
    eq: mockEq,
    order: mockOrder,
}));

jest.mock('../src/services/supabaseClient', () => ({
    supabase: {
        from: mockFrom,
    },
}));

import {
    createAnnouncement,
    getAnnouncementsForClass,
    getAnnouncementsForStudent,
} from '../src/services/announcementService';

describe('announcementService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFrom.mockReturnValue({
            insert: mockInsert,
            select: mockSelect,
            single: mockSingle,
            eq: mockEq,
            order: mockOrder,
        });
        mockInsert.mockReturnThis();
        mockSelect.mockReturnThis();
        mockEq.mockReturnThis();
    });

    test('createAnnouncement inserts announcement then targets', async () => {
        // First from('announcements').insert().select().single()
        mockSingle.mockResolvedValueOnce({
            data: { id: 'ann1', title: 'Test' },
            error: null,
        });

        // Second from('announcement_targets').insert()
        const insertTargets = jest.fn().mockResolvedValue({ error: null });
        mockFrom
            .mockReturnValueOnce({ insert: mockInsert, select: mockSelect, single: mockSingle, eq: mockEq, order: mockOrder } as any)
            .mockReturnValueOnce({ insert: insertTargets, select: mockSelect, single: mockSingle, eq: mockEq, order: mockOrder } as any);

        const result = await createAnnouncement({
            authorId: 'teacher1',
            title: 'Test',
            description: 'Desc',
            type: 'text',
            targets: [{ classId: 'c1' }],
        });

        expect(result).toEqual({ id: 'ann1', title: 'Test' });
        expect(mockFrom).toHaveBeenCalledWith('announcements');
    });

    test('createAnnouncement throws on announcement insert error', async () => {
        mockSingle.mockResolvedValue({
            data: null,
            error: { message: 'Insert failed' },
        });

        await expect(
            createAnnouncement({
                authorId: 'teacher1',
                title: 'Test',
                type: 'text',
                targets: [],
            })
        ).rejects.toEqual({ message: 'Insert failed' });
    });

    test('getAnnouncementsForClass returns mapped announcements', async () => {
        const targetData = [
            { announcement_id: 'a1', announcements: { id: 'a1', title: 'Notice 1' } },
            { announcement_id: 'a2', announcements: { id: 'a2', title: 'Notice 2' } },
        ];
        mockOrder.mockResolvedValue({ data: targetData, error: null });

        const result = await getAnnouncementsForClass('c1');

        expect(mockFrom).toHaveBeenCalledWith('announcement_targets');
        expect(result).toEqual([
            { id: 'a1', title: 'Notice 1' },
            { id: 'a2', title: 'Notice 2' },
        ]);
    });

    test('getAnnouncementsForClass returns empty when no data', async () => {
        mockOrder.mockResolvedValue({ data: null, error: null });

        const result = await getAnnouncementsForClass('c1');
        expect(result).toEqual([]);
    });

    test('getAnnouncementsForStudent returns mapped announcements', async () => {
        const targetData = [
            { announcement_id: 'a1', announcements: { id: 'a1', title: 'For Student' } },
        ];
        mockOrder.mockResolvedValue({ data: targetData, error: null });

        const result = await getAnnouncementsForStudent('s1');

        expect(mockFrom).toHaveBeenCalledWith('announcement_targets');
        expect(result).toEqual([{ id: 'a1', title: 'For Student' }]);
    });

    test('getAnnouncementsForStudent throws on error', async () => {
        mockOrder.mockResolvedValue({ data: null, error: { message: 'Query failed' } });

        await expect(getAnnouncementsForStudent('s1')).rejects.toEqual({ message: 'Query failed' });
    });
});
