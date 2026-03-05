import React from 'react';
import PropTypes from 'prop-types';
import SeverityBadge from './SeverityBadge';
import CveTable from './CveTable';

/**
 * DependencyRow component displays a single dependency with CVE count
 * Can be expanded to show CVE details
 * @param {Object} dependency - Dependency object with name, version, severity, etc.
 * @param {boolean} isExpanded - Whether the CVE details are currently shown
 * @param {Function} onToggle - Callback when expand/collapse is toggled
 */
function DependencyRow({ dependency, isExpanded, onToggle }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  const hasCves = dependency.cves && dependency.cves.length > 0;

  return (
    <>
      <tr 
        className="expandable-row" 
        onClick={hasCves ? onToggle : undefined}
        onKeyDown={hasCves ? handleKeyDown : undefined}
        role={hasCves ? "button" : undefined}
        tabIndex={hasCves ? 0 : undefined}
        aria-expanded={hasCves ? isExpanded : undefined}
        style={{ cursor: hasCves ? 'pointer' : 'default' }}
      >
        <td>
          <span className="expand-toggle" aria-hidden="true">
            {hasCves ? (isExpanded ? '⌃' : '⌄') : ''}
          </span>
          {dependency.name}
        </td>
        <td>{dependency.version}</td>
        <td>
          <SeverityBadge severity={dependency.severity} />
        </td>
        <td>{dependency.cves?.length || 0}</td>
        <td>
          {dependency.hasExploit ? 'Yes' : '-'}
        </td>
        <td>{dependency.fixVersion || '-'}</td>
      </tr>
      {isExpanded && dependency.cves && dependency.cves.length > 0 && (
        <tr className="cve-details">
          <td colSpan="6">
            <CveTable cves={dependency.cves} />
          </td>
        </tr>
      )}
    </>
  );
}

DependencyRow.propTypes = {
  dependency: PropTypes.shape({
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
    cves: PropTypes.array,
    fixVersion: PropTypes.string,
    hasExploit: PropTypes.bool,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default DependencyRow;
