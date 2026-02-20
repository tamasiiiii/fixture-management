import { create } from 'zustand';
import {
    Fixture,
    BorrowRecord,
    RepairRecord,
    FixtureStatus,
    BorrowStatus,
    RepairStatus,
} from '../types';
import {
    defaultFixtures,
    defaultBorrowRecords,
    defaultRepairRecords,
} from '../data/mockData';

interface FixtureState {
    fixtures: Fixture[];
    borrowRecords: BorrowRecord[];
    repairRecords: RepairRecord[];

    // Fixture CRUD
    addFixture: (fixture: Omit<Fixture, 'id' | 'createdAt'>) => void;
    updateFixture: (id: string, data: Partial<Fixture>) => void;
    deleteFixture: (id: string) => void;
    getFixturesByStatus: (status: FixtureStatus) => Fixture[];

    // Borrow operations
    borrowFixture: (record: Omit<BorrowRecord, 'id'>) => void;
    returnFixture: (borrowId: string, returnerId: string, returnerName: string) => void;
    sendToRepair: (
        borrowId: string,
        returnerId: string,
        returnerName: string,
        repairDescription: string
    ) => void;
    getBorrowRecordsByBorrower: (borrowerId: string) => BorrowRecord[];
    getActiveBorrowRecords: () => BorrowRecord[];

    // Repair operations
    startRepair: (repairId: string, repairerId: string, repairerName: string) => void;
    completeRepair: (
        repairId: string,
        diagnosis: string,
        solution: string,
        cost: number
    ) => void;
    getRepairsByStatus: (status: RepairStatus) => RepairRecord[];
    getRepairHistory: () => RepairRecord[];
}

const loadFixtures = (): Fixture[] => {
    const stored = localStorage.getItem('fixture_fixtures');
    return stored ? JSON.parse(stored) : defaultFixtures;
};

const loadBorrowRecords = (): BorrowRecord[] => {
    const stored = localStorage.getItem('fixture_borrow_records');
    return stored ? JSON.parse(stored) : defaultBorrowRecords;
};

const loadRepairRecords = (): RepairRecord[] => {
    const stored = localStorage.getItem('fixture_repair_records');
    return stored ? JSON.parse(stored) : defaultRepairRecords;
};

const saveFixtures = (fixtures: Fixture[]) =>
    localStorage.setItem('fixture_fixtures', JSON.stringify(fixtures));
const saveBorrowRecords = (records: BorrowRecord[]) =>
    localStorage.setItem('fixture_borrow_records', JSON.stringify(records));
const saveRepairRecords = (records: RepairRecord[]) =>
    localStorage.setItem('fixture_repair_records', JSON.stringify(records));

export const useFixtureStore = create<FixtureState>((set, get) => ({
    fixtures: loadFixtures(),
    borrowRecords: loadBorrowRecords(),
    repairRecords: loadRepairRecords(),

    // =========== Fixture CRUD ===========
    addFixture: (fixtureData) => {
        const newFixture: Fixture = {
            ...fixtureData,
            id: 'f' + Date.now(),
            createdAt: new Date().toISOString().split('T')[0],
        };
        const updated = [...get().fixtures, newFixture];
        set({ fixtures: updated });
        saveFixtures(updated);
    },

    updateFixture: (id, data) => {
        const updated = get().fixtures.map((f) =>
            f.id === id ? { ...f, ...data } : f
        );
        set({ fixtures: updated });
        saveFixtures(updated);
    },

    deleteFixture: (id) => {
        const updated = get().fixtures.filter((f) => f.id !== id);
        set({ fixtures: updated });
        saveFixtures(updated);
    },

    getFixturesByStatus: (status) => {
        return get().fixtures.filter((f) => f.status === status);
    },

    // =========== Borrow Operations ===========
    borrowFixture: (recordData) => {
        const newRecord: BorrowRecord = {
            ...recordData,
            id: 'b' + Date.now(),
        };
        const updatedRecords = [...get().borrowRecords, newRecord];
        const updatedFixtures = get().fixtures.map((f) =>
            f.id === recordData.fixtureId ? { ...f, status: 'borrowed' as FixtureStatus } : f
        );
        set({ borrowRecords: updatedRecords, fixtures: updatedFixtures });
        saveBorrowRecords(updatedRecords);
        saveFixtures(updatedFixtures);
    },

    returnFixture: (borrowId, returnerId, returnerName) => {
        const record = get().borrowRecords.find((r) => r.id === borrowId);
        if (!record) return;

        const updatedRecords = get().borrowRecords.map((r) =>
            r.id === borrowId
                ? {
                    ...r,
                    status: 'returned' as BorrowStatus,
                    actualReturnDate: new Date().toISOString().split('T')[0],
                    returnerId,
                    returnerName,
                }
                : r
        );
        const updatedFixtures = get().fixtures.map((f) =>
            f.id === record.fixtureId ? { ...f, status: 'available' as FixtureStatus } : f
        );
        set({ borrowRecords: updatedRecords, fixtures: updatedFixtures });
        saveBorrowRecords(updatedRecords);
        saveFixtures(updatedFixtures);
    },

    sendToRepair: (borrowId, returnerId, returnerName, repairDescription) => {
        const record = get().borrowRecords.find((r) => r.id === borrowId);
        if (!record) return;

        // Update borrow record
        const updatedBorrowRecords = get().borrowRecords.map((r) =>
            r.id === borrowId
                ? {
                    ...r,
                    status: 'sent_to_repair' as BorrowStatus,
                    actualReturnDate: new Date().toISOString().split('T')[0],
                    returnerId,
                    returnerName,
                }
                : r
        );

        // Create repair record
        const newRepairRecord: RepairRecord = {
            id: 'r' + Date.now(),
            fixtureId: record.fixtureId,
            fixtureName: record.fixtureName,
            fixtureCode: record.fixtureCode,
            requestDate: new Date().toISOString().split('T')[0],
            description: repairDescription,
            status: 'pending',
            requestedBy: returnerId,
            requestedByName: returnerName,
        };
        const updatedRepairRecords = [...get().repairRecords, newRepairRecord];

        // Update fixture status
        const updatedFixtures = get().fixtures.map((f) =>
            f.id === record.fixtureId
                ? { ...f, status: 'repairing' as FixtureStatus }
                : f
        );

        set({
            borrowRecords: updatedBorrowRecords,
            repairRecords: updatedRepairRecords,
            fixtures: updatedFixtures,
        });
        saveBorrowRecords(updatedBorrowRecords);
        saveRepairRecords(updatedRepairRecords);
        saveFixtures(updatedFixtures);
    },

    getBorrowRecordsByBorrower: (borrowerId) => {
        return get().borrowRecords.filter((r) => r.borrowerId === borrowerId);
    },

    getActiveBorrowRecords: () => {
        return get().borrowRecords.filter((r) => r.status === 'active');
    },

    // =========== Repair Operations ===========
    startRepair: (repairId, repairerId, repairerName) => {
        const updated = get().repairRecords.map((r) =>
            r.id === repairId
                ? {
                    ...r,
                    status: 'in_progress' as RepairStatus,
                    repairerId,
                    repairerName,
                    startDate: new Date().toISOString().split('T')[0],
                }
                : r
        );
        set({ repairRecords: updated });
        saveRepairRecords(updated);
    },

    completeRepair: (repairId, diagnosis, solution, cost) => {
        const record = get().repairRecords.find((r) => r.id === repairId);
        if (!record) return;

        const updatedRepairs = get().repairRecords.map((r) =>
            r.id === repairId
                ? {
                    ...r,
                    status: 'completed' as RepairStatus,
                    endDate: new Date().toISOString().split('T')[0],
                    diagnosis,
                    solution,
                    cost,
                }
                : r
        );

        const updatedFixtures = get().fixtures.map((f) =>
            f.id === record.fixtureId
                ? { ...f, status: 'available' as FixtureStatus }
                : f
        );

        set({ repairRecords: updatedRepairs, fixtures: updatedFixtures });
        saveRepairRecords(updatedRepairs);
        saveFixtures(updatedFixtures);
    },

    getRepairsByStatus: (status) => {
        return get().repairRecords.filter((r) => r.status === status);
    },

    getRepairHistory: () => {
        return get().repairRecords.filter((r) => r.status === 'completed');
    },
}));
