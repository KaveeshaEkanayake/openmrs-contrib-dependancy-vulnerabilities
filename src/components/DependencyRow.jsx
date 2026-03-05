import React from 'react';
import SeverityBadge from './SeverityBadge';

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
            <table className="cve-details-table">
              <thead>
                <tr>
                  <th>CVE ID</th>
                  <th>Severity</th>
                  <th>Score</th>
                  <th>Description</th>
                  <th>Affected Versions</th>
                  <th>Fixed In</th>
                  <th>CWE</th>
                </tr>
              </thead>
              <tbody>
                {dependency.cves.map(cve => (
                  <tr key={cve.id}>
                    <td>
                      <a 
                        href={`https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=${cve.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cve-id"
                      >
                        {cve.id}
                      </a>
                    </td>
                    <td>
                      <SeverityBadge severity={cve.severity} />
                    </td>
                    <td>{(cve.score || 0).toFixed(1)}</td>
                    <td>
                      <div className="description">
                        {cve.description}
                      </div>
                    </td>
                    <td>{cve.affectedVersions}</td>
                    <td>{cve.fixedIn}</td>
                    <td>{cve.cwe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}

export default DependencyRow;
