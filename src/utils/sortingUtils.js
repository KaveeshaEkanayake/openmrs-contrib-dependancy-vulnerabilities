/**
 * Sorting utility functions for repositories and dependencies
 */

import { severityToScore } from './severityUtils';

/**
 * Sort repositories by different criteria
 * @param {Array} repos - Array of repository objects
 * @param {string} sortBy - Sort criteria: 'severity', 'name', 'cveCount'
 * @returns {Array} Sorted array
 */
export const sortRepositories = (repos, sortBy = 'severity') => {
  const sorted = [...repos];

  switch (sortBy) {
    case 'severity':
      return sorted.sort((a, b) => {
        const scoreA = severityToScore(a.severity);
        const scoreB = severityToScore(b.severity);
        if (scoreA !== scoreB) return scoreB - scoreA;
        
        // Secondary: highest CVE score in repo
        if (a.highestCveScore !== b.highestCveScore) {
          return b.highestCveScore - a.highestCveScore;
        }
        
        return a.name.localeCompare(b.name);
      });

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'cveCount':
      return sorted.sort((a, b) => {
        const countA = a.vulnerabilityCount || 0;
        const countB = b.vulnerabilityCount || 0;
        if (countA !== countB) return countB - countA;
        
        // Secondary: highest CVE score
        if (a.highestCveScore !== b.highestCveScore) {
          return b.highestCveScore - a.highestCveScore;
        }
        
        return a.name.localeCompare(b.name);
      });

    default:
      return sorted;
  }
};

/**
 * Sort dependencies by different criteria
 * @param {Array} dependencies - Array of dependency objects
 * @param {string} sortBy - Sort criteria: 'severity', 'name', 'cveCount'
 * @returns {Array} Sorted array
 */
export const sortDependencies = (dependencies, sortBy = 'severity') => {
  const sorted = [...dependencies];

  switch (sortBy) {
    case 'severity':
      return sorted.sort((a, b) => {
        const scoreA = severityToScore(a.severity);
        const scoreB = severityToScore(b.severity);
        if (scoreA !== scoreB) return scoreB - scoreA;
        
        // Secondary: highest CVE score
        if (a.highestScore !== b.highestScore) {
          return b.highestScore - a.highestScore;
        }
        
        return a.name.localeCompare(b.name);
      });

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'cveCount':
      return sorted.sort((a, b) => {
        const countA = a.cves?.length || 0;
        const countB = b.cves?.length || 0;
        if (countA !== countB) return countB - countA;
        
        // Secondary: highest CVE score
        if (a.highestScore !== b.highestScore) {
          return b.highestScore - a.highestScore;
        }
        
        return a.name.localeCompare(b.name);
      });

    default:
      return sorted;
  }
};
