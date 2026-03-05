import React from 'react';
import SeverityBadge from './SeverityBadge';
import DependencyRow from './DependencyRow';

/**
 * RepoSection component displays a repository with collapsible dependencies table
 * @param {Object} repo - Repository object with name, severity, dependencies
 * @param {boolean} isExpanded - Whether the dependencies are being shown
 * @param {Function} onToggle - Callback when repo is toggled
 * @param {Set<string>} expandedDependencies - Set of expanded dependency keys
 * @param {Function} onToggleDependency - Callback when a dependency is toggled
 */
function RepoSection({ 
  repo, 
  isExpanded, 
  onToggle, 
  expandedDependencies,
  onToggleDependency
}) {
  const depKey = `${repo.name}`;

  return (
    <div className="repo-section">
      <div className="repo-header" onClick={onToggle}>
        <div className="repo-header-info">
          <span className="repo-title">{repo.name}</span>
        </div>
        <div className="repo-controls">
          <SeverityBadge severity={repo.severity} />
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="dependency-table-wrapper">
          {repo.dependencies && repo.dependencies.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Dependency</th>
                  <th>Version</th>
                  <th>Severity</th>
                  <th>CVEs</th>
                  <th>Exploit?</th>
                  <th>Fix Version</th>
                </tr>
              </thead>
              <tbody>
                {repo.dependencies.map((dep) => {
                  const depId = `${repo.name}-${dep.name}-${dep.version}`;
                  return (
                    <DependencyRow
                      key={depId}
                      dependency={dep}
                      isExpanded={expandedDependencies.has(depId)}
                      onToggle={() => onToggleDependency(depId)}
                    />
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No vulnerabilities found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RepoSection;
