import React from 'react';
import './DashboardCards.css';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';

function DashboardCards({ stats }) {
  const cards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: <PeopleIcon className="card-icon" style={{ color: '#1976d2' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: <PersonIcon className="card-icon" style={{ color: '#2e7d32' }} />,
      color: '#e8f5e9',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: <AssignmentIcon className="card-icon" style={{ color: '#ed6c02' }} />,
      color: '#fff3e0',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: <TrendingUpIcon className="card-icon" style={{ color: '#9c27b0' }} />,
      color: '#f3e5f5',
    },
  ];

  return (
    <div className="dashboard-cards-container">
      {cards.map((card) => (
        <div 
          key={card.title} 
          className="dashboard-card"
          style={{ backgroundColor: card.color }}
        >
          <div className="card-content">
            <h3 className="card-title">{card.title}</h3>
            <p className="card-value">{card.value}</p>
          </div>
          <div className="card-icon-wrapper">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;