import React from 'react';
import { useFixtureStore } from '../../stores/fixtureStore';

const ReturnRecords: React.FC = () => {
    const { borrowRecords } = useFixtureStore();

    const returnedRecords = borrowRecords
        .filter((r) => r.status === 'returned' || r.status === 'sent_to_repair')
        .reverse();

    const statusLabels: Record<string, string> = {
        returned: '已歸還',
        sent_to_repair: '送修',
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>歸還紀錄</h1>
            </div>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>夾具編號</th>
                            <th>夾具名稱</th>
                            <th>借用人</th>
                            <th>歸還日期</th>
                            <th>歸還人</th>
                            <th>狀態</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returnedRecords.map((r) => (
                            <tr key={r.id}>
                                <td className="font-mono">{r.fixtureCode}</td>
                                <td>{r.fixtureName}</td>
                                <td>{r.borrowerName}</td>
                                <td>{r.actualReturnDate || '-'}</td>
                                <td>{r.returnerName || '-'}</td>
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
            {returnedRecords.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>暫無歸還紀錄</p>
                </div>
            )}
        </div>
    );
};

export default ReturnRecords;
