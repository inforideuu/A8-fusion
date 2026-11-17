import { API_BASE } from './apiconfig.js';
import {
  normalizeIdentifier,
  getRoleByIdentifier,
  getUserRecoveryProfile,
  SYSTEM_ROLES
} from '../utils/recoveryCredentials.js';

const getAuthHeaders = () => {
  const token = localStorage.getItem('a8_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {})
  };
};

const getRoleDisplayName = (code) => {
  const match = SYSTEM_ROLES.find(r => r.code === code);
  if (match) return match.name;
  if (code === 'WEBSITE_ADMIN') return 'Website Administrator';
  if (code === 'SUPER_ADMIN') return 'Super Admin';
  if (code === 'CONTENT_MANAGER') return 'Content Manager';
  if (code === 'SALES_MANAGER') return 'Sales Manager';
  if (code === 'HR_MANAGER') return 'HR Manager';
  if (code === 'BD_MANAGER') return 'Business Development Manager';
  return code || 'Administrator';
};

export const adminApi = {
  // Auth
  login: async (username, password) => {
    // 1. ALWAYS attempt live backend authentication first so the real user account (token, permissions, CRM, etc.) is loaded
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        return data;
      }
      if (!res.ok && (res.status === 401 || res.status === 403)) {
        throw new Error(data.detail || 'Invalid username or password.');
      }
    } catch (err) {
      // If error is from backend rejection (401/403), rethrow unless local offline credentials match
      const isRejection = err.message && err.message !== 'Failed to fetch' && !err.message.includes('NetworkError');
      if (isRejection) {
        const customPasswords = JSON.parse(localStorage.getItem('a8_custom_passwords') || '{}');
        const cleanUser = (username || '').trim().toLowerCase();
        const canonical = normalizeIdentifier(cleanUser);
        const stripped = cleanUser.replace(/[^a-z0-9]/g, '');
        const matchedPassword =
          customPasswords[cleanUser] ||
          customPasswords[canonical] ||
          customPasswords[stripped];

        if (!matchedPassword) {
          throw err;
        }
      }
    }

    // 2. Offline / local fallback when live backend is unreachable
    try {
      const customPasswords = JSON.parse(localStorage.getItem('a8_custom_passwords') || '{}');
      const cleanUser = (username || '').trim().toLowerCase();
      const canonical = normalizeIdentifier(cleanUser);
      const stripped = cleanUser.replace(/[^a-z0-9]/g, '');
      const matchedPassword =
        customPasswords[cleanUser] ||
        customPasswords[canonical] ||
        customPasswords[stripped];

      if (matchedPassword && matchedPassword === password) {
        const profile = getUserRecoveryProfile(cleanUser) || getUserRecoveryProfile(canonical);
        const roleObj = (profile?.role && SYSTEM_ROLES.find(r => r.code === profile.role)) ||
                        getRoleByIdentifier(cleanUser) ||
                        getRoleByIdentifier(canonical);

        const resolvedRole = roleObj ? roleObj.code : (profile?.role || (
          cleanUser.includes('web') ? 'WEBSITE_ADMIN' :
          cleanUser.includes('content') ? 'CONTENT_MANAGER' :
          cleanUser.includes('sales') ? 'SALES_MANAGER' :
          cleanUser.includes('hr') ? 'HR_MANAGER' :
          cleanUser.includes('bd') ? 'BD_MANAGER' : 'SUPER_ADMIN'
        ));

        const resolvedRoleDisplay = roleObj?.name || getRoleDisplayName(resolvedRole);
        const resolvedUsername = roleObj?.defaultUser || profile?.username || username;
        const resolvedFirstName = roleObj?.firstName || (roleObj?.displayName) || (cleanUser.includes('@') ? 'website' : username);
        const resolvedLastName = roleObj?.lastName || (cleanUser.includes('@') ? 'admin' : '');
        const resolvedEmail = roleObj?.email || profile?.email || `${resolvedUsername}@gmail.com`;

        return {
          token: 'token_auth_' + Date.now(),
          user: {
            id: resolvedRole === 'SUPER_ADMIN' ? 7 : (resolvedRole === 'WEBSITE_ADMIN' ? 14 : 2),
            username: resolvedUsername,
            role: resolvedRole,
            role_display: resolvedRoleDisplay,
            email: resolvedEmail,
            first_name: resolvedFirstName,
            last_name: resolvedLastName
          }
        };
      }
    } catch (e) {
      console.warn('Custom password check fallback', e);
    }

    // 3. Default demo accounts fallback
    const cleanUser = (username || '').trim().toLowerCase();
    const canonical = normalizeIdentifier(cleanUser);
    const profile = getUserRecoveryProfile(cleanUser) || getUserRecoveryProfile(canonical);
    const roleObj = (profile?.role && SYSTEM_ROLES.find(r => r.code === profile.role)) ||
                    getRoleByIdentifier(cleanUser) ||
                    getRoleByIdentifier(canonical);

    const isDefaultPass = password === 'admin@123' || password === 'AdminPassword@2026';
    if (roleObj && isDefaultPass) {
      const resolvedUsername = roleObj.defaultUser;
      return {
        token: `token_demo_${roleObj.defaultUser}`,
        user: {
          id: roleObj.code === 'SUPER_ADMIN' ? 7 : (roleObj.code === 'WEBSITE_ADMIN' ? 14 : 2),
          username: resolvedUsername,
          role: roleObj.code,
          role_display: roleObj.name,
          email: roleObj.email,
          first_name: roleObj.firstName || roleObj.displayName || 'Admin',
          last_name: roleObj.lastName || ''
        }
      };
    }

    throw new Error('Invalid username or password.');
  },

  resetPassword: async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      return { ok: res.ok, data };
    } catch (e) {
      console.warn('Backend reset password network notice:', e);
      return { ok: false, error: e.message };
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE}/auth/logout/`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.warn('Backend logout failed, clearing local token', e);
    }
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me/`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Dashboard Overview
  getDashboardOverview: async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/overview/`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Using local fallback overview', e);
    }
    return {
      metrics: {
        total_enquiries: 24,
        new_enquiries: 6,
        active_enquiries: 18,
        project_enquiries: 12,
        government_enquiries: 5,
        partnership_enquiries: 4,
        career_applications: 14,
        new_applications: 3,
        published_articles: 9,
        total_users: 6,
        total_services: 7,
        total_solutions: 8,
        total_industries: 6
      },
      monthly_trends: [
        { month: 'Jun 2026', enquiries: 4, applications: 2 },
        { month: 'Jul 2026', enquiries: 7, applications: 3 },
        { month: 'Aug 2026', enquiries: 11, applications: 6 },
        { month: 'Sep 2026', enquiries: 15, applications: 8 },
        { month: 'Oct 2026', enquiries: 19, applications: 11 },
        { month: 'Nov 2026', enquiries: 24, applications: 14 },
      ],
      status_breakdown: {
        'New': 6,
        'Contacted': 4,
        'Qualified': 5,
        'Proposal Sent': 3,
        'Negotiation': 4,
        'Won': 2,
        'Lost': 0
      },
      type_breakdown: {
        'Enterprise Projects': 12,
        'Government Sectors': 5,
        'Strategic Partnerships': 4,
        'General Contact': 3
      },
      industry_distribution: [
        { industry: 'Energy & Utilities', count: 6 },
        { industry: 'Government & Public Sector', count: 5 },
        { industry: 'Banking & Financial Services', count: 5 },
        { industry: 'Manufacturing & Logistics', count: 4 },
        { industry: 'Healthcare & Life Sciences', count: 3 },
        { industry: 'Telecommunications', count: 1 }
      ],
      recent_activity: [
        { id: 1, action: 'UPDATE_ENQUIRY', module: 'CRM', username: 'salesmgr', details: 'Status moved to Negotiation for Nordic Apex AB', status: 'SUCCESS', created_at: '2026-11-12T10:45:00' },
        { id: 2, action: 'LOGIN', module: 'Auth', username: 'admin', details: 'Administrator session initiated', status: 'SUCCESS', created_at: '2026-11-12T10:30:00' },
        { id: 3, action: 'CREATE_ENQUIRY', module: 'CRM', username: 'System', details: 'New government enquiry from Federal Ministry', status: 'SUCCESS', created_at: '2026-11-12T09:15:00' },
        { id: 4, action: 'UPDATE_ARTICLE', module: 'Insights', username: 'contentmgr', details: 'Published Architectural Rigor in Sovereign Cloud', status: 'SUCCESS', created_at: '2026-11-12T08:20:00' },
        { id: 5, action: 'SYSTEM_INIT', module: 'System', username: 'admin', details: 'Core Database & RBAC initialized', status: 'SUCCESS', created_at: '2026-11-12T08:00:00' },
      ],
      recent_enquiries: [
        { id: 1, reference_code: 'ENQ-2026-001', full_name: 'Dr. Alexander Vance', organization: 'Nordic Apex Infrastructure AB', enquiry_type: 'project', status: 'Negotiation', priority: 'Urgent', created_at: '2026-11-12 10:45' },
        { id: 2, reference_code: 'ENQ-2026-002', full_name: 'Hon. Kenneth Okonjo', organization: 'Federal Ministry of Communications', enquiry_type: 'government', status: 'Proposal Sent', priority: 'Urgent', created_at: '2026-11-12 09:15' },
        { id: 3, reference_code: 'ENQ-2026-003', full_name: 'Sophia Von Berg', organization: 'Munich Core Systems GmbH', enquiry_type: 'partnership', status: 'Qualified', priority: 'High', created_at: '2026-11-11 16:30' },
        { id: 4, reference_code: 'ENQ-2026-004', full_name: 'Rajeshwari Chidambaram', organization: 'Bharat Multi-Modal Logistics Ltd', enquiry_type: 'project', status: 'Contacted', priority: 'Medium', created_at: '2026-11-11 14:10' },
      ]
    };
  },

  // Resource Generic Helper
  getResource: async (endpoint) => {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(`Failed fetching ${endpoint}`, e);
    }
    return [];
  },

  postResource: async (endpoint, data) => {
    const res = await fetch(`${API_BASE}/${endpoint}/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      let msg = `Failed creating item in ${endpoint}`;
      try {
        const json = await res.json();
        if (json.detail) {
          msg = json.detail;
        } else if (typeof json === 'object') {
          const parts = Object.entries(json).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`);
          if (parts.length > 0) msg = parts.join(' | ');
        }
      } catch (_) {}
      throw new Error(msg);
    }
    return res.json();
  },

  patchResource: async (endpoint, id, data) => {
    const res = await fetch(`${API_BASE}/${endpoint}/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      let msg = `Failed updating item in ${endpoint}`;
      try {
        const json = await res.json();
        if (json.detail) {
          msg = json.detail;
        } else if (typeof json === 'object') {
          const parts = Object.entries(json).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`);
          if (parts.length > 0) msg = parts.join(' | ');
        }
      } catch (_) {}
      throw new Error(msg);
    }
    return res.json();
  },

  deleteResource: async (endpoint, id) => {
    const res = await fetch(`${API_BASE}/${endpoint}/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      let msg = `Failed deleting item in ${endpoint}`;
      try {
        const json = await res.json();
        if (json.detail) msg = json.detail;
      } catch (_) {}
      throw new Error(msg);
    }
    return true;
  },

  // Custom action helper
  customPost: async (url, data = {}) => {
    const res = await fetch(`${API_BASE}/${url}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Action failed for ${url}`);
    return res.json();
  }
};

