// Utility functions for the application

/**
 * Format a MongoDB ObjectId to a shorter, more readable format
 * Shows first 8 characters of the ID
 * @param {string} id - The full MongoDB ObjectId
 * @returns {string} - Shortened ID format
 */
export function formatId(id) {
  if (!id) return '';
  return id.toString().substring(0, 8).toUpperCase();
}

/**
 * Create a styled span with tooltip showing full ID
 * @param {string} id - The full MongoDB ObjectId
 * @returns {JSX.Element} - Formatted ID with tooltip
 */
export function IdWithTooltip({ id, className = '' }) {
  if (!id) return null;
  
  const shortId = formatId(id);
  const fullId = id.toString();
  
  return (
    <span 
      className={`id-badge ${className}`}
      title={fullId}
      style={{
        display: 'inline-block',
        padding: '4px 8px',
        backgroundColor: '#f0f0f0',
        color: '#666',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        border: '1px solid #ddd',
        transition: 'all 0.2s ease',
        letterSpacing: '0.5px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#d63031';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.borderColor = '#d63031';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f0f0f0';
        e.currentTarget.style.color = '#666';
        e.currentTarget.style.borderColor = '#ddd';
      }}
    >
      {shortId}
    </span>
  );
}

