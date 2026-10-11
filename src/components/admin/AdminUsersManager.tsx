import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit,
  Shield,
  ShieldCheck,
  Check,
  X,
  Search,
  Key,
  Mail,
  Phone,
  Lock
} from 'lucide-react';

export interface AdminUserRecord {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Editor' | 'Mandi Broker' | 'Miller / Seller' | 'Shop Manager';
  permissions: {
    manageSettings: boolean;
    managePlugins: boolean;
    managePages: boolean;
    managePosts: boolean;
    manageSellers: boolean;
    manageErp: boolean;
    viewAnalytics: boolean;
  };
  twoFactor: boolean;
  postsCount: number;
  registeredDate: string;
}

const INITIAL_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: 'user-1',
    username: 'admin',
    name: 'Hashir Rice Supplier (Admin Desk)',
    email: 'info@hashirricesupplier.com',
    role: 'Administrator',
    permissions: {
      manageSettings: true,
      managePlugins: true,
      managePages: true,
      managePosts: true,
      manageSellers: true,
      manageErp: true,
      viewAnalytics: true,
    },
    twoFactor: true,
    postsCount: 14,
    registeredDate: '2026-01-01'
  },
  {
    id: 'user-2',
    username: 'bucheki_mandi_ops',
    name: 'Mian Tariq (Galla Mandi Desk)',
    email: 'tariq@buchekirice.pk',
    role: 'Mandi Broker',
    permissions: {
      manageSettings: false,
      managePlugins: false,
      managePages: true,
      managePosts: true,
      manageSellers: true,
      manageErp: true,
      viewAnalytics: true,
    },
    twoFactor: true,
    postsCount: 6,
    registeredDate: '2026-03-15'
  },
  {
    id: 'user-3',
    username: 'hafizabad_miller',
    name: 'Chaudhry Bilal (Hafizabad Steam Mills)',
    email: 'bilal@hafizabadrice.com',
    role: 'Miller / Seller',
    permissions: {
      manageSettings: false,
      managePlugins: false,
      managePages: false,
      managePosts: false,
      manageSellers: false,
      manageErp: true,
      viewAnalytics: false,
    },
    twoFactor: false,
    postsCount: 0,
    registeredDate: '2026-05-10'
  }
];

interface AdminUsersManagerProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({ onSuccessToast }) => {
  const [users, setUsers] = useState<AdminUserRecord[]>(() => {
    const saved = localStorage.getItem('hashir_rice_admin_users');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);

  const [userForm, setUserForm] = useState<Partial<AdminUserRecord>>({
    username: '',
    name: '',
    email: '',
    role: 'Editor',
    twoFactor: true,
    permissions: {
      manageSettings: false,
      managePlugins: false,
      managePages: true,
      managePosts: true,
      manageSellers: true,
      manageErp: true,
      viewAnalytics: true,
    }
  });

  const saveUsers = (updated: AdminUserRecord[]) => {
    setUsers(updated);
    localStorage.setItem('hashir_rice_admin_users', JSON.stringify(updated));
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (id === 'user-1') {
      alert('Cannot delete primary Root Super-Admin account.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      const updated = users.filter((u) => u.id !== id);
      saveUsers(updated);
      if (onSuccessToast) onSuccessToast(`User "${name}" deleted.`);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.username || !userForm.email) return;

    if (editingUser) {
      const updated = users.map((u) => (u.id === editingUser.id ? { ...u, ...userForm } as AdminUserRecord : u));
      saveUsers(updated);
      if (onSuccessToast) onSuccessToast(`User "${userForm.name}" updated.`);
    } else {
      const newUser: AdminUserRecord = {
        id: `user-${Date.now()}`,
        username: userForm.username,
        name: userForm.name,
        email: userForm.email,
        role: userForm.role || 'Editor',
        permissions: userForm.permissions || {
          manageSettings: false,
          managePlugins: false,
          managePages: true,
          managePosts: true,
          manageSellers: true,
          manageErp: true,
          viewAnalytics: true,
        },
        twoFactor: userForm.twoFactor ?? true,
        postsCount: 0,
        registeredDate: new Date().toISOString().split('T')[0]
      };
      saveUsers([...users, newUser]);
      if (onSuccessToast) onSuccessToast(`User "${newUser.name}" created with role ${newUser.role}.`);
    }
    setShowAddModal(false);
    setEditingUser(null);
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
              Role-Based Access Control (RBAC)
            </span>
            <span className="text-xs text-[#646970]">Full Add / Edit / Remove Permissions</span>
          </div>
          <h2 className="text-xl font-bold text-[#1d2327] mt-1 flex items-center gap-2 font-serif">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            Users, Staff & Super-Admin Permissions Matrix
          </h2>
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setUserForm({
              username: '',
              name: '',
              email: '',
              role: 'Editor',
              twoFactor: true,
              permissions: {
                manageSettings: false,
                managePlugins: false,
                managePages: true,
                managePosts: true,
                manageSellers: true,
                manageErp: true,
                viewAnalytics: true,
              }
            });
            setShowAddModal(true);
          }}
          className="px-3.5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New User</span>
        </button>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-xs p-5 space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8c8f94]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, username, email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#8c8f94] rounded bg-white focus:border-[#2271b1] outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f6f7f7] border-y border-[#dcdcde] text-[#2c3338] font-bold">
                <th className="p-3">Username & Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Role</th>
                <th className="p-3">Granular Permissions</th>
                <th className="p-3">2FA Security</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dcdcde]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#f6f7f7]">
                  <td className="p-3">
                    <strong className="text-[#1d2327] block text-sm">{u.name}</strong>
                    <span className="text-[11px] font-mono text-[#2271b1]">@{u.username}</span>
                  </td>
                  <td className="p-3 font-mono text-[#50575e]">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      u.role === 'Administrator'
                        ? 'bg-purple-100 text-purple-900 border-purple-300'
                        : u.role === 'Mandi Broker'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {u.permissions.manageSettings && <span className="px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded text-[9px] font-bold border border-purple-200">Settings</span>}
                      {u.permissions.managePlugins && <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded text-[9px] font-bold border border-blue-200">Plugins</span>}
                      {u.permissions.managePages && <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold border border-emerald-200">Pages</span>}
                      {u.permissions.manageSellers && <span className="px-1.5 py-0.2 bg-amber-50 text-amber-700 rounded text-[9px] font-bold border border-amber-200">Sellers</span>}
                      {u.permissions.manageErp && <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded text-[9px] font-bold border border-indigo-200">ERP</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-fit ${
                      u.twoFactor ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      <Lock className="w-2.5 h-2.5" />
                      {u.twoFactor ? '2FA Active' : 'Off'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setUserForm(u);
                        setShowAddModal(true);
                      }}
                      className="px-2 py-1 bg-white hover:bg-neutral-100 text-[#2271b1] border border-[#8c8f94] rounded text-xs font-semibold"
                    >
                      <Edit className="w-3 h-3 inline mr-1" />
                      Edit
                    </button>
                    {u.id !== 'user-1' && (
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded text-xs font-semibold"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT USER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#dcdcde] pb-3">
              <h3 className="font-bold text-base text-[#1d2327] flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-700" />
                <span>{editingUser ? 'Edit User & Permissions' : 'Create New WordPress Admin User'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#646970] hover:text-[#1d2327] text-lg font-bold">×</button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none font-mono"
                    placeholder="e.g. mandi_broker_1"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                    placeholder="e.g. Haji Usman"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                    placeholder="user@hashirrice.pk"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1d2327] mb-1">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none bg-white"
                  >
                    <option value="Administrator">Administrator (Super Admin)</option>
                    <option value="Mandi Broker">Mandi Broker</option>
                    <option value="Editor">Editor</option>
                    <option value="Shop Manager">Shop / ERP Manager</option>
                    <option value="Miller / Seller">Miller / Seller</option>
                  </select>
                </div>
              </div>

              {/* Granular Permissions Checkboxes */}
              <div className="border border-[#dcdcde] rounded-lg p-3 bg-[#f6f7f7] space-y-2">
                <span className="font-bold text-[#1d2327] block">Specific Capability Permissions</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'manageSettings', label: 'Manage Settings' },
                    { key: 'managePlugins', label: 'Manage Plugins' },
                    { key: 'managePages', label: 'Add/Edit Pages' },
                    { key: 'managePosts', label: 'Add/Edit Posts' },
                    { key: 'manageSellers', label: 'Seller Portal Control' },
                    { key: 'manageErp', label: 'ERP & Bilty Access' },
                    { key: 'viewAnalytics', label: 'Site Kit & Revenue' }
                  ].map((perm) => (
                    <label key={perm.key} className="flex items-center gap-1.5 font-medium text-[#2c3338]">
                      <input
                        type="checkbox"
                        checked={userForm.permissions?.[perm.key as keyof typeof userForm.permissions] ?? false}
                        onChange={(e) =>
                          setUserForm({
                            ...userForm,
                            permissions: {
                              ...userForm.permissions!,
                              [perm.key]: e.target.checked
                            }
                          })
                        }
                        className="rounded text-[#2271b1]"
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#dcdcde]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-[#8c8f94] text-[#2c3338] rounded font-semibold hover:bg-[#f0f0f1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
