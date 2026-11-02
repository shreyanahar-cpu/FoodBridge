import React from 'react';
import { CheckCircle2, Clock, Truck, Check, AlertCircle, Calendar, ArrowRight } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Available':
        return {
          bg: '#e8f7ee',
          color: '#1b4332',
          border: '#a3e0be',
          icon: <Check size={13} strokeWidth={2.5} />,
          text: 'Available for Claim',
        };
      case 'Requested':
        return {
          bg: '#fff7ed',
          color: '#c2410c',
          border: '#fed7aa',
          icon: <Clock size={13} strokeWidth={2.5} />,
          text: 'NGO Requested',
        };
      case 'Accepted':
        return {
          bg: '#eff6ff',
          color: '#1d4ed8',
          border: '#bfdbfe',
          icon: <CheckCircle2 size={13} strokeWidth={2.5} />,
          text: 'Accepted by Donor',
        };
      case 'Pickup Scheduled':
        return {
          bg: '#f5f3ff',
          color: '#6d28d9',
          border: '#ddd6fe',
          icon: <Calendar size={13} strokeWidth={2.5} />,
          text: 'Pickup Scheduled',
        };
      case 'In Transit':
        return {
          bg: '#faf5ff',
          color: '#7e22ce',
          border: '#e9d5ff',
          icon: <Truck size={13} strokeWidth={2.5} />,
          text: 'In Transit',
        };
      case 'Delivered':
        return {
          bg: '#ecfdf5',
          color: '#047857',
          border: '#6ee7b7',
          icon: <CheckCircle2 size={13} strokeWidth={2.5} />,
          text: 'Delivered & Completed',
        };
      case 'Cancelled':
        return {
          bg: '#fef2f2',
          color: '#b91c1c',
          border: '#fca5a5',
          icon: <AlertCircle size={13} strokeWidth={2.5} />,
          text: 'Cancelled',
        };
      default:
        return {
          bg: '#f3f4f6',
          color: '#4b5563',
          border: '#e5e7eb',
          icon: null,
          text: status || 'Unknown',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {config.icon}
      {config.text}
    </span>
  );
};
