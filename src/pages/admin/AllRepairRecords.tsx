import React from 'react';
import { useFixtureStore } from '../../stores/fixtureStore';

const AllRepairRecords: React.FC = () => {
    const { repairRecords } = useFixtureStore();

    const statusLabels: Record<string, string> = {
        pending: '待修理',
        in_progress: '修理中',
        completed: '已完成',
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>所有修理紀錄</h1>
            </div>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>夾具編號</th>
                            <th>夾具名稱</th>
                            <th>報修日期</th>
                            <th>問題描述</th>
                            <th>修理人員</th>
                            <th>開始日期</th>
                            <th>完成日期</th>
                            <th>診斷結果</th>
                            <th>解決方式</th>
                            <th>費用</th>
                            <th>狀態</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...repairRecords].reverse().map((r) => (
                            <tr key={r.id}>
                                <td className="font-mono">{r.fixtureCode}</td>
                                <td>{r.fixtureName}</td>
                                <td>{r.requestDate}</td>
                                <td>{r.description}</td>
                                <td>{r.repairerName || '-'}</td>
                                <td>{r.startDate || '-'}</td>
                                <td>{r.endDate || '-'}</td>
                                <td>{r.diagnosis || '-'}</td>
                                <td>{r.solution || '-'}</td>
                                <td>{r.cost != null ? `$${r.cost}` : '-'}</td>
                                <td>
                                    <span className={`status-badge status-${r.status}`}>
                                        {statusLabels[r.status] || r.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {repairRecords.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>暫無修理紀錄</p>
                </div>
            )}
        </div>
    );
};

export default AllRepairRecords;
