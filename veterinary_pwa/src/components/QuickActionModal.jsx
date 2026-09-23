import React from 'react';
import { CalendarPlus, UserPlus, FileText, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAction = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="quick-modal-backdrop" onClick={onClose}>
      <div className="quick-modal-sheet animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="quick-modal-handle" />
        <div className="quick-modal-header">
          <div className="quick-title-wrap">
            <Sparkles size={20} className="text-teal" />
            <h3>Quick Clinic Actions</h3>
          </div>
          <button className="quick-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="quick-actions-list">
          <button 
            className="quick-action-item" 
            onClick={() => handleAction('/appointments?action=new')}
          >
            <div className="quick-action-icon blue">
              <CalendarPlus size={22} />
            </div>
            <div className="quick-action-text">
              <h4>Book Appointment</h4>
              <p>Schedule a pet consultation or check-up</p>
            </div>
          </button>

          <button 
            className="quick-action-item" 
            onClick={() => handleAction('/patients?action=new')}
          >
            <div className="quick-action-icon teal">
              <UserPlus size={22} />
            </div>
            <div className="quick-action-text">
              <h4>Register New Pet</h4>
              <p>Create patient record & owner details</p>
            </div>
          </button>

          <button 
            className="quick-action-item" 
            onClick={() => handleAction('/billing?action=new')}
          >
            <div className="quick-action-icon purple">
              <FileText size={22} />
            </div>
            <div className="quick-action-text">
              <h4>Create Fast Invoice</h4>
              <p>Generate POS receipt & record payment</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
