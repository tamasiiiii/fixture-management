import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { useFixtureStore } from '../stores/fixtureStore';

const Dashboard: React.FC = () => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const { fixtures, borrowRecords, repairRecords } = useFixtureStore();

    if (!currentUser) return null;

    const stats = {
        totalFixtures: fixtures.length,
        available: fixtures.filter((f) => f.status === 'available').length,
        borrowed: fixtures.filter((f) => f.status === 'borrowed').length,
        repairing: fixtures.filter((f) => f.status === 'repairing').length,
        activeBorrows: borrowRecords.filter((r) => r.status === 'active').length,
        pendingRepairs: repairRecords.filter((r) => r.status === 'pending').length,
        inProgressRepairs: repairRecords.filter((r) => r.status === 'in_progress').length,
        completedRepairs: repairRecords.filter((r) => r.status === 'completed').length,
        myBorrows: borrowRecords.filter(
            (r) => r.borrowerId === currentUser.id && r.status === 'active'
        ).length,
    };

    const renderAdminDashboard = () => (
        <>
            <div className="stats-grid">
                <div className="stat-card stat-card-blue">
                    <div className="stat-icon">🔧</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.totalFixtures}</div>
                        <div className="stat-label">夾具總數</div>
                    </div>
                </div>
                <div className="stat-card stat-card-green">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.available}</div>
                        <div className="stat-label">可借用</div>
                    </div>
                </div>
                <div className="stat-card stat-card-orange">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.borrowed}</div>
                        <div className="stat-label">已借出</div>
                    </div>
                </div>
                <div className="stat-card stat-card-red">
                    <div className="stat-icon">🛠️</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.repairing}</div>
                        <div className="stat-label">修理中</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-panels">
                <div className="panel">
                    <h3 className="panel-title">📋 近期借用紀錄</h3>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>夾具</th>
                                    <th>借用人</th>
                                    <th>借用日期</th>
                                    <th>狀態</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowRecords.slice(-5).reverse().map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.fixtureName}</td>
                                        <td>{r.borrowerName}</td>
                                        <td>{r.borrowDate}</td>
                                        <td>
                                            <span className={`status-badge status-${r.status}`}>
                                                {r.status === 'active' ? '使用中' : r.status === 'returned' ? '已歸還' : r.status === 'sent_to_repair' ? '送修' : '逾期'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="panel">
                    <h3 className="panel-title">🛠️ 修理概況</h3>
                    <div className="repair-stats">
                        <div className="repair-stat-item">
                            <span className="repair-stat-count text-warning">{stats.pendingRepairs}</span>
                            <span className="repair-stat-label">待修理</span>
                        </div>
                        <div className="repair-stat-item">
                            <span className="repair-stat-count text-info">{stats.inProgressRepairs}</span>
                            <span className="repair-stat-label">修理中</span>
                        </div>
                        <div className="repair-stat-item">
                            <span className="repair-stat-count text-success">{stats.completedRepairs}</span>
                            <span className="repair-stat-label">已完成</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderBorrowerDashboard = () => (
        <div className="stats-grid">
            <div className="stat-card stat-card-blue">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                    <div className="stat-value">{stats.available}</div>
                    <div className="stat-label">可借用夾具</div>
                </div>
            </div>
            <div className="stat-card stat-card-orange">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                    <div className="stat-value">{stats.myBorrows}</div>
                    <div className="stat-label">我目前借用中</div>
                </div>
            </div>
        </div>
    );

    const renderReturnerDashboard = () => (
        <div className="stats-grid">
            <div className="stat-card stat-card-orange">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                    <div className="stat-value">{stats.activeBorrows}</div>
                    <div className="stat-label">待歸還夾具</div>
                </div>
            </div>
            <div className="stat-card stat-card-green">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                    <div className="stat-value">{stats.available}</div>
                    <div className="stat-label">已歸還 (可用)</div>
                </div>
            </div>
        </div>
    );

    const renderRepairerDashboard = () => (
        <div className="stats-grid">
            <div className="stat-card stat-card-orange">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                    <div className="stat-value">{stats.pendingRepairs}</div>
                    <div className="stat-label">待修理</div>
                </div>
            </div>
            <div className="stat-card stat-card-blue">
                <div className="stat-icon">🔨</div>
                <div className="stat-info">
                    <div className="stat-value">{stats.inProgressRepairs}</div>
                    <div className="stat-label">修理中</div>
                </div>
            </div>
            <div className="stat-card stat-card-green">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                    <div className="stat-value">{stats.completedRepairs}</div>
                    <div className="stat-label">已完成修理</div>
                </div>
            </div>
        </div>
    );

    const dashboardByRole: Record<string, () => JSX.Element> = {
        admin: renderAdminDashboard,
        borrower: renderBorrowerDashboard,
        returner: renderReturnerDashboard,
        repairer: renderRepairerDashboard,
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>儀表板</h1>
            </div>
            {dashboardByRole[currentUser.role]?.()}
        </div>
    );
};

export default Dashboard;
