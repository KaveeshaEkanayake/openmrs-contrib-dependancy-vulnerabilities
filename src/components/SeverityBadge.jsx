import React from 'react';

/**
 * SeverityBadge component displays severity level with appropriate styling
 * @param {string} severity - Severity level (Critical, High, Medium, Low)
 * @param {string} className - Optional additional CSS classes
 */
function SeverityBadge({ severity, className = '' }) {
  const normalizedSeverity = severity ? severity.toLowerCase() : 'low';
  const badgeClass = `badge ${normalizedSeverity} ${className}`;

  return (
    <span className={badgeClass}>
      {severity}
    </span>
  );
}

export default SeverityBadge;
