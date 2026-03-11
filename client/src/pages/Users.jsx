
import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Users.css";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mail, 
  User, 
  Shield, 
  Calendar,
  Download,
  RefreshCw,
  X,
  ChevronDown,
  MoreVertical,
  Eye,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Key,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [bulkSelect, setBulkSelect] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    userId: null,
    newPassword: "",
    confirmPassword: ""
  });
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    sales: 0,
    employee: 0,
    active: 0,
    inactive: 0
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
    status: "active",
    phone: "",
    department: "",
    position: "",
    employeeId: "",
    joinDate: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    permissions: [],
    notes: ""
  });

  const roleOptions = [
    { value: "admin", label: "Admin", color: "#ef4444", icon: ShieldAlert },
    { value: "sales", label: "Sales", color: "#3b82f6", icon: UserCheck },
    { value: "employee", label: "Employee", color: "#22c55e", icon: User }
  ];

  const permissionOptions = [
    { value: "manage_users", label: "Manage Users" },
    { value: "manage_projects", label: "Manage Projects" },
    { value: "manage_clients", label: "Manage Clients" },
    { value: "manage_leads", label: "Manage Leads" },
    { value: "view_reports", label: "View Reports" },
    { value: "export_data", label: "Export Data" },
    { value: "manage_settings", label: "Manage Settings" }
  ];

  const statusColors = {
    active: "#22c55e",
    inactive: "#94a3b8",
    suspended: "#ef4444"
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, statusFilter, sortBy]);

  useEffect(() => {
    calculateStats();
  }, [users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name?.localeCompare(a.name));
        break;
      case "role":
        filtered.sort((a, b) => a.role?.localeCompare(b.role));
        break;
      default:
        break;
    }

    setFilteredUsers(filtered);
  };

  const calculateStats = () => {
    const stats = {
      total: users.length,
      admin: users.filter(u => u.role === 'admin').length,
      sales: users.filter(u => u.role === 'sales').length,
      employee: users.filter(u => u.role === 'employee').length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length
    };
    setStats(stats);
  };

  const handleOpen = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        role: user.role || "employee",
        status: user.status || "active",
        phone: user.phone || "",
        department: user.department || "",
        position: user.position || "",
        employeeId: user.employeeId || "",
        joinDate: user.joinDate ? user.joinDate.split("T")[0] : "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        zipCode: user.zipCode || "",
        permissions: user.permissions || [],
        notes: user.notes || ""
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "employee",
        status: "active",
        phone: "",
        department: "",
        position: "",
        employeeId: "",
        joinDate: "",
        address: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        permissions: [],
        notes: ""
      });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'permissions') {
        const updatedPermissions = checked
          ? [...formData.permissions, value]
          : formData.permissions.filter(p => p !== value);
        setFormData(prev => ({ ...prev, permissions: updatedPermissions }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match if creating new user or changing password
    if (!editingUser || formData.password) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    }

    setLoading(true);
    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...submitData } = formData;
      
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, submitData);
      } else {
        await api.post("/users", submitData);
      }
      
      handleClose();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setShowDeleteConfirm(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const bulkDelete = async () => {
    try {
      await Promise.all(bulkSelect.map(id => api.delete(`/users/${id}`)));
      setBulkSelect([]);
      setShowBulkActions(false);
      fetchUsers();
    } catch (error) {
      console.error("Error bulk deleting users:", error);
    }
  };

  const bulkStatusUpdate = async (status) => {
    try {
      await Promise.all(bulkSelect.map(id => 
        api.put(`/users/${id}/status`, { status })
      ));
      setBulkSelect([]);
      setShowBulkActions(false);
      fetchUsers();
    } catch (error) {
      console.error("Error bulk updating status:", error);
    }
  };

  const toggleSelectAll = () => {
    if (bulkSelect.length === filteredUsers.length) {
      setBulkSelect([]);
    } else {
      setBulkSelect(filteredUsers.map(u => u._id));
    }
  };

  const toggleSelect = (id) => {
    if (bulkSelect.includes(id)) {
      setBulkSelect(bulkSelect.filter(selectedId => selectedId !== id));
    } else {
      setBulkSelect([...bulkSelect, id]);
    }
  };

  const handleExport = (format) => {
    const data = filteredUsers.map(u => ({
      Name: u.name,
      Email: u.email,
      Role: u.role,
      Status: u.status,
      Department: u.department || 'N/A',
      Position: u.position || 'N/A',
      'Employee ID': u.employeeId || 'N/A',
      Phone: u.phone || 'N/A',
      'Join Date': u.joinDate ? new Date(u.joinDate).toLocaleDateString() : 'N/A',
      'Last Active': u.lastActive ? new Date(u.lastActive).toLocaleDateString() : 'N/A'
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      a.click();
    }
  };

  const handleResetPassword = (userId) => {
    setPasswordData({
      userId,
      newPassword: "",
      confirmPassword: ""
    });
    setShowPasswordModal(true);
  };

  const submitPasswordReset = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await api.put(`/users/${passwordData.userId}/password`, {
        password: passwordData.newPassword
      });
      setShowPasswordModal(false);
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.put(`/users/${userId}/status`, { status: newStatus });
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const timeAgo = (date) => {
    if (!date) return 'Never';
    
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const value = Math.floor(seconds / secondsInUnit);
      if (value >= 1) {
        return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'just now';
  };

  const getRoleIcon = (role) => {
    const option = roleOptions.find(r => r.value === role);
    return option ? option.icon : User;
  };

  const getRoleColor = (role) => {
    const option = roleOptions.find(r => r.value === role);
    return option ? option.color : "#94a3b8";
  };

  return (
    <div className="users-container">
      {/* Header Section */}
      <div className="users-header">
        <div className="header-left">
          <h1>
            <Shield size={28} />
            User Management
          </h1>
          <p className="header-subtitle">Manage system users, roles, and permissions</p>
        </div>

        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => handleOpen()}
          >
            <Plus size={18} />
            Add User
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => handleExport('csv')}
          >
            <Download size={18} />
            Export
          </button>

          <button 
            className="btn-refresh"
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon admin">
            <ShieldAlert size={24} />
          </div>
          <div className="stat-content">
            <h3>Admins</h3>
            <div className="stat-value">{stats.admin}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sales">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>Sales</h3>
            <div className="stat-value">{stats.sales}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon employee">
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>Employees</h3>
            <div className="stat-value">{stats.employee}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Active</h3>
            <div className="stat-value">{stats.active}</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search users by name, email, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X size={16} onClick={() => setSearchTerm("")} className="clear-search" />
          )}
        </div>

        <div className="filter-group">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="role">Role</option>
          </select>

          {bulkSelect.length > 0 && (
            <div className="bulk-actions">
              <span>{bulkSelect.length} selected</span>
              <button onClick={() => setShowBulkActions(!showBulkActions)}>
                <ChevronDown size={16} />
              </button>
              {showBulkActions && (
                <div className="bulk-dropdown">
                  <button onClick={() => bulkStatusUpdate("active")}>
                    <CheckCircle size={16} /> Activate
                  </button>
                  <button onClick={() => bulkStatusUpdate("inactive")}>
                    <UserX size={16} /> Deactivate
                  </button>
                  <button onClick={bulkDelete} className="delete-action">
                    <Trash2 size={16} /> Delete Selected
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={handleClose} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="user@email.com"
                    />
                  </div>

                  {!editingUser && (
                    <>
                      <div className="form-group">
                        <label>Password *</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required={!editingUser}
                          placeholder="Enter password"
                        />
                      </div>

                      <div className="form-group">
                        <label>Confirm Password *</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required={!editingUser}
                          placeholder="Confirm password"
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label>Employee ID</label>
                    <input
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      placeholder="EMP001"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Role & Status</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      {roleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Department</label>
                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Engineering, Sales"
                    />
                  </div>

                  <div className="form-group">
                    <label>Position</label>
                    <input
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Job title"
                    />
                  </div>

                  <div className="form-group">
                    <label>Join Date</label>
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Address</h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Street Address</label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Permissions</h3>
                <div className="permissions-grid">
                  {permissionOptions.map(permission => (
                    <label key={permission.value} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="permissions"
                        value={permission.value}
                        checked={formData.permissions.includes(permission.value)}
                        onChange={handleChange}
                      />
                      {permission.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Notes</h3>
                <div className="form-group">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Additional notes about the user..."
                  />
                </div>
              </div>

              {editingUser && (
                <div className="form-section">
                  <h3>Reset Password</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current"
                      />
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={handleClose} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Add User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={bulkSelect.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Department</th>
              <th>Last Active</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="loading-cell">
                  <div className="spinner"></div>
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  <User size={48} />
                  <p>No users found</p>
                  <button onClick={() => handleOpen()} className="btn-primary">
                    Add your first user
                  </button>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                const roleColor = getRoleColor(user.role);
                
                return (
                  <tr key={user._id} className={bulkSelect.includes(user._id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={bulkSelect.includes(user._id)}
                        onChange={() => toggleSelect(user._id)}
                      />
                    </td>

                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{user.name}</strong>
                          <div className="user-email">
                            <Mail size={12} />
                            <span>{user.email}</span>
                          </div>
                          {user.employeeId && (
                            <div className="user-id">ID: {user.employeeId}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span 
                        className="role-badge"
                        style={{ 
                          backgroundColor: `${roleColor}20`,
                          color: roleColor
                        }}
                      >
                        <RoleIcon size={14} />
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: `${statusColors[user.status]}20`,
                          color: statusColors[user.status]
                        }}
                      >
                        {user.status === 'active' && <CheckCircle size={12} />}
                        {user.status === 'inactive' && <Clock size={12} />}
                        {user.status === 'suspended' && <AlertCircle size={12} />}
                        {user.status}
                      </span>
                    </td>

                    <td>
                      <div className="department-info">
                        <span>{user.department || 'N/A'}</span>
                        {user.position && (
                          <span className="position">{user.position}</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="time-info">
                        <Clock size={14} />
                        <span>{timeAgo(user.lastActive)}</span>
                      </div>
                    </td>

                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        <span>
                          {user.joinDate 
                            ? new Date(user.joinDate).toLocaleDateString() 
                            : 'N/A'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetails(true);
                          }}
                          className="action-btn view"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleOpen(user)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleResetPassword(user._id)}
                          className="action-btn password"
                          title="Reset Password"
                        >
                          <Key size={16} />
                        </button>

                        <button
                          onClick={() => toggleUserStatus(user._id, user.status)}
                          className={`action-btn ${user.status === 'active' ? 'deactivate' : 'activate'}`}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>

                        <button
                          onClick={() => setShowDeleteConfirm(user._id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {showDeleteConfirm === user._id && (
                        <div className="delete-confirm">
                          <p>Delete this user?</p>
                          <div className="confirm-actions">
                            <button onClick={() => handleDelete(user._id)}>Yes</button>
                            <button onClick={() => setShowDeleteConfirm(null)}>No</button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button onClick={() => setShowDetails(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="details-container">
              <div className="details-header">
                <div className="user-avatar large">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-title">
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email}</p>
                  {selectedUser.employeeId && (
                    <span className="user-id-badge">ID: {selectedUser.employeeId}</span>
                  )}
                </div>
                <div className="user-badges">
                  <span 
                    className="role-badge"
                    style={{ 
                      backgroundColor: `${getRoleColor(selectedUser.role)}20`,
                      color: getRoleColor(selectedUser.role)
                    }}
                  >
                    {selectedUser.role}
                  </span>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${statusColors[selectedUser.status]}20`,
                      color: statusColors[selectedUser.status]
                    }}
                  >
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div className="details-grid">
                <div className="details-section">
                  <h4>Contact Information</h4>
                  <div className="detail-item">
                    <Mail size={16} />
                    <div>
                      <label>Email</label>
                      <p>{selectedUser.email}</p>
                    </div>
                  </div>
                  {selectedUser.phone && (
                    <div className="detail-item">
                      <Phone size={16} />
                      <div>
                        <label>Phone</label>
                        <p>{selectedUser.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <h4>Employment Information</h4>
                  <div className="detail-item">
                    <User size={16} />
                    <div>
                      <label>Role</label>
                      <p>{selectedUser.role}</p>
                    </div>
                  </div>
                  {selectedUser.department && (
                    <div className="detail-item">
                      <Building size={16} />
                      <div>
                        <label>Department</label>
                        <p>{selectedUser.department}</p>
                      </div>
                    </div>
                  )}
                  {selectedUser.position && (
                    <div className="detail-item">
                      <User size={16} />
                      <div>
                        <label>Position</label>
                        <p>{selectedUser.position}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <h4>Timeline</h4>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <div>
                      <label>Join Date</label>
                      <p>{selectedUser.joinDate 
                        ? new Date(selectedUser.joinDate).toLocaleDateString() 
                        : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <div>
                      <label>Last Active</label>
                      <p>{selectedUser.lastActive 
                        ? new Date(selectedUser.lastActive).toLocaleString() 
                        : 'Never'}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <div>
                      <label>Created</label>
                      <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {selectedUser.address && (
                  <div className="details-section">
                    <h4>Address</h4>
                    <p>
                      {selectedUser.address}<br />
                      {selectedUser.city && `${selectedUser.city}, `}
                      {selectedUser.state && `${selectedUser.state} `}
                      {selectedUser.zipCode}<br />
                      {selectedUser.country}
                    </p>
                  </div>
                )}

                {selectedUser.permissions && selectedUser.permissions.length > 0 && (
                  <div className="details-section full-width">
                    <h4>Permissions</h4>
                    <div className="permissions-list">
                      {selectedUser.permissions.map(permission => (
                        <span key={permission} className="permission-tag">
                          {permissionOptions.find(p => p.value === permission)?.label || permission}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUser.notes && (
                  <div className="details-section full-width">
                    <h4>Notes</h4>
                    <p className="notes-text">{selectedUser.notes}</p>
                  </div>
                )}
              </div>

              <div className="details-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowDetails(false);
                    handleOpen(selectedUser);
                  }}
                >
                  <Edit size={16} /> Edit User
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowDetails(false);
                    handleResetPassword(selectedUser._id);
                  }}
                >
                  <Key size={16} /> Reset Password
                </button>
                <button 
                  className={`btn-${selectedUser.status === 'active' ? 'warning' : 'success'}`}
                  onClick={() => {
                    toggleUserStatus(selectedUser._id, selectedUser.status);
                    setShowDetails(false);
                  }}
                >
                  {selectedUser.status === 'active' ? (
                    <>
                      <UserX size={16} /> Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck size={16} /> Activate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content password-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="password-container">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value
                  })}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li>At least 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={submitPasswordReset}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;