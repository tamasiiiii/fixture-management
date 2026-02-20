import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const login = useAuthStore((s) => s.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate loading
        await new Promise((resolve) => setTimeout(resolve, 500));

        const success = login(username, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('帳號或密碼錯誤，請重新輸入');
        }
        setIsLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">⚙️</div>
                    <h1>夾具借還管理系統</h1>
                    <p className="login-subtitle">Fixture Management System</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">帳號</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="請輸入帳號"
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">密碼</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="請輸入密碼"
                                required
                            />
                        </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button
                        type="submit"
                        className="btn-login"
                        disabled={isLoading}
                    >
                        {isLoading ? '登入中...' : '登入'}
                    </button>
                </form>
                <div className="login-demo-accounts">
                    <p className="demo-title">測試帳號</p>
                    <div className="demo-grid">
                        <div className="demo-item">
                            <span className="demo-role">管理員</span>
                            <code>admin / admin123</code>
                        </div>
                        <div className="demo-item">
                            <span className="demo-role">借用人員</span>
                            <code>borrower / borrow123</code>
                        </div>
                        <div className="demo-item">
                            <span className="demo-role">歸還人員</span>
                            <code>returner / return123</code>
                        </div>
                        <div className="demo-item">
                            <span className="demo-role">修理人員</span>
                            <code>repairer / repair123</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
