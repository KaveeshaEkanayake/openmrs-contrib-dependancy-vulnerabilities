import React, { useState, useMemo } from 'react';
import { useVulnerabilityData } from './hooks/useVulnerabilityData';
import RepoSection from './components/RepoSection';
import { sortRepositories } from './utils/sortingUtils';

function App() {
  const { data, loading, error } = useVulnerabilityData();
  const [expandedRepos, setExpandedRepos] = useState(new Set());
  const [expandedDependencies, setExpandedDependencies] = useState(new Set());
  const [sortBy, setSortBy] = useState('severity');

  // Sort repositories based on selected criteria
  const sortedData = useMemo(() => {
    return sortRepositories(data, sortBy);
  }, [data, sortBy]);

  const toggleRepo = (repoId) => {
    const newSet = new Set(expandedRepos);
    if (newSet.has(repoId)) {
      newSet.delete(repoId);
    } else {
      newSet.add(repoId);
    }
    setExpandedRepos(newSet);
  };

  const toggleDependency = (depId) => {
    const newSet = new Set(expandedDependencies);
    if (newSet.has(depId)) {
      newSet.delete(depId);
    } else {
      newSet.add(depId);
    }
    setExpandedDependencies(newSet);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">OpenMRS Dependency Vulnerability Report</h1>
        <div className="header-accent" />
        <p>
          A summary of known security vulnerabilities detected across OpenMRS modules by automated dependency scanning. 
          Each module lists its vulnerable dependencies, severity levels, and recommended fix versions to help maintainers prioritize upgrades.
        </p>
      </header>

      <div className="container">
        {loading ? (
          <div className="empty-state">
            <p>Loading vulnerability data...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>Error loading data: {error}</p>
          </div>
        ) : data && data.length > 0 ? (
          <>
            <div className="sorting-controls">
              <span className="sort-label">Sort by:</span>
              <button 
                className={`sort-button ${sortBy === 'severity' ? 'active' : ''}`}
                onClick={() => setSortBy('severity')}
              >
                Severity
              </button>
              <button 
                className={`sort-button ${sortBy === 'cveCount' ? 'active' : ''}`}
                onClick={() => setSortBy('cveCount')}
              >
                CVE Count
              </button>
              <button 
                className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => setSortBy('name')}
              >
                Name (A-Z)
              </button>
            </div>
            
            {sortedData.map((repo) => (
              <RepoSection
                key={repo.name}
                repo={repo}
                isExpanded={expandedRepos.has(repo.name)}
                onToggle={() => toggleRepo(repo.name)}
                expandedDependencies={expandedDependencies}
                onToggleDependency={toggleDependency}
              />
            ))}
          </>
        ) : (
          <div className="empty-state">
            <p>No vulnerability data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
