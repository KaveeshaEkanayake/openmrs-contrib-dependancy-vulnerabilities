import React from 'react';
import PropTypes from 'prop-types';
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
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="repo-section">
      <div 
        className="repo-header" 
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="repo-header-info">
          <span className="repo-title">{repo.name}</span>
          <SeverityBadge severity={repo.severity} />
        </div>
        <div className="repo-controls">
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            ⌄
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
                  <th className="severity-column-header">
                    <span>Severity</span>
                    <span className="sort-indicator">↑</span>
                  </th>
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

RepoSection.propTypes = {
  repo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
    dependencies: PropTypes.array.isRequired,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  expandedDependencies: PropTypes.instanceOf(Set).isRequired,
  onToggleDependency: PropTypes.func.isRequired,
};

export default RepoSection;
