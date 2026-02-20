import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';

const roleLabels: Record<UserRole, string> = {
    admin: '管理人員',
    borrower: '借用人員',
    returner: '歸還人員',
    repairer: '修理人員',
};

const UserManagement: React.FC = () => {
    const { users, addUser, updateUser, deleteUser } = useAuthStore();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        username: '',
        password: '',
        name: '',
        role: 'borrower' as UserRole,
        department: '',
        email: '',
        active: true,
    });
    const [searchTerm, setSearchTerm] = useState('');

    const resetForm = () => {
        setForm({
            username: '',
            password: '',
            name: '',
            role: 'borrower',
            department: '',
            email: '',
            active: true,
        });
        setEditingId(null);
    };

    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (id: string) => {
        const user = users.find((u) => u.id === id);
        if (!user) return;
        setForm({
            username: user.username,
            password: user.password,
            name: user.name,
            role: user.role,
            department: user.department,
            email: user.email,
            active: user.active,
        });
        setEditingId(id);
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateUser(editingId, form);
        } else {
            addUser(form);
        }
        setShowModal(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('確定要刪除此帳號嗎？')) {
            deleteUser(id);
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name.includes(searchTerm) ||
            u.username.includes(searchTerm) ||
            u.department.includes(searchTerm)
    );

    return (
        <div className="page">
            <div className="page-header">
                <h1>帳戶管理</h1>
                <button className="btn btn-primary" onClick={openCreate}>
                    ＋ 新增帳號
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="搜尋帳號、姓名或部門..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>帳號</th>
                            <th>姓名</th>
                            <th>角色</th>
                            <th>部門</th>
                            <th>Email</th>
                            <th>狀態</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="font-mono">{user.username}</td>
                                <td>{user.name}</td>
                                <td>
                                    <span className={`badge badge-${user.role}`}>
                                        {roleLabels[user.role]}
                                    </span>
                                </td>
                                <td>{user.department}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span
                                        className={`status-dot ${user.active ? 'status-dot-active' : 'status-dot-inactive'
                                            }`}
                                    >
                                        {user.active ? '啟用' : '停用'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => openEdit(user.id)}
                                        >
                                            編輯
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            刪除
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? '編輯帳號' : '新增帳號'}</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>帳號</label>
                                    <input
                                        type="text"
                                        value={form.username}
                                        onChange={(e) =>
                                            setForm({ ...form, username: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>密碼</label>
                                    <input
                                        type="text"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm({ ...form, password: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>姓名</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>角色</label>
                                    <select
                                        value={form.role}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                role: e.target.value as UserRole,
                                            })
                                        }
                                    >
                                        {Object.entries(roleLabels).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>部門</label>
                                    <input
                                        type="text"
                                        value={form.department}
                                        onChange={(e) =>
                                            setForm({ ...form, department: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({ ...form, email: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={form.active}
                                        onChange={(e) =>
                                            setForm({ ...form, active: e.target.checked })
                                        }
                                    />
                                    <span>啟用帳號</span>
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    取消
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? '儲存' : '新增'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
