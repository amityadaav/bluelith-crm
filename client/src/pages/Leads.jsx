import React, { useState, useEffect } from 'react';
import './Leads.css';
import api from '../services/api';
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
  RefreshCw,
  X,
  ChevronDown,
  MoreVertical,
  Eye,
  Star,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Send,
  Archive,
  Copy,
  UserPlus
} from 'lucide-react';

function Leads() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [bulkSelect, setBulkSelect] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activityText, setActivityText] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0,
    conversionRate: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    industry: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    status: 'new',
    priority: 'medium',
    source: 'website',
    estimatedValue: '',
    notes: '',
    tags: [],
    assignedTo: '',
    lastContacted: '',
    nextFollowUp: ''
  });

  const [tagInput, setTagInput] = useState('');

  const statusOptions = [
    { value: 'new', label: 'New', color: '#3b82f6' },
    { value: 'contacted', label: 'Contacted', color: '#f59e0b' },
    { value: 'qualified', label: 'Qualified', color: '#22c55e' },
    { value: 'proposal', label: 'Proposal', color: '#a855f7' },
    { value: 'negotiation', label: 'Negotiation', color: '#ec4899' },
    { value: 'won', label: 'Won', color: '#22c55e' },
    { value: 'lost', label: 'Lost', color: '#ef4444' }
  ];

  const sourceOptions = [
    'website', 'referral', 'linkedin', 'email', 'call', 'event', 'ad', 'other'
  ];

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e'
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterAndSortLeads();
  }, [leads, searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    calculateStats();
  }, [leads]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortLeads = () => {
    let filtered = [...leads];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'value-high':
        filtered.sort((a, b) => (b.estimatedValue || 0) - (a.estimatedValue || 0));
        break;
      case 'value-low':
        filtered.sort((a, b) => (a.estimatedValue || 0) - (b.estimatedValue || 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name?.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredLeads(filtered);
  };

  const calculateStats = () => {
    const stats = {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      lost: leads.filter(l => l.status === 'lost').length,
      conversionRate: leads.length ? 
        ((leads.filter(l => l.status === 'won').length / leads.length) * 100).toFixed(1) : 0
    };
    setStats(stats);
  };

  const handleOpen = (lead = null) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        position: lead.position || '',
        industry: lead.industry || '',
        website: lead.website || '',
        address: lead.address || '',
        city: lead.city || '',
        state: lead.state || '',
        country: lead.country || '',
        zipCode: lead.zipCode || '',
        status: lead.status || 'new',
        priority: lead.priority || 'medium',
        source: lead.source || 'website',
        estimatedValue: lead.estimatedValue || '',
        notes: lead.notes || '',
        tags: lead.tags || [],
        assignedTo: lead.assignedTo || '',
        lastContacted: lead.lastContacted ? lead.lastContacted.split('T')[0] : '',
        nextFollowUp: lead.nextFollowUp ? lead.nextFollowUp.split('T')[0] : ''
      });
    } else {
      setEditingLead(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        industry: '',
        website: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        status: 'new',
        priority: 'medium',
        source: 'website',
        estimatedValue: '',
        notes: '',
        tags: [],
        assignedTo: '',
        lastContacted: '',
        nextFollowUp: ''
      });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingLead(null);
    setTagInput('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingLead) {
        await api.put(`/leads/${editingLead._id}`, formData);
      } else {
        await api.post('/leads', formData);
      }
      fetchLeads();
      handleClose();
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      setShowDeleteConfirm(null);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const bulkDelete = async () => {
    try {
      await Promise.all(bulkSelect.map(id => api.delete(`/leads/${id}`)));
      setBulkSelect([]);
      setShowBulkActions(false);
      fetchLeads();
    } catch (error) {
      console.error('Error bulk deleting leads:', error);
    }
  };

  const bulkStatusUpdate = async (status) => {
    try {
      await Promise.all(bulkSelect.map(id => 
        api.put(`/leads/${id}/status`, { status })
      ));
      setBulkSelect([]);
      setShowBulkActions(false);
      fetchLeads();
    } catch (error) {
      console.error('Error bulk updating status:', error);
    }
  };

  const addActivity = async (leadId) => {
    if (!activityText.trim()) return;

    try {
      await api.post(`/leads/${leadId}/activity`, {
        text: activityText,
        type: 'note',
        createdAt: new Date().toISOString()
      });
      setActivityText('');
      setShowActivityLog(false);
      fetchLeads();
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const toggleSelectAll = () => {
    if (bulkSelect.length === filteredLeads.length) {
      setBulkSelect([]);
    } else {
      setBulkSelect(filteredLeads.map(l => l._id));
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
    const data = filteredLeads.map(l => ({
      Name: l.name,
      Email: l.email,
      Phone: l.phone,
      Company: l.company,
      Position: l.position,
      Status: l.status,
      Priority: l.priority,
      Source: l.source,
      'Estimated Value': l.estimatedValue,
      Created: new Date(l.createdAt).toLocaleDateString()
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      a.click();
    }
  };

  const handleCopyLead = (lead) => {
    setFormData({
      ...lead,
      name: `${lead.name} (Copy)`,
      _id: undefined
    });
    setEditingLead(null);
    setShowModal(true);
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
    
    return 'just now';
  };

  const getStatusBadge = (status) => {
    const option = statusOptions.find(s => s.value === status);
    return option || statusOptions[0];
  };

  return (
    <div className="leads-container">
      {/* Header Section */}
      <div className="leads-header">
        <div className="header-left">
          <h1>
            <Target size={28} />
            Lead Management
          </h1>
          <p className="header-subtitle">Track and manage your sales pipeline</p>
        </div>

        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => handleOpen()}
          >
            <Plus size={18} />
            Add Lead
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
            onClick={fetchLeads}
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
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Leads</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon new">
            <UserPlus size={24} />
          </div>
          <div className="stat-content">
            <h3>New</h3>
            <div className="stat-value">{stats.new}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon contacted">
            <Mail size={24} />
          </div>
          <div className="stat-content">
            <h3>Contacted</h3>
            <div className="stat-value">{stats.contacted}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon qualified">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Qualified</h3>
            <div className="stat-value">{stats.qualified}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon conversion">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Conversion Rate</h3>
            <div className="stat-value">{stats.conversionRate}%</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search leads by name, email, company, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X size={16} onClick={() => setSearchTerm('')} className="clear-search" />
          )}
        </div>

        <div className="filter-group">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="value-high">Value: High to Low</option>
            <option value="value-low">Value: Low to High</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>

          {bulkSelect.length > 0 && (
            <div className="bulk-actions">
              <span>{bulkSelect.length} selected</span>
              <button onClick={() => setShowBulkActions(!showBulkActions)}>
                <ChevronDown size={16} />
              </button>
              {showBulkActions && (
                <div className="bulk-dropdown">
                  <button onClick={() => bulkStatusUpdate('new')}>
                    <UserPlus size={16} /> Mark New
                  </button>
                  <button onClick={() => bulkStatusUpdate('contacted')}>
                    <Mail size={16} /> Mark Contacted
                  </button>
                  <button onClick={() => bulkStatusUpdate('qualified')}>
                    <CheckCircle size={16} /> Mark Qualified
                  </button>
                  <button onClick={() => bulkStatusUpdate('won')}>
                    <TrendingUp size={16} /> Mark Won
                  </button>
                  <button onClick={() => bulkStatusUpdate('lost')}>
                    <AlertCircle size={16} /> Mark Lost
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

      {/* Leads Table */}
      <div className="table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={bulkSelect.length === filteredLeads.length && filteredLeads.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Lead</th>
              <th>Contact</th>
              <th>Company</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Value</th>
              <th>Source</th>
              <th>Last Contact</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="loading-cell">
                  <div className="spinner"></div>
                  Loading leads...
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">
                  <Target size={48} />
                  <p>No leads found</p>
                  <button onClick={() => handleOpen()} className="btn-primary">
                    Add your first lead
                  </button>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const statusBadge = getStatusBadge(lead.status);
                return (
                  <tr key={lead._id} className={bulkSelect.includes(lead._id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={bulkSelect.includes(lead._id)}
                        onChange={() => toggleSelect(lead._id)}
                      />
                    </td>

                    <td>
                      <div className="lead-info">
                        <div className="lead-avatar">
                          {lead.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{lead.name}</strong>
                          {lead.position && (
                            <span className="lead-position">{lead.position}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-info">
                        <div className="contact-item">
                          <Mail size={14} />
                          <span>{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="contact-item">
                            <Phone size={14} />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="company-info">
                        <Building size={14} />
                        <span>{lead.company || 'N/A'}</span>
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
                          backgroundColor: `${priorityColors[lead.priority]}20`,
                          color: priorityColors[lead.priority]
                        }}
                      >
                        {lead.priority}
                      </span>
                    </td>

                    <td>
                      <span className="value-amount">
                        ${lead.estimatedValue?.toLocaleString() || '0'}
                      </span>
                    </td>

                    <td>
                      <span className="source-badge">
                        {lead.source}
                      </span>
                    </td>

                    <td>
                      <div className="time-info">
                        <Clock size={14} />
                        <span>{lead.lastContacted ? timeAgo(lead.lastContacted) : 'Never'}</span>
                      </div>
                      {lead.nextFollowUp && (
                        <div className="follow-up">
                          <Calendar size={14} />
                          <span>{new Date(lead.nextFollowUp).toLocaleDateString()}</span>
                        </div>
                      )}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowDetails(true);
                          }}
                          className="action-btn view"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleOpen(lead)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleCopyLead(lead)}
                          className="action-btn copy"
                          title="Copy"
                        >
                          <Copy size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowActivityLog(true);
                          }}
                          className="action-btn activity"
                          title="Add Activity"
                        >
                          <MessageCircle size={16} />
                        </button>

                        <button
                          onClick={() => setShowDeleteConfirm(lead._id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {showDeleteConfirm === lead._id && (
                        <div className="delete-confirm">
                          <p>Delete this lead?</p>
                          <div className="confirm-actions">
                            <button onClick={() => handleDelete(lead._id)}>Yes</button>
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

      {/* Add/Edit Lead Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
              <button onClick={handleClose} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="lead-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
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
                      placeholder="lead@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 890"
                    />
                  </div>

                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Job title"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Company Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder="Industry"
                    />
                  </div>

                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
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
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Lead Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Source</label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                    >
                      {sourceOptions.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Estimated Value ($)</label>
                    <input
                      type="number"
                      name="estimatedValue"
                      value={formData.estimatedValue}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Contacted</label>
                    <input
                      type="date"
                      name="lastContacted"
                      value={formData.lastContacted}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Next Follow-up</label>
                    <input
                      type="date"
                      name="nextFollowUp"
                      value={formData.nextFollowUp}
                      onChange={handleChange}
                    />
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
                  {formData.tags.map((tag, index) => (
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
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Additional notes about the lead..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleClose} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingLead ? 'Update Lead' : 'Add Lead')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Details Modal */}
      {showDetails && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Lead Details</h2>
              <button onClick={() => setShowDetails(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="details-container">
              <div className="details-header">
                <div className="lead-avatar large">
                  {selectedLead.name?.charAt(0).toUpperCase()}
                </div>
                <div className="lead-title">
                  <h3>{selectedLead.name}</h3>
                  <p>{selectedLead.position} at {selectedLead.company}</p>
                </div>
                <div className="lead-badges">
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${getStatusBadge(selectedLead.status).color}20`,
                      color: getStatusBadge(selectedLead.status).color
                    }}
                  >
                    {getStatusBadge(selectedLead.status).label}
                  </span>
                  <span 
                    className="priority-badge"
                    style={{ 
                      backgroundColor: `${priorityColors[selectedLead.priority]}20`,
                      color: priorityColors[selectedLead.priority]
                    }}
                  >
                    {selectedLead.priority} priority
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
                      <p>{selectedLead.email}</p>
                    </div>
                  </div>
                  {selectedLead.phone && (
                    <div className="detail-item">
                      <Phone size={16} />
                      <div>
                        <label>Phone</label>
                        <p>{selectedLead.phone}</p>
                      </div>
                    </div>
                  )}
                  {selectedLead.website && (
                    <div className="detail-item">
                      <Globe size={16} />
                      <div>
                        <label>Website</label>
                        <p>{selectedLead.website}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="details-section">
                  <h4>Company Information</h4>
                  <div className="detail-item">
                    <Building size={16} />
                    <div>
                      <label>Company</label>
                      <p>{selectedLead.company || 'N/A'}</p>
                    </div>
                  </div>
                  {selectedLead.industry && (
                    <div className="detail-item">
                      <FileText size={16} />
                      <div>
                        <label>Industry</label>
                        <p>{selectedLead.industry}</p>
                      </div>
                    </div>
                  )}
                  <div className="detail-item">
                    <Target size={16} />
                    <div>
                      <label>Source</label>
                      <p>{selectedLead.source}</p>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h4>Lead Value</h4>
                  <div className="value-display">
                    <DollarSign size={24} />
                    <span>${selectedLead.estimatedValue?.toLocaleString() || '0'}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h4>Timeline</h4>
                  <div className="timeline-item">
                    <Calendar size={16} />
                    <div>
                      <label>Created</label>
                      <p>{new Date(selectedLead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {selectedLead.lastContacted && (
                    <div className="timeline-item">
                      <Clock size={16} />
                      <div>
                        <label>Last Contacted</label>
                        <p>{new Date(selectedLead.lastContacted).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  {selectedLead.nextFollowUp && (
                    <div className="timeline-item">
                      <Calendar size={16} />
                      <div>
                        <label>Next Follow-up</label>
                        <p>{new Date(selectedLead.nextFollowUp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedLead.address && (
                  <div className="details-section full-width">
                    <h4>Address</h4>
                    <p>
                      {selectedLead.address}<br />
                      {selectedLead.city && `${selectedLead.city}, `}
                      {selectedLead.state && `${selectedLead.state} `}
                      {selectedLead.zipCode}<br />
                      {selectedLead.country}
                    </p>
                  </div>
                )}

                {selectedLead.tags && selectedLead.tags.length > 0 && (
                  <div className="details-section full-width">
                    <h4>Tags</h4>
                    <div className="tags-container">
                      {selectedLead.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLead.notes && (
                  <div className="details-section full-width">
                    <h4>Notes</h4>
                    <p className="notes-text">{selectedLead.notes}</p>
                  </div>
                )}

                {selectedLead.activities && selectedLead.activities.length > 0 && (
                  <div className="details-section full-width">
                    <h4>Activity Log</h4>
                    <div className="activity-log">
                      {selectedLead.activities.map((activity, index) => (
                        <div key={index} className="activity-item">
                          <MessageCircle size={14} />
                          <div>
                            <p>{activity.text}</p>
                            <span>{new Date(activity.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="details-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowDetails(false);
                    handleOpen(selectedLead);
                  }}
                >
                  <Edit size={16} /> Edit Lead
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    window.location.href = `mailto:${selectedLead.email}`;
                  }}
                >
                  <Mail size={16} /> Send Email
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedLead(selectedLead);
                    setShowActivityLog(true);
                  }}
                >
                  <MessageCircle size={16} /> Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivityLog && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowActivityLog(false)}>
          <div className="modal-content activity-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Activity - {selectedLead.name}</h2>
              <button onClick={() => setShowActivityLog(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="activity-container">
              <div className="activities-list">
                <h3>Recent Activities</h3>
                {selectedLead.activities?.length === 0 ? (
                  <div className="no-activities">
                    <MessageCircle size={48} />
                    <p>No activities yet</p>
                  </div>
                ) : (
                  selectedLead.activities?.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        {activity.type === 'note' && <FileText size={16} />}
                        {activity.type === 'call' && <Phone size={16} />}
                        {activity.type === 'email' && <Mail size={16} />}
                        {activity.type === 'meeting' && <Users size={16} />}
                      </div>
                      <div className="activity-content">
                        <p>{activity.text}</p>
                        <span>{new Date(activity.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="add-activity">
                <h3>Add New Activity</h3>
                <textarea
                  value={activityText}
                  onChange={(e) => setActivityText(e.target.value)}
                  placeholder="Write a note, log a call, record a meeting..."
                  rows="4"
                />
                <div className="activity-type">
                  <button className="type-btn active">Note</button>
                  <button className="type-btn">Call</button>
                  <button className="type-btn">Email</button>
                  <button className="type-btn">Meeting</button>
                </div>
                <button 
                  onClick={() => addActivity(selectedLead._id)}
                  className="btn-primary"
                  disabled={!activityText.trim()}
                >
                  <Send size={16} /> Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leads;