import React from 'react';
import { X } from 'lucide-react';
import './Sidebar.css';
import Markdown from 'react-markdown'

const Sidebar = ({ isOpen, onClose, chatSummary, onRegenerateSummary, isSummaryLoading }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          <span className="sidebar-title-icon">📄</span>
          Chat summary
        </h2>
        <button className="sidebar-toggle" onClick={onClose} aria-label="Close sidebar">
          <X size={24} />
        </button>
      </div>
      <div className="sidebar-content">
        {isSummaryLoading ? (
          <p className="summary-loading">Generating summary...</p>
        ) : chatSummary.length === 0 ? (
          <p>Have a conversation to summarize it.</p>
        ) : (
          <p><Markdown>{chatSummary}</Markdown></p>
        )}
      </div>
      <div className="sidebar-footer">
        <button 
          className="regenerate-button" 
          onClick={onRegenerateSummary}
          disabled={isSummaryLoading}
        >
          <span className="regenerate-icon">✨</span>
          Regenerate
        </button>
      </div>
    </div>
  );
}

export default Sidebar;