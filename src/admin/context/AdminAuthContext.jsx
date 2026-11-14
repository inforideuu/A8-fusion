import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';

const AdminAuthContext = createContext(null);

const DEFAULT_PERMISSIONS = {
  'SUPER_ADMIN': ['dashboard', 'users', 'rbac', 'pages', 'crm', 'careers', 'seo', 'settings', 'reports', 'audit-logs'],
  'WEBSITE_ADMIN': ['dashboard', 'users', 'rbac', 'pages', 'crm', 'careers', 'seo', 'settings', 'reports', 'audit-logs'],
  'CONTENT_MANAGER': ['dashboard', 'pages', 'seo'],
  'SALES_MANAGER': ['dashboard', 'crm', 'reports', 'audit-logs'],
  'HR_MANAGER': ['dashboard', 'careers', 'reports'],
  'BD_MANAGER': ['dashboard', 'crm', 'reports'],
};

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('a8_admin_token') || null;
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('a8_admin_user');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.warn('Failed parsing a8_admin_user:', e);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [permissionsMatrix, setPermissionsMatrix] = useState(() => {
    try {
      const cached = localStorage.getItem('a8_rbac_matrix');
      return cached ? JSON.parse(cached) : DEFAULT_PERMISSIONS;
    } catch (e) {
      console.warn('Failed parsing a8_rbac_matrix:', e);
      return DEFAULT_PERMISSIONS;
    }
  });

  const reloadPermissions = async () => {
    try {
      const data = await adminApi.getResource('rbac/permissions');
      if (Array.isArray(data) && data.length > 0) {
        const matrixObj = {};
        data.forEach(item => {
          matrixObj[item.role] = item.modules || [];
        });
        setPermissionsMatrix(matrixObj);
        localStorage.setItem('a8_rbac_matrix', JSON.stringify(matrixObj));
        return matrixObj;
      }
    } catch (e) {
      console.warn('Failed loading RBAC matrix from backend', e);
    }
    return DEFAULT_PERMISSIONS;
  };

  useEffect(() => {
    if (token) {
      reloadPermissions();
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await adminApi.login(username, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('a8_admin_token', data.token);
      localStorage.setItem('a8_admin_user', JSON.stringify(data.user));
      await reloadPermissions();
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid username or password' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch (e) {
      // ignore
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('a8_admin_token');
    localStorage.removeItem('a8_admin_user');
    localStorage.removeItem('a8_rbac_matrix');
  };

  // RBAC Permission Checker
  const hasRole = (...roles) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN' || user.is_superuser) return true;
    return roles.includes(user.role);
  };

  const hasPermission = (moduleName) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN' || user.is_superuser) return true;

    const allowed = permissionsMatrix[user.role] || DEFAULT_PERMISSIONS[user.role] || [];
    return allowed.includes(moduleName);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        loading,
        permissionsMatrix,
        reloadPermissions,
        setPermissionsMatrix,
        login,
        logout,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
}

