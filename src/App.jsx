import React, { useState } from 'react';

function App() {
  const [expandedRepos, setExpandedRepos] = useState(new Set());

  const toggleRepo = (repoId) => {
    const newSet = new Set(expandedRepos);
    if (newSet.has(repoId)) {
      newSet.delete(repoId);
    } else {
      newSet.add(repoId);
    }
    setExpandedRepos(newSet);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>OpenMRS Dependency Vulnerability Report</h1>
        <p>
          A summary of known security vulnerabilities detected across OpenMRS modules by automated dependency scanning. 
          Each module lists its vulnerable dependencies, severity levels, and recommended fix versions to help maintainers prioritize upgrades.
        </p>
      </header>

      <div className="container">
        <div className="empty-state">
          <p>Loading vulnerability data...</p>
        </div>
      </div>
    </div>
  );
}

export default App;
