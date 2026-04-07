import React from "react";
import {
  UserPlus, Users, FolderOpen, DollarSign,
  LogIn, FileText, TrendingUp, TrendingDown
} from "lucide-react";

const TYPE_CONFIG = {
  lead_created:      { icon: <UserPlus  size={15} />, color: "#4f6ef7", bg: "#eff6ff", label: "New Lead" },
  lead_updated:      { icon: <UserPlus  size={15} />, color: "#f59e0b", bg: "#fffbeb", label: "Lead Updated" },
  lead_won:          { icon: <TrendingUp size={15} />, color: "#10b981", bg: "#ecfdf5", label: "Lead Won" },
  lead_lost:         { icon: <TrendingDown size={15} />, color: "#ef4444", bg: "#fef2f2", label: "Lead Lost" },
  client_created:    { icon: <Users     size={15} />, color: "#10b981", bg: "#ecfdf5", label: "New Client" },
  client_updated:    { icon: <Users     size={15} />, color: "#f59e0b", bg: "#fffbeb", label: "Client Updated" },
  project_created:   { icon: <FolderOpen size={15} />, color: "#8b5cf6", bg: "#f5f3ff", label: "New Project" },
  project_updated:   { icon: <FolderOpen size={15} />, color: "#f59e0b", bg: "#fffbeb", label: "Project Updated" },
  project_completed: { icon: <FolderOpen size={15} />, color: "#10b981", bg: "#ecfdf5", label: "Project Done" },
  payment_received:  { icon: <DollarSign size={15} />, color: "#10b981", bg: "#ecfdf5", label: "Payment" },
  user_login:        { icon: <LogIn      size={15} />, color: "#4f6ef7", bg: "#eff6ff", label: "User" },
  note_added:        { icon: <FileText   size={15} />, color: "#94a3b8", bg: "#f8faff", label: "Note" },
};

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60)    return "just now";
  if (seconds < 3600)  return `${Math.floor(seconds/60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds/3600)}h ago`;
  if (seconds < 604800)return `${Math.floor(seconds/86400)}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day:"numeric", month:"short" });
}

export default function ActivityTimeline({ activities = [], onActivityClick }) {
  if (!activities.length) {
    return <div style={{ padding:"32px", textAlign:"center", color:"#94a3b8", fontSize:"14px" }}>No recent activity</div>;
  }

  return (
    <div className="timeline-wrap">
      {activities.map((activity, i) => {
        const cfg = TYPE_CONFIG[activity.type] || TYPE_CONFIG.note_added;
        const isLast = i === activities.length - 1;

        return (
          <div
            key={activity._id || i}
            className={`timeline-item ${onActivityClick ? "clickable" : ""}`}
            onClick={() => onActivityClick && onActivityClick(activity)}
          >
            {/* Left: icon + line */}
            <div className="timeline-left">
              <div className="timeline-icon" style={{ background: cfg.bg, color: cfg.color }}>
                {cfg.icon}
              </div>
              {!isLast && <div className="timeline-line" />}
            </div>

            {/* Right: content */}
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-label" style={{ color: cfg.color, background: cfg.bg }}>
                  {cfg.label}
                </span>
                <span className="timeline-time">{timeAgo(activity.createdAt)}</span>
              </div>
              <p className="timeline-desc">{activity.description}</p>
              {activity.userName && (
                <span className="timeline-user">by {activity.userName}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}