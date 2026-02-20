import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useFixtureStore } from '../../stores/fixtureStore';

const BorrowPage: React.FC = () => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const { fixtures, borrowFixture } = useFixtureStore();
    const [showModal, setShowModal] = useState(false);
    const [selectedFixtureId, setSelectedFixtureId] = useState('');
    const [purpose, setPurpose] = useState('');
    const [expectedReturnDate, setExpectedReturnDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const availableFixtures = fixtures.filter(
        (f) =>
            f.status === 'available' &&
            (f.name.includes(searchTerm) ||
                f.code.includes(searchTerm) ||
                f.category.includes(searchTerm))
    );

    const handleBorrow = (fixtureId: string) => {
        setSelectedFixtureId(fixtureId);
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        const fixture = fixtures.find((f) => f.id === selectedFixtureId);
        if (!fixture) return;

        borrowFixture({
            fixtureId: fixture.id,
            fixtureName: fixture.name,
            fixtureCode: fixture.code,
            borrowerId: currentUser.id,
            borrowerName: currentUser.name,
            borrowDate: new Date().toISOString().split('T')[0],
            expectedReturnDate,
            purpose,
            status: 'active',
        });

        setShowModal(false);
        setPurpose('');
        setExpectedReturnDate('');
        setSelectedFixtureId('');
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>借用夾具</h1>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="搜尋夾具名稱、編號或類別..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="fixture-grid">
                {availableFixtures.map((fixture) => (
                    <div key={fixture.id} className="fixture-card">
                        <div className="fixture-card-header">
                            <span className="fixture-code">{fixture.code}</span>
                            <span className="status-badge status-available">可借用</span>
                        </div>
                        <h3 className="fixture-name">{fixture.name}</h3>
                        <p className="fixture-desc">{fixture.description}</p>
                        <div className="fixture-meta">
                            <span>📍 {fixture.location}</span>
                            <span>📂 {fixture.category}</span>
                        </div>
                        <div className="fixture-card-actions">
                            <button
                                className="btn btn-primary btn-block"
                                onClick={() => handleBorrow(fixture.id)}
                            >
                                借用此夾具
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {availableFixtures.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>目前沒有可借用的夾具</p>
                </div>
            )}

            {/* Borrow Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>借用確認</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="form-group">
                                <label>夾具</label>
                                <input
                                    type="text"
                                    value={
                                        fixtures.find((f) => f.id === selectedFixtureId)?.name ||
                                        ''
                                    }
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>借用用途</label>
                                <textarea
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    placeholder="請說明借用用途..."
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>預計歸還日期</label>
                                <input
                                    type="date"
                                    value={expectedReturnDate}
                                    onChange={(e) =>
                                        setExpectedReturnDate(e.target.value)
                                    }
                                    required
                                />
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
                                    確認借用
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BorrowPage;
