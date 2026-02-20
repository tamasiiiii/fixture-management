import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import FixtureManagement from './pages/admin/FixtureManagement';
import AllBorrowRecords from './pages/admin/AllBorrowRecords';
import AllRepairRecords from './pages/admin/AllRepairRecords';
import BorrowPage from './pages/borrower/BorrowPage';
import MyBorrowRecords from './pages/borrower/MyBorrowRecords';
import ReturnPage from './pages/returner/ReturnPage';
import ReturnRecords from './pages/returner/ReturnRecords';
import RepairList from './pages/repairer/RepairList';
import RepairHistory from './pages/repairer/RepairHistory';

function App() {
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />
        <Route
          path="/"
          element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />}
        />

        {/* Protected routes wrapped in Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fixtures"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <FixtureManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/borrow-records"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AllBorrowRecords />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/repair-records"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AllRepairRecords />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Borrower */}
        <Route
          path="/borrower/borrow"
          element={
            <ProtectedRoute allowedRoles={['borrower']}>
              <Layout>
                <BorrowPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrower/records"
          element={
            <ProtectedRoute allowedRoles={['borrower']}>
              <Layout>
                <MyBorrowRecords />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Returner */}
        <Route
          path="/returner/return"
          element={
            <ProtectedRoute allowedRoles={['returner']}>
              <Layout>
                <ReturnPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/returner/records"
          element={
            <ProtectedRoute allowedRoles={['returner']}>
              <Layout>
                <ReturnRecords />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Repairer */}
        <Route
          path="/repairer/list"
          element={
            <ProtectedRoute allowedRoles={['repairer']}>
              <Layout>
                <RepairList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/repairer/history"
          element={
            <ProtectedRoute allowedRoles={['repairer']}>
              <Layout>
                <RepairHistory />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
