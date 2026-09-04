import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = ({ to, label = 'Back' }) => {
  const navigate = useNavigate();

  const colors = {
    primary: '#005B96',
    primaryLight: '#E8F4FD',
    text: '#2D3436',
    white: '#FFFFFF'
  };

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: colors.text,
        background: colors.white,
        border: `1px solid ${colors.primaryLight}`,
        cursor: 'pointer',
        fontSize: '14px',
        padding: '8px 16px',
        borderRadius: '12px',
        transition: 'all 0.3s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.primary;
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateX(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.primaryLight;
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <FiArrowLeft size={16} />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;