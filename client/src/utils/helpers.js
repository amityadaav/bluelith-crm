/** Format a number as Indian currency */
export const fmtINR = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style:               "currency",
    currency:            "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/** Human-readable time ago */
export const timeAgo = (date) => {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

/** Format date for display */
export const fmtDate = (d, opts = {}) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric", ...opts });
};

/** Days until a deadline (negative = overdue) */
export const daysUntil = (date) => {
  if (!date) return null;
  return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
};

/** Build user initials from name */
export const initials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

/** Notification dot color by type */
export const notifColor = (type) =>
  ({
    task_assign:    "#378ADD",
    deadline:       "#EF9F27",
    project_update: "#1D9E75",
    announcement:   "#534AB7",
    lead_won:       "#22c55e",
    lead_lost:      "#ef4444",
    user_create:    "#1D9E75",
  }[type] || "#94a3b8");

/** Status colors for leads/projects */
export const statusColor = (status) =>
  ({
    new:         "#3b82f6",
    contacted:   "#f59e0b",
    qualified:   "#22c55e",
    proposal:    "#a855f7",
    negotiation: "#ec4899",
    won:         "#22c55e",
    lost:        "#ef4444",
    active:      "#22c55e",
    "in-progress": "#3b82f6",
    completed:   "#22c55e",
    pending:     "#f59e0b",
    "on-hold":   "#94a3b8",
    cancelled:   "#ef4444",
  }[status] || "#94a3b8");

/** Download content as a file */
export const downloadFile = (content, filename, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

/** Convert array of objects to CSV string */
export const toCSV = (rows, fields) => {
  const escape = (v) => {
    const s = String(v ?? "").replace(/"/g, '""');
    return s.includes(",") || s.includes("\n") ? `"${s}"` : s;
  };
  const header = fields.join(",");
  const body   = rows.map((r) => fields.map((f) => escape(r[f])).join(",")).join("\n");
  return `${header}\n${body}`;
};