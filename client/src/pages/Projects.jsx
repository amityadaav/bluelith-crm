// import {useEffect,useState} from "react";
// import "./Projects.css";
// import API from "../services/api";

// const Projects = () => {

//   const [projects,setProjects] = useState([]);

//   const [form,setForm] = useState({
//     name:"",
//     client:"",
//     assignedDeveloper:"",
//     totalBudget:"",
//     paid:"",
//     deadline:""
//   });

//   const fetchProjects = async()=>{
//     const res = await API.get("/projects");
//     setProjects(res.data);
//   };

//   useEffect(()=>{
//     fetchProjects();
//   },[]);

//   const handleChange = (e)=>{
//     setForm({...form,[e.target.name]:e.target.value});
//   };

//   const addProject = async(e)=>{
//     e.preventDefault();

//     await API.post("/projects",form);

//     setForm({
//       name:"",
//       client:"",
//       assignedDeveloper:"",
//       totalBudget:"",
//       paid:"",
//       deadline:""
//     });

//     fetchProjects();
//   };

//   const updateStatus = async(id,status)=>{
//     await API.put(`/projects/${id}/status`,{status});
//     fetchProjects();
//   };

//   const deleteProject = async(id)=>{
//     await API.delete(`/projects/${id}`);
//     fetchProjects();
//   };

//   const addComment = async(id)=>{
//     const text = prompt("Enter comment");

//     if(!text) return;

//     await API.post(`/projects/${id}/comment`,{text});

//     fetchProjects();
//   };

//   return (

//     <div className="p-6">

//       <h2 className="text-2xl font-bold mb-6">
//         Projects
//       </h2>

//       {/* Create Project */}

//       <form
//         onSubmit={addProject}
//         className="grid grid-cols-6 gap-3 mb-6"
//       >

//         <input
//           name="name"
//           placeholder="Project Name"
//           value={form.name}
//           onChange={handleChange}
//           className="border p-2"
//         />

//         <input
//           name="client"
//           placeholder="Client"
//           value={form.client}
//           onChange={handleChange}
//           className="border p-2"
//         />

//         <input
//           name="assignedDeveloper"
//           placeholder="Developer"
//           value={form.assignedDeveloper}
//           onChange={handleChange}
//           className="border p-2"
//         />

//         <input
//           type="number"
//           name="totalBudget"
//           placeholder="Total Budget"
//           value={form.totalBudget}
//           onChange={handleChange}
//           className="border p-2"
//         />

//         <input
//           type="number"
//           name="paid"
//           placeholder="Paid"
//           value={form.paid}
//           onChange={handleChange}
//           className="border p-2"
//         />

//         <input
//           type="date"
//           name="deadline"
//           value={form.deadline}
//           onChange={handleChange}
//           className="border p-2"
//         />

//         <button className="bg-blue-500 text-white p-2 col-span-6">
//           Add Project
//         </button>

//       </form>

//       {/* Projects Table */}

//       <table className="w-full border">

//         <thead className="bg-gray-100">

//           <tr>

//             <th>Project</th>
//             <th>Client</th>
//             <th>Developer</th>
//             <th>Total</th>
//             <th>Paid</th>
//             <th>Remaining</th>
//             <th>Status</th>
//             <th>Comments</th>
//             <th>Action</th>

//           </tr>

//         </thead>

//         <tbody>

//           {projects.map(p => (

//             <tr key={p._id} className="text-center border-t">

//               <td>{p.name}</td>

//               <td>{p.client}</td>

//               <td>{p.assignedDeveloper}</td>

//               <td>₹{p.totalBudget}</td>

//               <td>₹{p.paid}</td>

//               <td>₹{p.remaining}</td>

//               <td>

//                 <select
//                   value={p.status}
//                   onChange={(e)=>
//                     updateStatus(p._id,e.target.value)
//                   }
//                 >

//                   <option>Pending</option>
//                   <option>In Progress</option>
//                   <option>Completed</option>

//                 </select>

//               </td>

//               <td>

//                 <button
//                   onClick={()=>addComment(p._id)}
//                   className="bg-green-500 text-white px-2 py-1"
//                 >
//                   Comment
//                 </button>

//                 <div className="text-xs">

//                   {p.comments?.map((c,i)=>(
//                     <p key={i}>{c.text}</p>
//                   ))}

//                 </div>

//               </td>

//               <td>

//                 <button
//                   onClick={()=>deleteProject(p._id)}
//                   className="bg-red-500 text-white px-3 py-1"
//                 >
//                   Delete
//                 </button>

//               </td>

//             </tr>

//           ))}

//         </tbody>

//       </table>

//     </div>
//   );
// };

// export default Projects;
import { useEffect, useState } from "react";
import "./Projects.css";
import API from "../services/api";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Upload,
  Calendar,
  Users,
  DollarSign,
  FileText,
  MoreVertical,
  Eye,
  Archive,
  Copy,
  RefreshCw,
  ChevronDown,
  X
} from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [bulkSelect, setBulkSelect] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    totalBudget: 0,
    totalPaid: 0
  });

  const [form, setForm] = useState({
    name: "",
    client: "",
    clientEmail: "",
    clientPhone: "",
    assignedDeveloper: "",
    assignedDeveloperEmail: "",
    totalBudget: "",
    paid: "",
    deadline: "",
    description: "",
    priority: "medium",
    category: "",
    tags: []
  });

  const [tagInput, setTagInput] = useState("");

  const statusOptions = ["Pending", "In Progress", "Completed", "On Hold", "Cancelled"];
  const priorityColors = {
    high: "#ef4444",
    medium: "#facc15",
    low: "#22c55e"
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    calculateStats();
  }, [projects]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
      setFilteredProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.assignedDeveloper?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "deadline":
        filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case "budget-high":
        filtered.sort((a, b) => b.totalBudget - a.totalBudget);
        break;
      case "budget-low":
        filtered.sort((a, b) => a.totalBudget - b.totalBudget);
        break;
      default:
        break;
    }

    setFilteredProjects(filtered);
  };

  const calculateStats = () => {
    const stats = {
      total: projects.length,
      completed: projects.filter(p => p.status === "Completed").length,
      inProgress: projects.filter(p => p.status === "In Progress").length,
      pending: projects.filter(p => p.status === "Pending").length,
      totalBudget: projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0),
      totalPaid: projects.reduce((sum, p) => sum + (p.paid || 0), 0)
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
      client: "",
      clientEmail: "",
      clientPhone: "",
      assignedDeveloper: "",
      assignedDeveloperEmail: "",
      totalBudget: "",
      paid: "",
      deadline: "",
      description: "",
      priority: "medium",
      category: "",
      tags: []
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProject) {
        await API.put(`/projects/${editingProject._id}`, form);
      } else {
        await API.post("/projects", form);
      }
      
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name || "",
      client: project.client || "",
      clientEmail: project.clientEmail || "",
      clientPhone: project.clientPhone || "",
      assignedDeveloper: project.assignedDeveloper || "",
      assignedDeveloperEmail: project.assignedDeveloperEmail || "",
      totalBudget: project.totalBudget || "",
      paid: project.paid || "",
      deadline: project.deadline ? project.deadline.split("T")[0] : "",
      description: project.description || "",
      priority: project.priority || "medium",
      category: project.category || "",
      tags: project.tags || []
    });
    setShowForm(true);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/projects/${id}/status`, { status });
      fetchProjects();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      setShowDeleteConfirm(null);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const bulkDelete = async () => {
    try {
      await Promise.all(bulkSelect.map(id => API.delete(`/projects/${id}`)));
      setBulkSelect([]);
      setShowBulkActions(false);
      fetchProjects();
    } catch (error) {
      console.error("Error bulk deleting projects:", error);
    }
  };

  const bulkStatusUpdate = async (status) => {
    try {
      await Promise.all(bulkSelect.map(id => 
        API.put(`/projects/${id}/status`, { status })
      ));
      setBulkSelect([]);
      setShowBulkActions(false);
      fetchProjects();
    } catch (error) {
      console.error("Error bulk updating status:", error);
    }
  };

  const addComment = async (id) => {
    if (!commentText.trim()) return;

    try {
      await API.post(`/projects/${id}/comment`, { 
        text: commentText,
        createdAt: new Date().toISOString()
      });
      setCommentText("");
      fetchProjects();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (projectId, commentId) => {
    try {
      await API.delete(`/projects/${projectId}/comments/${commentId}`);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleExport = (format) => {
    const data = filteredProjects.map(p => ({
      Name: p.name,
      Client: p.client,
      Developer: p.assignedDeveloper,
      Status: p.status,
      Priority: p.priority,
      Budget: p.totalBudget,
      Paid: p.paid,
      Remaining: p.totalBudget - p.paid,
      Deadline: new Date(p.deadline).toLocaleDateString()
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'projects.csv';
      a.click();
    }
  };

  const handleCopyProject = (project) => {
    setForm({
      ...project,
      name: `${project.name} (Copy)`,
      _id: undefined
    });
    setShowForm(true);
  };

  const toggleSelectAll = () => {
    if (bulkSelect.length === filteredProjects.length) {
      setBulkSelect([]);
    } else {
      setBulkSelect(filteredProjects.map(p => p._id));
    }
  };

  const toggleSelect = (id) => {
    if (bulkSelect.includes(id)) {
      setBulkSelect(bulkSelect.filter(selectedId => selectedId !== id));
    } else {
      setBulkSelect([...bulkSelect, id]);
    }
  };

  const getRemainingDays = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    return `${diffDays} days left`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "#22c55e";
      case "In Progress": return "#3b82f6";
      case "Pending": return "#facc15";
      case "On Hold": return "#a855f7";
      case "Cancelled": return "#ef4444";
      default: return "#94a3b8";
    }
  };

  return (
    <div className="projects-container">
      {/* Header Section */}
      <div className="projects-header">
        <div className="header-left">
          <h1>
            <FileText size={28} />
            Project Management
          </h1>
          <p className="header-subtitle">Manage and track all your projects in one place</p>
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
            New Project
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
            onClick={fetchProjects}
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
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Projects</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Completed</h3>
            <div className="stat-value">{stats.completed}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <div className="stat-value">{stats.inProgress}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <div className="stat-value">{stats.pending}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon budget">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Budget</h3>
            <div className="stat-value">₹{stats.totalBudget.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon paid">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Paid</h3>
            <div className="stat-value">₹{stats.totalPaid.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search projects, clients, developers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X size={16} onClick={() => setSearchTerm("")} className="clear-search" />
          )}
        </div>

        <div className="filter-group">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="deadline">Deadline</option>
            <option value="budget-high">Budget: High to Low</option>
            <option value="budget-low">Budget: Low to High</option>
          </select>

          {bulkSelect.length > 0 && (
            <div className="bulk-actions">
              <span>{bulkSelect.length} selected</span>
              <button onClick={() => setShowBulkActions(!showBulkActions)}>
                <ChevronDown size={16} />
              </button>
              {showBulkActions && (
                <div className="bulk-dropdown">
                  <button onClick={() => bulkStatusUpdate("Completed")}>
                    <CheckCircle size={16} /> Mark Completed
                  </button>
                  <button onClick={() => bulkStatusUpdate("In Progress")}>
                    <Clock size={16} /> Mark In Progress
                  </button>
                  <button onClick={() => bulkStatusUpdate("Pending")}>
                    <AlertCircle size={16} /> Mark Pending
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

      {/* Project Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
              <button onClick={resetForm} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Project Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter project name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="e.g., Web Development, Design"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Project description..."
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Client Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Client Name *</label>
                    <input
                      name="client"
                      value={form.client}
                      onChange={handleChange}
                      required
                      placeholder="Enter client name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Client Email</label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={form.clientEmail}
                      onChange={handleChange}
                      placeholder="client@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Client Phone</label>
                    <input
                      name="clientPhone"
                      value={form.clientPhone}
                      onChange={handleChange}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Developer Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Assigned Developer *</label>
                    <input
                      name="assignedDeveloper"
                      value={form.assignedDeveloper}
                      onChange={handleChange}
                      required
                      placeholder="Developer name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Developer Email</label>
                    <input
                      type="email"
                      name="assignedDeveloperEmail"
                      value={form.assignedDeveloperEmail}
                      onChange={handleChange}
                      placeholder="developer@email.com"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Budget & Timeline</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Total Budget (₹) *</label>
                    <input
                      type="number"
                      name="totalBudget"
                      value={form.totalBudget}
                      onChange={handleChange}
                      required
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Paid Amount (₹)</label>
                    <input
                      type="number"
                      name="paid"
                      value={form.paid}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Deadline *</label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      required
                    />
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

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={bulkSelect.length === filteredProjects.length && filteredProjects.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Project</th>
              <th>Client</th>
              <th>Developer</th>
              <th>Budget</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="loading-cell">
                  <div className="spinner"></div>
                  Loading projects...
                </td>
              </tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="11" className="no-data">
                  <FileText size={48} />
                  <p>No projects found</p>
                  <button onClick={() => setShowForm(true)} className="btn-primary">
                    Create your first project
                  </button>
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project._id} className={bulkSelect.includes(project._id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={bulkSelect.includes(project._id)}
                      onChange={() => toggleSelect(project._id)}
                    />
                  </td>

                  <td>
                    <div className="project-info">
                      <strong>{project.name}</strong>
                      {project.category && (
                        <span className="project-category">{project.category}</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="client-info">
                      <span className="client-name">{project.client}</span>
                      {project.clientEmail && (
                        <span className="client-email">{project.clientEmail}</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="developer-info">
                      <span className="dev-name">{project.assignedDeveloper}</span>
                    </div>
                  </td>

                  <td className="budget-col">
                    <span className="total-budget">₹{project.totalBudget?.toLocaleString()}</span>
                  </td>

                  <td>
                    <div className="payment-info">
                      <span className="paid-amount">₹{project.paid?.toLocaleString()}</span>
                      <span className="remaining-amount">
                        Remaining: ₹{(project.totalBudget - project.paid).toLocaleString()}
                      </span>
                      <div className="payment-progress">
                        <div 
                          className="progress-bar"
                          style={{ 
                            width: `${(project.paid / project.totalBudget * 100) || 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <select
                      className="status-select"
                      value={project.status}
                      onChange={(e) => updateStatus(project._id, e.target.value)}
                      style={{ backgroundColor: `${getStatusColor(project.status)}20` }}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <span 
                      className="priority-badge"
                      style={{ 
                        backgroundColor: `${priorityColors[project.priority]}20`,
                        color: priorityColors[project.priority]
                      }}
                    >
                      {project.priority}
                    </span>
                  </td>

                  <td>
                    <div className="deadline-info">
                      <span className="deadline-date">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                      <span className={`deadline-status ${
                        getRemainingDays(project.deadline) === "Overdue" ? 'overdue' : ''
                      }`}>
                        {getRemainingDays(project.deadline)}
                      </span>
                    </div>
                  </td>

                  <td>
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setShowComments(true);
                      }}
                      className="comments-toggle"
                    >
                      <MessageCircle size={16} />
                      <span>{project.comments?.length || 0}</span>
                    </button>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(project)}
                        className="action-btn edit"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleCopyProject(project)}
                        className="action-btn copy"
                        title="Copy"
                      >
                        <Copy size={16} />
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirm(project._id)}
                        className="action-btn delete"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {showDeleteConfirm === project._id && (
                      <div className="delete-confirm">
                        <p>Delete this project?</p>
                        <div className="confirm-actions">
                          <button onClick={() => deleteProject(project._id)}>Yes</button>
                          <button onClick={() => setShowDeleteConfirm(null)}>No</button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Comments Modal */}
      {showComments && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowComments(false)}>
          <div className="modal-content comments-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Comments - {selectedProject.name}</h2>
              <button onClick={() => setShowComments(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="comments-container">
              <div className="comments-list">
                {selectedProject.comments?.length === 0 ? (
                  <div className="no-comments">
                    <MessageCircle size={48} />
                    <p>No comments yet</p>
                  </div>
                ) : (
                  selectedProject.comments?.map((comment, index) => (
                    <div key={index} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author || 'User'}</span>
                        <span className="comment-time">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      <button
                        onClick={() => deleteComment(selectedProject._id, comment._id)}
                        className="delete-comment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="add-comment">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows="3"
                />
                <button 
                  onClick={() => {
                    addComment(selectedProject._id);
                  }}
                  className="btn-primary"
                  disabled={!commentText.trim()}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;