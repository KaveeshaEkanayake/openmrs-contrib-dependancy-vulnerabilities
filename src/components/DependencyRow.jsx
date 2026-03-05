import React from 'react';
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
  return (
    <>
      <tr className="expandable-row" onClick={onToggle}>
        <td>
          <span className="expand-toggle">
            {dependency.cves && dependency.cves.length > 0 
              ? (isExpanded ? '▼' : '▶') 
              : ''}
          </span>
          {dependency.name}
        </td>
        <td>{dependency.version}</td>
        <td>
          <SeverityBadge severity={dependency.severity} />
        </td>
        <td>{dependency.cves?.length || 0}</td>
        <td>
          {dependency.cves && dependency.cves.some(c => 
            c.description?.toLowerCase().includes('exploit')
          ) ? 'Yes' : '-'}
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

export default DependencyRow;
