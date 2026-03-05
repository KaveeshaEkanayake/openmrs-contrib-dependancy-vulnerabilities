/**
 * Version comparison utility functions
 * Handles semantic versioning comparisons
 */

/**
 * Parse a semantic version string into components
 * @param {string} versionString - Version string (e.g., "8.19.8", "1.2.3-beta")
 * @returns {Object} { major, minor, patch, prerelease }
 */
export const parseVersion = (versionString) => {
  if (!versionString) return { major: 0, minor: 0, patch: 0, prerelease: null };

  const version = String(versionString).trim();
  
  // Extract prerelease
  const [baseVersion, prerelease] = version.split('-');
  
  // Split base version into parts
  const parts = baseVersion.split('.');
  
  return {
    major: parseInt(parts[0]) || 0,
    minor: parseInt(parts[1]) || 0,
    patch: parseInt(parts[2]) || 0,
    prerelease: prerelease || null,
  };
};

/**
 * Compare two semantic versions
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export const compareVersions = (v1, v2) => {
  const parsed1 = parseVersion(v1);
  const parsed2 = parseVersion(v2);

  if (parsed1.major !== parsed2.major) {
    return parsed1.major > parsed2.major ? 1 : -1;
  }
  if (parsed1.minor !== parsed2.minor) {
    return parsed1.minor > parsed2.minor ? 1 : -1;
  }
  if (parsed1.patch !== parsed2.patch) {
    return parsed1.patch > parsed2.patch ? 1 : -1;
  }

  // If prerelease exists, version with prerelease is lower
  if (parsed1.prerelease && !parsed2.prerelease) return -1;
  if (!parsed1.prerelease && parsed2.prerelease) return 1;

  return 0;
};

/**
 * Find the highest version from an array of version strings
 * @param {Array<string>} versions - Array of version strings
 * @returns {string} Highest version
 */
export const findHighestVersion = (versions) => {
  if (!versions || versions.length === 0) return '-';

  const validVersions = versions.filter(v => v && String(v).trim());
  if (validVersions.length === 0) return '-';

  return validVersions.reduce((highest, current) => {
    return compareVersions(current, highest) > 0 ? current : highest;
  });
};

/**
 * Extract version from a description string if present
 * Common patterns: "fixed in 1.2.3", "Fix: 8.19.8", etc.
 * @param {string} text - Text to search
 * @returns {string|null} Version if found, null otherwise
 */
export const extractVersionFromText = (text) => {
  if (!text) return null;

  // Match version patterns like X.Y.Z
  const versionPattern = /\b(\d+\.\d+(?:\.\d+)?(?:-[a-zA-Z0-9.]+)?)\b/g;
  const matches = text.match(versionPattern);
  
  if (matches && matches.length > 0) {
    // Return the last (usually highest) version found
    return matches[matches.length - 1];
  }

  return null;
};
