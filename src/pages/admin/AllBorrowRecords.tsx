import React from 'react';
import { useFixtureStore } from '../../stores/fixtureStore';

const AllBorrowRecords: React.FC = () => {
    const { borrowRecords } = useFixtureStore();

    const statusLabels: Record<string, string> = {
        active: '使用中',
        returned: '已歸還',
        overdue: '逾期',
        sent_to_repair: '送修',
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>所有借用紀錄</h1>
            </div>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>夾具編號</th>
                            <th>夾具名稱</th>
                            <th>借用人</th>
                            <th>借用日期</th>
                            <th>預計歸還</th>
                            <th>實際歸還</th>
                            <th>歸還人</th>
                            <th>用途</th>
                            <th>狀態</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...borrowRecords].reverse().map((r) => (
                            <tr key={r.id}>
                                <td className="font-mono">{r.fixtureCode}</td>
                                <td>{r.fixtureName}</td>
                                <td>{r.borrowerName}</td>
                                <td>{r.borrowDate}</td>
                                <td>{r.expectedReturnDate}</td>
                                <td>{r.actualReturnDate || '-'}</td>
                                <td>{r.returnerName || '-'}</td>
                                <td>{r.purpose}</td>
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
            {borrowRecords.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>暫無借用紀錄</p>
                </div>
            )}
        </div>
    );
};

export default AllBorrowRecords;
