import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const roleLabels: Record<string, string> = {
    admin: '管理人員',
    borrower: '借用人員',
    returner: '歸還人員',
    repairer: '修理人員',
};

const roleBadgeClass: Record<string, string> = {
    admin: 'badge-admin',
    borrower: 'badge-borrower',
    returner: 'badge-returner',
    repairer: 'badge-repairer',
};

interface MenuItem {
    label: string;
    path: string;
    icon: string;
}

const menuByRole: Record<string, MenuItem[]> = {
    admin: [
        { label: '儀表板', path: '/dashboard', icon: '📊' },
        { label: '帳戶管理', path: '/admin/users', icon: '👥' },
        { label: '夾具管理', path: '/admin/fixtures', icon: '🔧' },
        { label: '所有借用紀錄', path: '/admin/borrow-records', icon: '📋' },
        { label: '所有修理紀錄', path: '/admin/repair-records', icon: '🛠️' },
    ],
    borrower: [
        { label: '儀表板', path: '/dashboard', icon: '📊' },
        { label: '借用夾具', path: '/borrower/borrow', icon: '📦' },
        { label: '我的借用紀錄', path: '/borrower/records', icon: '📋' },
    ],
    returner: [
        { label: '儀表板', path: '/dashboard', icon: '📊' },
        { label: '歸還夾具', path: '/returner/return', icon: '↩️' },
        { label: '歸還紀錄', path: '/returner/records', icon: '📋' },
    ],
    repairer: [
        { label: '儀表板', path: '/dashboard', icon: '📊' },
        { label: '待修清單', path: '/repairer/list', icon: '🔨' },
        { label: '修理歷史', path: '/repairer/history', icon: '📜' },
    ],
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser, logout } = useAuthStore();
    const navigate = useNavigate();

    if (!currentUser) return null;

    const menu = menuByRole[currentUser.role] || [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">⚙️</span>
                        <span className="logo-text">夾具管理系統</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menu.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'nav-item-active' : ''}`
                            }
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {currentUser.name.charAt(0)}
                        </div>
                        <div className="user-details">
                            <div className="user-name">{currentUser.name}</div>
                            <span className={`badge ${roleBadgeClass[currentUser.role]}`}>
                                {roleLabels[currentUser.role]}
                            </span>
                        </div>
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>
                        登出
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <div className="top-bar-left">
                        <h2 className="page-greeting">
                            歡迎回來，{currentUser.name}
                        </h2>
                    </div>
                    <div className="top-bar-right">
                        <span className="department-label">{currentUser.department}</span>
                    </div>
                </header>
                <div className="content-area">{children}</div>
            </main>
        </div>
    );
};

export default Layout;
