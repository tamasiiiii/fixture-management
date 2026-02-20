import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useFixtureStore } from '../../stores/fixtureStore';

const ReturnPage: React.FC = () => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const { borrowRecords, returnFixture, sendToRepair } =
        useFixtureStore();
    const [showRepairModal, setShowRepairModal] = useState(false);
    const [selectedBorrowId, setSelectedBorrowId] = useState('');
    const [repairDescription, setRepairDescription] = useState('');

    const activeRecords = borrowRecords.filter((r) => r.status === 'active');

    const handleReturn = (borrowId: string) => {
        if (!currentUser) return;
        if (window.confirm('確定要歸還此夾具嗎？')) {
            returnFixture(borrowId, currentUser.id, currentUser.name);
        }
    };

    const handleSendToRepairClick = (borrowId: string) => {
        setSelectedBorrowId(borrowId);
        setRepairDescription('');
        setShowRepairModal(true);
    };

    const handleSendToRepair = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        sendToRepair(
            selectedBorrowId,
            currentUser.id,
            currentUser.name,
            repairDescription
        );
        setShowRepairModal(false);
        setRepairDescription('');
        setSelectedBorrowId('');
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>歸還夾具</h1>
            </div>

            {activeRecords.length > 0 ? (
                <div className="return-list">
                    {activeRecords.map((record) => (
                        <div key={record.id} className="return-card">
                            <div className="return-card-info">
                                <div className="return-card-header">
                                    <span className="fixture-code">{record.fixtureCode}</span>
                                    <h3>{record.fixtureName}</h3>
                                </div>
                                <div className="return-card-meta">
                                    <span>👤 借用人: {record.borrowerName}</span>
                                    <span>📅 借用日期: {record.borrowDate}</span>
                                    <span>📅 預計歸還: {record.expectedReturnDate}</span>
                                    <span>📝 用途: {record.purpose}</span>
                                </div>
                            </div>
                            <div className="return-card-actions">
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleReturn(record.id)}
                                >
                                    ✅ 正常歸還
                                </button>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => handleSendToRepairClick(record.id)}
                                >
                                    🛠️ 送修
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>目前沒有待歸還的夾具</p>
                </div>
            )}

            {/* Repair Modal */}
            {showRepairModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowRepairModal(false)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>送修申請</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowRepairModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSendToRepair} className="modal-body">
                            <div className="form-group">
                                <label>問題描述</label>
                                <textarea
                                    value={repairDescription}
                                    onChange={(e) =>
                                        setRepairDescription(e.target.value)
                                    }
                                    placeholder="請描述夾具的問題狀況..."
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowRepairModal(false)}
                                >
                                    取消
                                </button>
                                <button type="submit" className="btn btn-warning">
                                    確認送修
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnPage;
