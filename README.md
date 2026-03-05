# OpenMRS Dependency Vulnerability Dashboard

> A comprehensive React-based dashboard for visualizing and managing security vulnerabilities across OpenMRS projects.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-See%20LICENSE-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## Overview

The OpenMRS Dependency Vulnerability Dashboard is a production-ready tool designed to help maintainers and security teams visualize, prioritize, and track security vulnerabilities in OpenMRS modules. Built with React 18 and powered by OWASP Dependency-Check reports, it provides an intuitive interface for managing dependency security across multiple projects.

**Key Capabilities:**
- Real-time vulnerability scanning results visualization
- Multi-level sorting and filtering
- Exploit detection and severity classification
- Semantic version comparison for fix recommendations
- Fully accessible keyboard navigation
- Zero backend dependencies - runs entirely client-side

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Production Build](#production-build)
- [Usage](#usage)
  - [Data Format](#data-format)
  - [Adding New Modules](#adding-new-modules)
- [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Core Logic](#core-logic)
  - [Sorting Algorithm](#sorting-algorithm)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

### 🔍 **Vulnerability Management**
- **Repository Overview** - View all vulnerabilities grouped by OpenMRS module
- **Dependency Analysis** - Drill down into individual dependencies with affected versions
- **CVE Details** - Expandable tables showing complete CVE information with external links
- **Exploit Detection** - Automatic identification of vulnerabilities with known exploits

### 🎨 **User Interface**
- **Severity Badges** - Color-coded visual indicators (Critical, High, Medium, Low)
- **Interactive Sorting** - Sort by Severity, CVE Count, or Name with one click
- **Collapsible Sections** - Expandable repository and dependency rows for better navigation
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### ♿ **Accessibility**
- **Keyboard Navigation** - Full support for Tab, Enter, and Space keys
- **ARIA Attributes** - Proper semantic markup for screen readers
- **Focus Management** - Clear visual indicators for keyboard users

### 🚀 **Performance**
- **Client-Side Processing** - No backend required, runs entirely in the browser
- **Optimized Bundle** - ~49KB gzipped for fast loading
- **Efficient Rendering** - React hooks and memoization for optimal performance

---

## Demo

![Dashboard Screenshot](docs/screenshot.png)

*Example view showing repositories sorted by severity with expandable dependency details*

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18.2** | UI framework with hooks and functional components |
| **PropTypes** | Runtime type checking for component props |
| **Plain CSS** | Custom styling without heavy frameworks |
| **OWASP Dependency-Check** | Vulnerability scanning and report generation |

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** 14.x or higher
- **npm** 6.x or higher

Check your versions:
```bash
node --version
npm --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jayasanka-sack/openmrs-contrib-dependancy-vulnerabilities.git
   cd openmrs-contrib-dependancy-vulnerabilities
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm run build
   ```

### Development

Start the development server with hot-reloading:

```bash
npm start
```

The application will open automatically at [http://localhost:3000](http://localhost:3000)

**Development Scripts:**
- `npm run dev` - Start with auto port-freeing
- `npm start` - Standard development server
- `npm run build` - Create production build
- `npm test` - Run tests (when available)

### Production Build

Create an optimized build for deployment:

```bash
npm run build
```

The build artifacts will be in the `build/` directory, ready for deployment to any static hosting service.

---

## Usage

### Data Format

The dashboard reads vulnerability reports in GitLab Security Report format (JSON) from the `public/data/` directory.

**Expected fields:**
```json
{
  "vulnerabilities": [
    {
      "id": "CVE-2023-XXXXX",
      "severity": "High",
      "description": "...",
      "location": {
        "dependency": {
          "package": { "name": "package-name" },
          "version": "1.0.0"
        }
      },
      "links": [...]
    }
  ]
}
```

### Adding New Modules

To monitor a new OpenMRS module:

1. **Generate the vulnerability report** using OWASP Dependency-Check:
   ```bash
   dependency-check --project "module-name" --scan ./path/to/module \
     --format JSON --out ./public/data/module-name.json
   ```

2. **Update the repository list** in `src/hooks/useVulnerabilityData.js`:
   ```javascript
   const repositories = [
     'openmrs-core',
     'openmrs-module-billing',
     'openmrs-module-idgen',
     'module-name', // Add your module here
   ];
   ```

3. **Restart the development server** to see your new module

---

## Architecture

### Project Structure

```
openmrs-contrib-dependancy-vulnerabilities/
├── public/
│   ├── index.html              # HTML template
│   └── data/                   # Vulnerability JSON files
│       ├── openmrs-core.json
│       └── *.json
├── src/
│   ├── components/             # React components
│   │   ├── RepoSection.jsx     # Repository accordion
│   │   ├── DependencyRow.jsx   # Dependency display with CVEs
│   │   ├── CveTable.jsx        # CVE details table
│   │   └── SeverityBadge.jsx   # Severity indicator
│   ├── hooks/
│   │   └── useVulnerabilityData.js  # Data fetching & processing
│   ├── utils/
│   │   ├── severityUtils.js    # Severity score calculations
│   │   ├── versionUtils.js     # Semantic version comparison
│   │   └── sortingUtils.js     # Multi-level sorting logic
│   ├── App.jsx                 # Main application
│   ├── index.js                # Entry point
│   └── styles.css              # Global styles
├── scripts/
│   ├── sync-data.js            # Data synchronization
│   └── free-port.js            # Port management
├── package.json
└── README.md
```

### Core Logic

#### CVE Processing
1. **Sorting**: CVEs sorted by score (descending)
2. **Grouping**: Grouped by dependency (package + version)
3. **Aggregation**: Severity and exploit flags calculated per dependency

#### Dependency Analysis
1. **Severity Calculation**: Highest CVE severity in the dependency
2. **Fix Version Detection**: Highest semantic version across all CVE fixes
3. **Exploit Status**: Detected from CVE descriptions and reference links
4. **Multi-level Sorting**:
   - Primary: Dependency severity
   - Secondary: Highest CVE score
   - Tertiary: Alphabetical name

#### Repository Metrics
1. **Repo Severity**: Highest severity across all dependencies
2. **Highest CVE Score**: Maximum CVE score in the repository
3. **Sorting Options**:
   - By Severity (default)
   - By CVE Count
   - By Name (A-Z)

### Sorting Algorithm

The dashboard implements a three-tier sorting hierarchy:

```
Repositories:  Severity → Highest CVE Score → Name
Dependencies:  Severity → Highest CVE Score → Name
CVEs:          Score (descending)
```

This ensures critical vulnerabilities are always prioritized while maintaining consistent ordering for equal severities.

---

## Configuration

### Severity Thresholds

Severity levels are mapped from CVSS scores in `src/utils/severityUtils.js`:

```javascript
Critical: 9.0 - 10.0
High:     7.0 - 8.9
Medium:   4.0 - 6.9
Low:      0.1 - 3.9
```

### Custom Styling

Modify `src/styles.css` to customize:
- Color scheme (severity badges, buttons)
- Typography and spacing
- Responsive breakpoints

---

## Deployment

### Static Hosting (Recommended)

Deploy to any static hosting service:

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=build
```

**Vercel:**
```bash
npm run build
vercel --prod
```

**GitHub Pages:**
```bash
npm run build
# Copy build/ contents to your gh-pages branch
```

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Follow** the code style:
   - Components under ~200 lines
   - PropTypes for all components
   - Meaningful variable names
   - JSDoc comments for functions
4. **Test** your changes (`npm run build`)
5. **Commit** with clear messages (`git commit -m 'feat: add new feature'`)
6. **Push** to your fork (`git push origin feature/your-feature`)
7. **Open** a Pull Request

### Code Style

- **Format**: Use existing code as reference
- **Comments**: Document complex logic
- **Props**: Always validate with PropTypes
- **Accessibility**: Maintain keyboard navigation and ARIA attributes

---

## Troubleshooting

### Port Already in Use

If port 3000 is occupied, the `free-port.js` script will automatically kill the process. Alternatively:

```bash
# Find process on port 3000
netstat -ano | findstr :3000  # Windows
lsof -ti:3000                  # macOS/Linux

# Kill the process
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # macOS/Linux
```

### Data Not Loading

1. Check that JSON files exist in `public/data/`
2. Verify JSON format matches the expected schema
3. Check browser console for errors
4. Ensure repository names match filenames (without `.json`)

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

## Acknowledgments

- **OpenMRS Community** - For the incredible open-source healthcare platform
- **OWASP Foundation** - For the Dependency-Check tool
- **React Team** - For the amazing UI framework
- **Contributors** - Thank you to everyone who has contributed to this project

---

## Support

For issues, questions, or suggestions:
- 🐛 [Report a bug](https://github.com/jayasanka-sack/openmrs-contrib-dependancy-vulnerabilities/issues)
- 💡 [Request a feature](https://github.com/jayasanka-sack/openmrs-contrib-dependancy-vulnerabilities/issues)
- 📧 Contact the maintainers

---

**Made with ❤️ for the OpenMRS Community**

- OpenMRS community
- OWASP Dependency-Check project
- Vulnerability data from NVD and GitHub Security Advisories