import { create } from 'zustand';
import { User, UserRole } from '../types';
import { defaultUsers } from '../data/mockData';

interface AuthState {
    currentUser: User | null;
    users: User[];
    login: (username: string, password: string) => boolean;
    logout: () => void;
    addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
    updateUser: (id: string, data: Partial<User>) => void;
    deleteUser: (id: string) => void;
    getUsersByRole: (role: UserRole) => User[];
}

const loadUsers = (): User[] => {
    const stored = localStorage.getItem('fixture_users');
    return stored ? JSON.parse(stored) : defaultUsers;
};

const loadCurrentUser = (): User | null => {
    const stored = localStorage.getItem('fixture_current_user');
    return stored ? JSON.parse(stored) : null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    currentUser: loadCurrentUser(),
    users: loadUsers(),

    login: (username: string, password: string) => {
        const user = get().users.find(
            (u) => u.username === username && u.password === password && u.active
        );
        if (user) {
            set({ currentUser: user });
            localStorage.setItem('fixture_current_user', JSON.stringify(user));
            return true;
        }
        return false;
    },

    logout: () => {
        set({ currentUser: null });
        localStorage.removeItem('fixture_current_user');
    },

    addUser: (userData) => {
        const newUser: User = {
            ...userData,
            id: 'u' + Date.now(),
            createdAt: new Date().toISOString().split('T')[0],
        };
        const updated = [...get().users, newUser];
        set({ users: updated });
        localStorage.setItem('fixture_users', JSON.stringify(updated));
    },

    updateUser: (id, data) => {
        const updated = get().users.map((u) =>
            u.id === id ? { ...u, ...data } : u
        );
        set({ users: updated });
        localStorage.setItem('fixture_users', JSON.stringify(updated));
    },

    deleteUser: (id) => {
        const updated = get().users.filter((u) => u.id !== id);
        set({ users: updated });
        localStorage.setItem('fixture_users', JSON.stringify(updated));
    },

    getUsersByRole: (role) => {
        return get().users.filter((u) => u.role === role);
    },
}));
