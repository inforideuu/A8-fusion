const API_BASE = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('a8_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {})
  };
};

export const adminApi = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Invalid username or password.');
    return data;
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
        published_articles: 8,
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
        { id: 5, action: 'SYSTEM_INIT', module: 'System', username: 'admin', details: 'MySQL Database & RBAC initialized', status: 'SUCCESS', created_at: '2026-11-12T08:00:00' },
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
    if (!res.ok) throw new Error(`Failed creating item in ${endpoint}`);
    return res.json();
  },

  patchResource: async (endpoint, id, data) => {
    const res = await fetch(`${API_BASE}/${endpoint}/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Failed updating item in ${endpoint}`);
    return res.json();
  },

  deleteResource: async (endpoint, id) => {
    const res = await fetch(`${API_BASE}/${endpoint}/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Failed deleting item in ${endpoint}`);
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

