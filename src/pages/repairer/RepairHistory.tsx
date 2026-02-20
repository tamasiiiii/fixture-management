import React, { useState } from 'react';
import { useFixtureStore } from '../../stores/fixtureStore';

const RepairHistory: React.FC = () => {
    const { repairRecords } = useFixtureStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const completedRecords = repairRecords
        .filter((r) => r.status === 'completed')
        .filter(
            (r) =>
                r.fixtureName.includes(searchTerm) ||
                r.fixtureCode.includes(searchTerm) ||
                (r.repairerName && r.repairerName.includes(searchTerm)) ||
                (r.diagnosis && r.diagnosis.includes(searchTerm))
        )
        .reverse();

    const allRecords = repairRecords
        .filter(
            (r) =>
                r.fixtureName.includes(searchTerm) ||
                r.fixtureCode.includes(searchTerm) ||
                (r.repairerName && r.repairerName.includes(searchTerm))
        )
        .reverse();

    const statusLabels: Record<string, string> = {
        pending: '待修理',
        in_progress: '修理中',
        completed: '已完成',
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>修理歷史</h1>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="搜尋夾具名稱、編號、修理人員..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Summary Stats */}
            <div className="history-stats">
                <div className="history-stat">
                    <span className="history-stat-value">{repairRecords.length}</span>
                    <span className="history-stat-label">總修理次數</span>
                </div>
                <div className="history-stat">
                    <span className="history-stat-value">
                        {completedRecords.length}
                    </span>
                    <span className="history-stat-label">已完成</span>
                </div>
                <div className="history-stat">
                    <span className="history-stat-value">
                        $
                        {completedRecords
                            .reduce((sum, r) => sum + (r.cost || 0), 0)
                            .toFixed(0)}
                    </span>
                    <span className="history-stat-label">總修理費用</span>
                </div>
            </div>

            {/* History Timeline */}
            <div className="history-timeline">
                {allRecords.map((record) => (
                    <div
                        key={record.id}
                        className={`timeline-item timeline-item-${record.status}`}
                        onClick={() =>
                            setExpandedId(
                                expandedId === record.id ? null : record.id
                            )
                        }
                    >
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                            <div className="timeline-header">
                                <div className="timeline-title">
                                    <span className="fixture-code">{record.fixtureCode}</span>
                                    <span>{record.fixtureName}</span>
                                </div>
                                <span
                                    className={`status-badge status-${record.status}`}
                                >
                                    {statusLabels[record.status]}
                                </span>
                            </div>
                            <div className="timeline-meta">
                                <span>📅 報修: {record.requestDate}</span>
                                {record.endDate && (
                                    <span>✅ 完成: {record.endDate}</span>
                                )}
                                {record.repairerName && (
                                    <span>👤 修理: {record.repairerName}</span>
                                )}
                            </div>
                            {expandedId === record.id && (
                                <div className="timeline-details">
                                    <div className="detail-row">
                                        <strong>問題描述：</strong>
                                        <span>{record.description}</span>
                                    </div>
                                    {record.diagnosis && (
                                        <div className="detail-row">
                                            <strong>診斷結果：</strong>
                                            <span>{record.diagnosis}</span>
                                        </div>
                                    )}
                                    {record.solution && (
                                        <div className="detail-row">
                                            <strong>解決方式：</strong>
                                            <span>{record.solution}</span>
                                        </div>
                                    )}
                                    {record.cost != null && (
                                        <div className="detail-row">
                                            <strong>修理費用：</strong>
                                            <span>${record.cost}</span>
                                        </div>
                                    )}
                                    <div className="detail-row">
                                        <strong>報修人：</strong>
                                        <span>{record.requestedByName}</span>
                                    </div>
                                    {record.startDate && (
                                        <div className="detail-row">
                                            <strong>開始修理：</strong>
                                            <span>{record.startDate}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {allRecords.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>暫無修理歷史紀錄</p>
                </div>
            )}
        </div>
    );
};

export default RepairHistory;
