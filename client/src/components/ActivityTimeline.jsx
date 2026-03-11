import React from "react";
import "./ActivityTimeline.css";

function ActivityTimeline({ activities }) {

  return (

    <div className="dashboard-card">

      <h2>Activity Timeline</h2>

      <ul className="timeline">

        {activities.map((activity) => (

          <li key={activity._id} className="timeline-item">

            <p className="activity-text">
              {activity.description}
            </p>

            <span className="activity-time">
              {new Date(activity.createdAt).toLocaleString()}
            </span>

          </li>

        ))}

      </ul>

    </div>

  );

}

export default ActivityTimeline;