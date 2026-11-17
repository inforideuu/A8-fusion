// Dynamic Security Recovery Credentials Engine
// No pre-configured or hardcoded questions/answers.
// Completely dynamic per username/account with intelligent role/alias resolution.

import { API_BASE } from '../services/apiconfig.js';

const STORAGE_KEY = 'a8_dynamic_user_recovery';
const PASSWORDS_STORAGE_KEY = 'a8_custom_passwords';

// Get entire dynamic store from localStorage
export const getDynamicRecoveryStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Save recovery store
export const saveDynamicRecoveryStore = (store) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('Failed saving dynamic recovery store:', e);
  }
};

export const SYSTEM_ROLES = [
  {
    code: 'SUPER_ADMIN',
    name: 'Super Admin',
    defaultUser: 'a8fusionadmin',
    displayName: 'Super Admin',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@a8fusion.com',
    color: 'indigo',
    aliases: [
      'a8fusionadmin', 'admin', 'superadmin', 'super admin', 'administrator', 'super', 'super_admin',
      'superadmin@a8fusion.com', 'admin@a8fusion.com', 'root', 'master'
    ]
  },
  {
    code: 'WEBSITE_ADMIN',
    name: 'Website Administrator',
    defaultUser: 'websiteadmin',
    displayName: 'website admin',
    firstName: 'website',
    lastName: 'admin',
    email: 'website@gmail.com',
    color: 'blue',
    aliases: [
      'websiteadmin', 'website admin', 'webadmin', 'web admin', 'website administrator',
      'website', 'web', 'webmaster', 'site admin', 'siteadmin',
      'website@gmail.com', 'webmaster@a8fusion.com', 'webadmin@a8fusion.com', 'website_admin'
    ]
  },
  {
    code: 'CONTENT_MANAGER',
    name: 'Content Manager',
    defaultUser: 'contentmanager',
    displayName: 'content manager',
    firstName: 'content',
    lastName: 'manager',
    email: 'content@gmail.com',
    color: 'emerald',
    aliases: [
      'contentmanager', 'content manager', 'contentmgr', 'content mgr', 'content',
      'editor', 'content editor', 'content@gmail.com', 'content@a8fusion.com', 'content_manager'
    ]
  },
  {
    code: 'SALES_MANAGER',
    name: 'Sales Manager',
    defaultUser: 'salesmanager',
    displayName: 'sales manager',
    firstName: 'sales',
    lastName: 'manager',
    email: 'sales@gmail.com',
    color: 'amber',
    aliases: [
      'salesmanager', 'sales manager', 'salesmgr', 'sales mgr', 'sales',
      'crm', 'deals', 'sales@gmail.com', 'sales@a8fusion.com', 'sales_manager'
    ]
  },
  {
    code: 'HR_MANAGER',
    name: 'HR Manager',
    defaultUser: 'hrmanager',
    displayName: 'Hr manager',
    firstName: 'Hr',
    lastName: 'manager',
    email: 'hr@gmail.com',
    color: 'purple',
    aliases: [
      'hrmanager', 'hr manager', 'hrmgr', 'hr mgr', 'hr',
      'human resources', 'careers', 'hiring', 'hr@gmail.com', 'hr@a8fusion.com', 'hr_manager'
    ]
  },
  {
    code: 'BD_MANAGER',
    name: 'Business Development Manager',
    defaultUser: 'bdmanager',
    displayName: 'bd manager',
    firstName: 'bd',
    lastName: 'manager',
    email: 'bd@gmail.com',
    color: 'rose',
    aliases: [
      'bdmanager', 'bd manager', 'bdmgr', 'bd mgr', 'bd',
      'business', 'business development', 'business development manager', 'businessdev',
      'partnerships', 'bd@gmail.com', 'partnerships@a8fusion.com', 'bd@a8fusion.com', 'bd_manager'
    ]
  },
];

// Helper to normalize username, email, title, or role code to canonical username
export const normalizeIdentifier = (input = '') => {
  if (!input) return '';
  const clean = String(input).trim().toLowerCase();
  if (!clean) return '';

  // Check exact matches across code, defaultUser, name, email, and aliases
  for (const r of SYSTEM_ROLES) {
    if (
      r.code.toLowerCase() === clean ||
      r.defaultUser.toLowerCase() === clean ||
      r.name.toLowerCase() === clean ||
      (r.email && r.email.toLowerCase() === clean) ||
      (r.aliases && r.aliases.some(a => a.toLowerCase() === clean))
    ) {
      return r.defaultUser.toLowerCase();
    }
  }

  // Check fuzzy matches by stripping non-alphanumeric characters (spaces, hyphens, underscores, dots)
  const stripped = clean.replace(/[^a-z0-9]/g, '');
  if (stripped) {
    for (const r of SYSTEM_ROLES) {
      const strippedCode = r.code.toLowerCase().replace(/[^a-z0-9]/g, '');
      const strippedUser = r.defaultUser.toLowerCase().replace(/[^a-z0-9]/g, '');
      const strippedName = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (
        strippedCode === stripped ||
        strippedUser === stripped ||
        strippedName === stripped ||
        (r.aliases && r.aliases.some(a => a.toLowerCase().replace(/[^a-z0-9]/g, '') === stripped))
      ) {
        return r.defaultUser.toLowerCase();
      }
    }
  }

  return clean;
};

// Find matching role metadata by any identifier or role code
export const getRoleByIdentifier = (input = '') => {
  if (!input) return null;
  const clean = String(input).trim().toLowerCase();
  const canonical = normalizeIdentifier(clean);

  // Match by canonical defaultUser
  const byCanonical = SYSTEM_ROLES.find(r => r.defaultUser.toLowerCase() === canonical);
  if (byCanonical) return byCanonical;

  // Match by code, email, or alias directly
  const byCodeOrAlias = SYSTEM_ROLES.find(r =>
    r.code.toLowerCase() === clean ||
    (r.email && r.email.toLowerCase() === clean) ||
    (r.aliases && r.aliases.some(a => a.toLowerCase() === clean))
  );
  if (byCodeOrAlias) return byCodeOrAlias;

  return null;
};

// Get a specific user's dynamic recovery profile with multi-key and role fallback
export const getUserRecoveryProfile = (username = '') => {
  if (!username) return null;
  const store = getDynamicRecoveryStore();
  const rawKey = String(username).trim().toLowerCase();
  if (!rawKey) return null;

  const canonical = normalizeIdentifier(rawKey);

  // 1. Direct canonical lookup (e.g. 'webadmin')
  if (store[canonical]) return store[canonical];

  // 2. Direct raw key lookup (e.g. 'website admin', 'webmaster@a8fusion.com')
  if (store[rawKey]) return store[rawKey];

  // 3. Direct lookup by stripped key (alphanumeric only)
  const stripped = rawKey.replace(/[^a-z0-9]/g, '');
  if (stripped && store[stripped]) return store[stripped];

  // 4. Role lookup: If rawKey or canonical corresponds to a known role, check role keys
  const roleObj = getRoleByIdentifier(rawKey) || getRoleByIdentifier(canonical);
  if (roleObj) {
    if (store[roleObj.defaultUser.toLowerCase()]) return store[roleObj.defaultUser.toLowerCase()];
    if (store[roleObj.code.toLowerCase()]) return store[roleObj.code.toLowerCase()];
    if (store[roleObj.code]) return store[roleObj.code];
    if (roleObj.email && store[roleObj.email.toLowerCase()]) return store[roleObj.email.toLowerCase()];
    if (roleObj.aliases) {
      for (const a of roleObj.aliases) {
        if (store[a.toLowerCase()]) return store[a.toLowerCase()];
      }
    }
  }

  // 5. Search through all keys in store and see if their normalized key matches canonical
  for (const [key, profile] of Object.entries(store)) {
    if (!profile) continue;
    if (normalizeIdentifier(key) === canonical) return profile;
    if (profile.username && normalizeIdentifier(profile.username) === canonical) return profile;
    if (profile.canonicalUser && normalizeIdentifier(profile.canonicalUser) === canonical) return profile;
    if (profile.role && roleObj && profile.role.toUpperCase() === roleObj.code.toUpperCase()) return profile;
    if (profile.email && profile.email.toLowerCase() === rawKey) return profile;
    if (key.toLowerCase().replace(/[^a-z0-9]/g, '') === stripped) return profile;
  }

  return null;
};

// Check if a specific user has configured recovery
export const hasUserConfiguredRecovery = (username = '') => {
  const profile = getUserRecoveryProfile(username);
  return Boolean(profile && profile.pin && profile.question && profile.answer);
};

// Dynamically set or update a user's recovery credentials with comprehensive role cross-indexing
export const setUserRecoveryProfile = (username, { pin, question, answer }, metadata = {}) => {
  if (!username) return false;
  const store = getDynamicRecoveryStore();
  const canonical = normalizeIdentifier(username);
  const rawKey = String(username).trim().toLowerCase();

  const assignedRoleCode = metadata.role || '';
  const roleObj = SYSTEM_ROLES.find(r => r.code === assignedRoleCode) ||
                  getRoleByIdentifier(username) ||
                  getRoleByIdentifier(canonical);

  const finalRole = roleObj ? roleObj.code : assignedRoleCode;
  const finalEmail = metadata.email || (roleObj ? roleObj.email : '');

  const payload = {
    username: String(username).trim(),
    canonicalUser: canonical,
    role: finalRole,
    email: finalEmail,
    pin: String(pin).trim(),
    question: String(question).trim(),
    answer: String(answer).trim(),
    updatedAt: new Date().toISOString()
  };

  // Store under canonical username (e.g. 'webadmin')
  store[canonical] = payload;

  // Also store under raw identifier if different (e.g. 'website admin' or custom username)
  if (rawKey && rawKey !== canonical) {
    store[rawKey] = payload;
  }

  // Also store stripped key
  const stripped = rawKey.replace(/[^a-z0-9]/g, '');
  if (stripped) {
    store[stripped] = payload;
  }

  // Store under associated role code and all aliases to guarantee 100% retrieval from any angle
  if (roleObj) {
    store[roleObj.defaultUser.toLowerCase()] = payload;
    store[roleObj.code.toLowerCase()] = payload;
    store[roleObj.code] = payload;
    if (roleObj.email) {
      store[roleObj.email.toLowerCase()] = payload;
    }
    if (roleObj.aliases) {
      for (const a of roleObj.aliases) {
        store[a.toLowerCase()] = payload;
        const aStripped = a.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (aStripped) store[aStripped] = payload;
      }
    }
  } else if (assignedRoleCode) {
    store[assignedRoleCode.toLowerCase()] = payload;
    store[assignedRoleCode] = payload;
  }

  if (finalEmail) {
    store[finalEmail.toLowerCase()] = payload;
  }

  saveDynamicRecoveryStore(store);
  return true;
};

// Verify 6-digit PIN dynamically
export const verifyDynamicPin = (username, enteredPin) => {
  const profile = getUserRecoveryProfile(username);
  if (!profile || !profile.pin) return false;
  return profile.pin === String(enteredPin).trim();
};

// Verify Custom Security Answer dynamically (case-insensitive & whitespace-trimmed)
export const verifyDynamicAnswer = (username, enteredAnswer) => {
  const profile = getUserRecoveryProfile(username);
  if (!profile || !profile.answer) return false;
  return profile.answer.trim().toLowerCase() === String(enteredAnswer).trim().toLowerCase();
};

// Save newly reset password with backend persistence and complete role & alias synchronization
export const saveNewPassword = async (username, newPassword) => {
  let backendUser = null;

  // 1. Call real backend to update real database user!
  try {
    const res = await fetch(`${API_BASE}/auth/reset-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: newPassword })
    });
    if (res.ok) {
      const json = await res.json();
      backendUser = json.user;
      console.log('Database user password successfully reset on backend:', json);
    }
  } catch (netErr) {
    console.warn('Backend reset password network notice:', netErr);
  }

  // 2. Also keep in local storage for offline recovery
  try {
    const raw = localStorage.getItem(PASSWORDS_STORAGE_KEY);
    const passwords = raw ? JSON.parse(raw) : {};
    const canonical = normalizeIdentifier(username);
    const rawKey = String(username || '').trim().toLowerCase();

    passwords[canonical] = newPassword;
    if (rawKey && rawKey !== canonical) {
      passwords[rawKey] = newPassword;
    }

    const stripped = rawKey.replace(/[^a-z0-9]/g, '');
    if (stripped) {
      passwords[stripped] = newPassword;
    }

    if (backendUser?.username) {
      passwords[backendUser.username.toLowerCase()] = newPassword;
      const bStripped = backendUser.username.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (bStripped) passwords[bStripped] = newPassword;
    }

    const profile = getUserRecoveryProfile(username);
    if (profile?.username) {
      passwords[profile.username] = newPassword;
      passwords[profile.username.toLowerCase()] = newPassword;
      const uStripped = profile.username.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (uStripped) passwords[uStripped] = newPassword;
    }
    if (profile?.email) {
      passwords[profile.email.toLowerCase()] = newPassword;
    }

    const roleObj = (profile?.role && SYSTEM_ROLES.find(r => r.code === profile.role)) ||
                    getRoleByIdentifier(username) ||
                    getRoleByIdentifier(canonical);
    if (roleObj) {
      passwords[roleObj.defaultUser.toLowerCase()] = newPassword;
      passwords[roleObj.code.toLowerCase()] = newPassword;
      passwords[roleObj.code] = newPassword;
      if (roleObj.email) {
        passwords[roleObj.email.toLowerCase()] = newPassword;
      }
      if (roleObj.aliases) {
        for (const a of roleObj.aliases) {
          passwords[a.toLowerCase()] = newPassword;
          const aStripped = a.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (aStripped) passwords[aStripped] = newPassword;
        }
      }
    }

    localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(passwords));
    return backendUser ? { success: true, user: backendUser } : true;
  } catch (e) {
    console.warn('Failed saving new password to localStorage:', e);
    return false;
  }
};
