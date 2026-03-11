import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./Clients.css";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Building, 
  User,
  Calendar,
  FileText,
  Download,
  Upload,
  RefreshCw,
  X,
  ChevronDown,
  MoreVertical,
  Eye,
  Star,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [bulkSelect, setBulkSelect] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    activeProjects: 0,
    totalRevenue: 0,
    averageProjects: 0
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    taxId: "",
    notes: "",
    status: "active",
    priority: "medium",
    tags: []
  });

  const [tagInput, setTagInput] = useState("");

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Real Estate",
    "Consulting",
    "Marketing",
    "Other"
  ];

  const statusOptions = ["active", "inactive", "lead", "archived"];
  const priorityColors = {
    high: "#ef4444",
    medium: "#facc15",
    low: "#22c55e"
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterAndSortClients();
  }, [clients, searchTerm, sortBy, industryFilter]);

  useEffect(() => {
    calculateStats();
  }, [clients]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/clients");
      setClients(res.data);
      setFilteredClients(res.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortClients = () => {
    let filtered = [...clients];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
      );
    }

    // Apply industry filter
    if (industryFilter !== "all") {
      filtered = filtered.filter(c => c.industry === industryFilter);
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
      case "company-asc":
        filtered.sort((a, b) => a.company?.localeCompare(b.company));
        break;
      default:
        break;
    }

    setFilteredClients(filtered);
  };

  const calculateStats = () => {
    const stats = {
      total: clients.length,
      activeProjects: clients.reduce((sum, c) => sum + (c.projectCount || 0), 0),
      totalRevenue: clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0),
      averageProjects: clients.length ? 
        (clients.reduce((sum, c) => sum + (c.projectCount || 0), 0) / clients.length).toFixed(1) : 0
    };
    setStats(stats);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        setForm(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      industry: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      taxId: "",
      notes: "",
      status: "active",
      priority: "medium",
      tags: []
    });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient._id}`, form);
      } else {
        await api.post("/clients", form);
      }
      
      resetForm();
      fetchClients();
    } catch (error) {
      console.error("Error saving client:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || "",
      industry: client.industry || "",
      website: client.website || "",
      address: client.address || "",
      city: client.city || "",
      state: client.state || "",
      country: client.country || "",
      zipCode: client.zipCode || "",
      taxId: client.taxId || "",
      notes: client.notes || "",
      status: client.status || "active",
      priority: client.priority || "medium",
      tags: client.tags || []
    });
    setShowForm(true);
  };

  const deleteClient = async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      setShowDeleteConfirm(null);
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const bulkDelete = async () => {
    try {
      await Promise.all(bulkSelect.map(id => api.delete(`/clients/${id}`)));
      setBulkSelect([]);
      setShowBulkActions(false);
      fetchClients();
    } catch (error) {
      console.error("Error bulk deleting clients:", error);
    }
  };

  const bulkStatusUpdate = async (status) => {
    try {
      await Promise.all(bulkSelect.map(id => 
        api.put(`/clients/${id}/status`, { status })
      ));
      setBulkSelect([]);
      setShowBulkActions(false);
      fetchClients();
    } catch (error) {
      console.error("Error bulk updating status:", error);
    }
  };

  const toggleSelectAll = () => {
    if (bulkSelect.length === filteredClients.length) {
      setBulkSelect([]);
    } else {
      setBulkSelect(filteredClients.map(c => c._id));
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
    const data = filteredClients.map(c => ({
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      Company: c.company,
      Industry: c.industry,
      Status: c.status,
      Priority: c.priority,
      Created: new Date(c.createdAt).toLocaleDateString(),
      Projects: c.projectCount || 0,
      Revenue: c.totalRevenue || 0
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clients.csv';
      a.click();
    }
  };

  const timeAgo = (date) => {
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
    
    return "just now";
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: "#22c55e", label: "Active" },
      inactive: { color: "#94a3b8", label: "Inactive" },
      lead: { color: "#3b82f6", label: "Lead" },
      archived: { color: "#ef4444", label: "Archived" }
    };
    return badges[status] || badges.active;
  };

  return (
    <div className="clients-container">
      {/* Header Section */}
      <div className="clients-header">
        <div className="header-left">
          <h1>
            <User size={28} />
            Client Management
          </h1>
          <p className="header-subtitle">Manage and track all your clients in one place</p>
        </div>

        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Plus size={18} />
            Add Client
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
            onClick={fetchClients}
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
            <h3>Total Clients</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon projects">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>Active Projects</h3>
            <div className="stat-value">{stats.activeProjects}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <Mail size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon average">
            <Building size={24} />
          </div>
          <div className="stat-content">
            <h3>Avg Projects/Client</h3>
            <div className="stat-value">{stats.averageProjects}</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search clients by name, email, company, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X size={16} onClick={() => setSearchTerm("")} className="clear-search" />
          )}
        </div>

        <div className="filter-group">
          <select 
            value={industryFilter} 
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
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
            <option value="company-asc">Company A-Z</option>
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
                    <CheckCircle size={16} /> Mark Active
                  </button>
                  <button onClick={() => bulkStatusUpdate("inactive")}>
                    <Clock size={16} /> Mark Inactive
                  </button>
                  <button onClick={() => bulkStatusUpdate("lead")}>
                    <Star size={16} /> Mark Lead
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

      {/* Add/Edit Client Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
              <button onClick={resetForm} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="client-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
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
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="client@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+1 234 567 890"
                    />
                  </div>

                  <div className="form-group">
                    <label>Company *</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      placeholder="Company name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Industry</label>
                    <select
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                    >
                      <option value="">Select Industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Website</label>
                    <input
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Address Information</h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Street Address</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Country"
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Additional Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tax ID / VAT Number</label>
                    <input
                      name="taxId"
                      value={form.taxId}
                      onChange={handleChange}
                      placeholder="Tax ID"
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="lead">Lead</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Tags</h3>
                <div className="tags-input">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type and press Enter to add tags"
                  />
                </div>
                <div className="tags-container">
                  {form.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <X size={14} onClick={() => handleRemoveTag(tag)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Notes</h3>
                <div className="form-group">
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Additional notes about the client..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingClient ? 'Update Client' : 'Add Client')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <div className="table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={bulkSelect.length === filteredClients.length && filteredClients.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Client</th>
              <th>Contact</th>
              <th>Company</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Projects</th>
              <th>Revenue</th>
              <th>Connected</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="loading-cell">
                  <div className="spinner"></div>
                  Loading clients...
                </td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">
                  <User size={48} />
                  <p>No clients found</p>
                  <button onClick={() => setShowForm(true)} className="btn-primary">
                    Add your first client
                  </button>
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => {
                const statusBadge = getStatusBadge(client.status);
                return (
                  <tr key={client._id} className={bulkSelect.includes(client._id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={bulkSelect.includes(client._id)}
                        onChange={() => toggleSelect(client._id)}
                      />
                    </td>

                    <td>
                      <div className="client-info">
                        <div className="client-avatar">
                          {client.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{client.name}</strong>
                          {client.industry && (
                            <span className="client-industry">{client.industry}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-info">
                        <div className="contact-item">
                          <Mail size={14} />
                          <span>{client.email}</span>
                        </div>
                        <div className="contact-item">
                          <Phone size={14} />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="company-info">
                        <Building size={14} />
                        <span>{client.company}</span>
                      </div>
                    </td>

                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: `${statusBadge.color}20`,
                          color: statusBadge.color
                        }}
                      >
                        {statusBadge.label}
                      </span>
                    </td>

                    <td>
                      <span 
                        className="priority-badge"
                        style={{ 
                          backgroundColor: `${priorityColors[client.priority]}20`,
                          color: priorityColors[client.priority]
                        }}
                      >
                        {client.priority}
                      </span>
                    </td>

                    <td>
                      <span className="project-count">{client.projectCount || 0}</span>
                    </td>

                    <td>
                      <span className="revenue-amount">
                        ₹{(client.totalRevenue || 0).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <div className="time-info">
                        <Clock size={14} />
                        <span>{timeAgo(client.createdAt)}</span>
                      </div>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setShowDetails(true);
                          }}
                          className="action-btn view"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleEdit(client)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => setShowDeleteConfirm(client._id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {showDeleteConfirm === client._id && (
                        <div className="delete-confirm">
                          <p>Delete this client?</p>
                          <div className="confirm-actions">
                            <button onClick={() => deleteClient(client._id)}>Yes</button>
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

      {/* Client Details Modal */}
      {showDetails && selectedClient && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Client Details</h2>
              <button onClick={() => setShowDetails(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="details-container">
              <div className="details-header">
                <div className="client-avatar large">
                  {selectedClient.name?.charAt(0).toUpperCase()}
                </div>
                <div className="client-title">
                  <h3>{selectedClient.name}</h3>
                  <p>{selectedClient.company}</p>
                </div>
                <div className="client-badges">
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${getStatusBadge(selectedClient.status).color}20`,
                      color: getStatusBadge(selectedClient.status).color
                    }}
                  >
                    {getStatusBadge(selectedClient.status).label}
                  </span>
                  <span 
                    className="priority-badge"
                    style={{ 
                      backgroundColor: `${priorityColors[selectedClient.priority]}20`,
                      color: priorityColors[selectedClient.priority]
                    }}
                  >
                    {selectedClient.priority} priority
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
                      <p>{selectedClient.email}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Phone size={16} />
                    <div>
                      <label>Phone</label>
                      <p>{selectedClient.phone}</p>
                    </div>
                  </div>
                  {selectedClient.website && (
                    <div className="detail-item">
                      <Globe size={16} />
                      <div>
                        <label>Website</label>
                        <p>{selectedClient.website}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <h4>Address</h4>
                  {selectedClient.address ? (
                    <>
                      <p>{selectedClient.address}</p>
                      <p>
                        {selectedClient.city && `${selectedClient.city}, `}
                        {selectedClient.state && `${selectedClient.state} `}
                        {selectedClient.zipCode}
                      </p>
                      {selectedClient.country && <p>{selectedClient.country}</p>}
                    </>
                  ) : (
                    <p className="no-data">No address provided</p>
                  )}
                </div>

                <div className="details-section">
                  <h4>Business Information</h4>
                  <div className="detail-item">
                    <Building size={16} />
                    <div>
                      <label>Industry</label>
                      <p>{selectedClient.industry || 'Not specified'}</p>
                    </div>
                  </div>
                  {selectedClient.taxId && (
                    <div className="detail-item">
                      <FileText size={16} />
                      <div>
                        <label>Tax ID</label>
                        <p>{selectedClient.taxId}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <h4>Statistics</h4>
                  <div className="stats-mini">
                    <div className="stat-mini-item">
                      <FileText size={16} />
                      <div>
                        <label>Total Projects</label>
                        <strong>{selectedClient.projectCount || 0}</strong>
                      </div>
                    </div>
                    <div className="stat-mini-item">
                      <Mail size={16} />
                      <div>
                        <label>Total Revenue</label>
                        <strong>₹{(selectedClient.totalRevenue || 0).toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="stat-mini-item">
                      <Calendar size={16} />
                      <div>
                        <label>Client Since</label>
                        <strong>{new Date(selectedClient.createdAt).toLocaleDateString()}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedClient.tags && selectedClient.tags.length > 0 && (
                  <div className="details-section full-width">
                    <h4>Tags</h4>
                    <div className="tags-container">
                      {selectedClient.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedClient.notes && (
                  <div className="details-section full-width">
                    <h4>Notes</h4>
                    <p className="notes-text">{selectedClient.notes}</p>
                  </div>
                )}
              </div>

              <div className="details-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowDetails(false);
                    handleEdit(selectedClient);
                  }}
                >
                  <Edit size={16} /> Edit Client
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    // Send email functionality
                    window.location.href = `mailto:${selectedClient.email}`;
                  }}
                >
                  <Mail size={16} /> Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;