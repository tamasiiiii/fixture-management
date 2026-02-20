import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useFixtureStore } from '../../stores/fixtureStore';

const MyBorrowRecords: React.FC = () => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const { borrowRecords } = useFixtureStore();

    if (!currentUser) return null;

    const myRecords = borrowRecords
        .filter((r) => r.borrowerId === currentUser.id)
        .reverse();

    const statusLabels: Record<string, string> = {
        active: '使用中',
        returned: '已歸還',
        overdue: '逾期',
        sent_to_repair: '送修',
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>我的借用紀錄</h1>
            </div>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>夾具編號</th>
                            <th>夾具名稱</th>
                            <th>借用日期</th>
                            <th>預計歸還</th>
                            <th>實際歸還</th>
                            <th>用途</th>
                            <th>狀態</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myRecords.map((r) => (
                            <tr key={r.id}>
                                <td className="font-mono">{r.fixtureCode}</td>
                                <td>{r.fixtureName}</td>
                                <td>{r.borrowDate}</td>
                                <td>{r.expectedReturnDate}</td>
                                <td>{r.actualReturnDate || '-'}</td>
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
            {myRecords.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>您還沒有借用紀錄</p>
                </div>
            )}
        </div>
    );
};

export default MyBorrowRecords;
