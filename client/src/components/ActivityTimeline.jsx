
import { UserPlus, Users, FolderOpen, DollarSign, LogIn, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { timeAgo } from "../utils/helpers";
import "./ActivityTimeline.css";

const TYPE_CONFIG = {
  lead_created:      { icon: <UserPlus  size={15}/>, color:"#4f6ef7", bg:"#eff6ff", label:"New Lead" },
  lead_updated:      { icon: <UserPlus  size={15}/>, color:"#f59e0b", bg:"#fffbeb", label:"Lead Updated" },
  lead_won:          { icon: <TrendingUp size={15}/>, color:"#10b981", bg:"#ecfdf5", label:"Lead Won" },
  lead_lost:         { icon: <TrendingDown size={15}/>, color:"#ef4444", bg:"#fef2f2", label:"Lead Lost" },
  client_created:    { icon: <Users size={15}/>,     color:"#10b981", bg:"#ecfdf5", label:"New Client" },
  client_updated:    { icon: <Users size={15}/>,     color:"#f59e0b", bg:"#fffbeb", label:"Client Updated" },
  project_created:   { icon: <FolderOpen size={15}/>, color:"#8b5cf6", bg:"#f5f3ff", label:"New Project" },
  project_updated:   { icon: <FolderOpen size={15}/>, color:"#f59e0b", bg:"#fffbeb", label:"Project Updated" },
  project_completed: { icon: <FolderOpen size={15}/>, color:"#10b981", bg:"#ecfdf5", label:"Project Done" },
  payment_received:  { icon: <DollarSign size={15}/>, color:"#10b981", bg:"#ecfdf5", label:"Payment" },
  user_login:        { icon: <LogIn size={15}/>,      color:"#4f6ef7", bg:"#eff6ff", label:"Login" },
  user_create:       { icon: <UserPlus size={15}/>,   color:"#4f6ef7", bg:"#eff6ff", label:"User Created" },
  note_added:        { icon: <FileText size={15}/>,   color:"#94a3b8", bg:"#f8faff", label:"Note" },
};

export default function ActivityTimeline({ activities = [], onActivityClick }) {
  if (!activities.length) {
    return <div className="timeline-empty">No recent activity</div>;
  }

  return (
    <div className="timeline-wrap">
      {activities.map((activity, i) => {
        const cfg    = TYPE_CONFIG[activity.type] || TYPE_CONFIG.note_added;
        const isLast = i === activities.length - 1;
        return (
          <div
            key={activity._id || i}
            className={`timeline-item ${onActivityClick ? "clickable" : ""}`}
            onClick={() => onActivityClick?.(activity)}
          >
            <div className="timeline-left">
              <div className="timeline-icon" style={{ background: cfg.bg, color: cfg.color }}>
                {cfg.icon}
              </div>
              {!isLast && <div className="timeline-line" />}
            </div>
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