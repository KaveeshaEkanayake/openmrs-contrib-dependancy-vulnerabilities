/**
 * Severity utility functions
 * Maps severity labels to numeric scores for comparison
 */

const SEVERITY_SCORES = {
  'Critical': 9.0,
  'High': 7.5,
  'Medium': 5.0,
  'Low': 2.5,
};

/**
 * Convert severity label to numeric score
 * @param {string} severity - Severity label (Critical, High, Medium, Low)
 * @returns {number} Numeric score
 */
export const severityToScore = (severity) => {
  const normalizedSeverity = severity ? severity.toLowerCase() : '';
  const severityKeys = Object.keys(SEVERITY_SCORES);
  
  const matchedKey = severityKeys.find(
    key => key.toLowerCase() === normalizedSeverity
  );
  
  return matchedKey ? SEVERITY_SCORES[matchedKey] : 0;
};

/**
 * Get severity level from score
 * @param {number} score - Numeric score
 * @returns {string} Severity label
 */
export const scoreToSeverity = (score) => {
  if (score >= 9.0) return 'Critical';
  if (score >= 7.0) return 'High';
  if (score >= 4.0) return 'Medium';
  return 'Low';
};

/**
 * Calculate the highest severity from an array of CVEs
 * @param {Array} cves - Array of CVE objects
 * @returns {Object} { severity, score }
 */
export const getHighestSeverity = (cves) => {
  if (!cves || cves.length === 0) {
    return { severity: 'Low', score: 0 };
  }

  let highestScore = 0;
  let highestSeverity = 'Low';

  cves.forEach(cve => {
    const score = severityToScore(cve.severity);
    if (score > highestScore) {
      highestScore = score;
      highestSeverity = cve.severity;
    }
  });

  return { severity: highestSeverity, score: highestScore };
};

/**
 * Normalize severity label for consistent display
 * @param {string} severity - Raw severity value
 * @returns {string} Normalized severity
 */
export const normalizeSeverity = (severity) => {
  if (!severity) return 'Low';
  const normalized = severity.trim();
  const validSeverities = ['Critical', 'High', 'Medium', 'Low'];
  
  const match = validSeverities.find(
    s => s.toLowerCase() === normalized.toLowerCase()
  );
  
  return match || 'Low';
};
