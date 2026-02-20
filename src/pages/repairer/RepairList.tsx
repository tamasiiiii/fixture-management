import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useFixtureStore } from '../../stores/fixtureStore';

const RepairList: React.FC = () => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const { repairRecords, startRepair, completeRepair } = useFixtureStore();
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedRepairId, setSelectedRepairId] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [solution, setSolution] = useState('');
    const [cost, setCost] = useState('');

    const pendingRepairs = repairRecords.filter(
        (r) => r.status === 'pending'
    );
    const inProgressRepairs = repairRecords.filter(
        (r) => r.status === 'in_progress'
    );

    const handleStartRepair = (repairId: string) => {
        if (!currentUser) return;
        startRepair(repairId, currentUser.id, currentUser.name);
    };

    const openCompleteModal = (repairId: string) => {
        setSelectedRepairId(repairId);
        const record = repairRecords.find((r) => r.id === repairId);
        setDiagnosis(record?.diagnosis || '');
        setSolution('');
        setCost('');
        setShowCompleteModal(true);
    };

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();
        completeRepair(
            selectedRepairId,
            diagnosis,
            solution,
            parseFloat(cost) || 0
        );
        setShowCompleteModal(false);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>待修清單</h1>
            </div>

            {/* Pending Repairs */}
            <section className="section">
                <h2 className="section-title">
                    <span className="section-icon">⏳</span>
                    待接手修理
                    <span className="section-count">{pendingRepairs.length}</span>
                </h2>
                {pendingRepairs.length > 0 ? (
                    <div className="repair-cards">
                        {pendingRepairs.map((record) => (
                            <div key={record.id} className="repair-card repair-card-pending">
                                <div className="repair-card-header">
                                    <span className="fixture-code">{record.fixtureCode}</span>
                                    <span className="status-badge status-pending">待修理</span>
                                </div>
                                <h3>{record.fixtureName}</h3>
                                <div className="repair-card-detail">
                                    <p>
                                        <strong>問題描述：</strong>
                                        {record.description}
                                    </p>
                                    <p>
                                        <strong>報修日期：</strong>
                                        {record.requestDate}
                                    </p>
                                    <p>
                                        <strong>報修人：</strong>
                                        {record.requestedByName}
                                    </p>
                                </div>
                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={() => handleStartRepair(record.id)}
                                >
                                    🔨 開始修理
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-sm">
                        <p>目前沒有待接手的修理工作</p>
                    </div>
                )}
            </section>

            {/* In Progress Repairs */}
            <section className="section">
                <h2 className="section-title">
                    <span className="section-icon">🔨</span>
                    修理中
                    <span className="section-count">{inProgressRepairs.length}</span>
                </h2>
                {inProgressRepairs.length > 0 ? (
                    <div className="repair-cards">
                        {inProgressRepairs.map((record) => (
                            <div
                                key={record.id}
                                className="repair-card repair-card-progress"
                            >
                                <div className="repair-card-header">
                                    <span className="fixture-code">{record.fixtureCode}</span>
                                    <span className="status-badge status-in_progress">
                                        修理中
                                    </span>
                                </div>
                                <h3>{record.fixtureName}</h3>
                                <div className="repair-card-detail">
                                    <p>
                                        <strong>問題描述：</strong>
                                        {record.description}
                                    </p>
                                    <p>
                                        <strong>開始日期：</strong>
                                        {record.startDate}
                                    </p>
                                    <p>
                                        <strong>修理人員：</strong>
                                        {record.repairerName}
                                    </p>
                                </div>
                                <button
                                    className="btn btn-success btn-block"
                                    onClick={() => openCompleteModal(record.id)}
                                >
                                    ✅ 完成修理
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-sm">
                        <p>目前沒有進行中的修理工作</p>
                    </div>
                )}
            </section>

            {/* Complete Modal */}
            {showCompleteModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowCompleteModal(false)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>完成修理報告</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowCompleteModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleComplete} className="modal-body">
                            <div className="form-group">
                                <label>診斷結果</label>
                                <textarea
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="請填寫診斷結果..."
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>解決方式</label>
                                <textarea
                                    value={solution}
                                    onChange={(e) => setSolution(e.target.value)}
                                    placeholder="請填寫修理方式與處理內容..."
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>修理費用 ($)</label>
                                <input
                                    type="number"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowCompleteModal(false)}
                                >
                                    取消
                                </button>
                                <button type="submit" className="btn btn-success">
                                    確認完成
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepairList;
