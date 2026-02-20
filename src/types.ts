// ============================================================
// 夾具借還管理系統 - 資料類型定義
// ============================================================

export type UserRole = 'admin' | 'borrower' | 'returner' | 'repairer';

export interface User {
    id: string;
    username: string;
    password: string;
    name: string;
    role: UserRole;
    department: string;
    email: string;
    createdAt: string;
    active: boolean;
}

export type FixtureStatus = 'available' | 'borrowed' | 'repairing' | 'retired';

export interface Fixture {
    id: string;
    name: string;
    code: string;
    description: string;
    location: string;
    status: FixtureStatus;
    category: string;
    createdAt: string;
    imageUrl?: string;
}

export type BorrowStatus = 'active' | 'returned' | 'overdue' | 'sent_to_repair';

export interface BorrowRecord {
    id: string;
    fixtureId: string;
    fixtureName: string;
    fixtureCode: string;
    borrowerId: string;
    borrowerName: string;
    borrowDate: string;
    expectedReturnDate: string;
    actualReturnDate?: string;
    returnerId?: string;
    returnerName?: string;
    purpose: string;
    status: BorrowStatus;
    notes?: string;
}

export type RepairStatus = 'pending' | 'in_progress' | 'completed';

export interface RepairRecord {
    id: string;
    fixtureId: string;
    fixtureName: string;
    fixtureCode: string;
    repairerId?: string;
    repairerName?: string;
    requestDate: string;
    startDate?: string;
    endDate?: string;
    description: string;
    diagnosis?: string;
    solution?: string;
    cost?: number;
    status: RepairStatus;
    requestedBy: string;
    requestedByName: string;
}
