import React, { useState } from 'react';
import { useFixtureStore } from '../../stores/fixtureStore';
import { FixtureStatus } from '../../types';

const statusLabels: Record<FixtureStatus, string> = {
    available: '可借用',
    borrowed: '已借出',
    repairing: '修理中',
    retired: '已報廢',
};

const FixtureManagement: React.FC = () => {
    const { fixtures, addFixture, updateFixture, deleteFixture } =
        useFixtureStore();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [form, setForm] = useState({
        name: '',
        code: '',
        description: '',
        location: '',
        status: 'available' as FixtureStatus,
        category: '',
    });

    const resetForm = () => {
        setForm({
            name: '',
            code: '',
            description: '',
            location: '',
            status: 'available',
            category: '',
        });
        setEditingId(null);
    };

    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (id: string) => {
        const fixture = fixtures.find((f) => f.id === id);
        if (!fixture) return;
        setForm({
            name: fixture.name,
            code: fixture.code,
            description: fixture.description,
            location: fixture.location,
            status: fixture.status,
            category: fixture.category,
        });
        setEditingId(id);
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateFixture(editingId, form);
        } else {
            addFixture(form);
        }
        setShowModal(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('確定要刪除此夾具嗎？')) {
            deleteFixture(id);
        }
    };

    const filteredFixtures = fixtures.filter((f) => {
        const matchesStatus =
            filterStatus === 'all' || f.status === filterStatus;
        const matchesSearch =
            f.name.includes(searchTerm) ||
            f.code.includes(searchTerm) ||
            f.category.includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="page">
            <div className="page-header">
                <h1>夾具管理</h1>
                <button className="btn btn-primary" onClick={openCreate}>
                    ＋ 新增夾具
                </button>
            </div>

            <div className="filter-bar">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="搜尋夾具名稱、編號或類別..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                    >
                        全部
                    </button>
                    {Object.entries(statusLabels).map(([value, label]) => (
                        <button
                            key={value}
                            className={`filter-tab ${filterStatus === value ? 'active' : ''
                                }`}
                            onClick={() => setFilterStatus(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="fixture-grid">
                {filteredFixtures.map((fixture) => (
                    <div key={fixture.id} className="fixture-card">
                        <div className="fixture-card-header">
                            <span className="fixture-code">{fixture.code}</span>
                            <span className={`status-badge status-${fixture.status}`}>
                                {statusLabels[fixture.status]}
                            </span>
                        </div>
                        <h3 className="fixture-name">{fixture.name}</h3>
                        <p className="fixture-desc">{fixture.description}</p>
                        <div className="fixture-meta">
                            <span>📍 {fixture.location}</span>
                            <span>📂 {fixture.category}</span>
                        </div>
                        <div className="fixture-card-actions">
                            <button
                                className="btn btn-sm btn-outline"
                                onClick={() => openEdit(fixture.id)}
                            >
                                編輯
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(fixture.id)}
                            >
                                刪除
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredFixtures.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>沒有符合條件的夾具</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? '編輯夾具' : '新增夾具'}</h2>
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
                                    <label>夾具名稱</label>
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
                                    <label>編號</label>
                                    <input
                                        type="text"
                                        value={form.code}
                                        onChange={(e) =>
                                            setForm({ ...form, code: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>描述</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    rows={3}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>存放位置</label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={(e) =>
                                            setForm({ ...form, location: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>類別</label>
                                    <input
                                        type="text"
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm({ ...form, category: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            {editingId && (
                                <div className="form-group">
                                    <label>狀態</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                status: e.target.value as FixtureStatus,
                                            })
                                        }
                                    >
                                        {Object.entries(statusLabels).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
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

export default FixtureManagement;
