import React from 'react';
import SeverityBadge from './SeverityBadge';

/**
 * CveTable component displays CVE details for a dependency
 * @param {Array} cves - Array of CVE objects
 */
function CveTable({ cves }) {
  if (!cves || cves.length === 0) {
    return null;
  }

  return (
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
        {cves.map(cve => (
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
  );
}

export default CveTable;
