# Task 1: Exploratory Testing Report - Goodbudget Application

## Introduction
This document contains my findings from exploratory testing of the Goodbudget application, including testing charters, bug findings, risk analysis, and technical analysis using browser dev-tools.

## Testing Charters

### Charter 1: Core Transaction Management
**Mission**: Explore the transaction creation, editing, and deletion functionality to ensure users can accurately manage their financial data.
**Areas**: Add Transaction form, transaction history, envelope assignment, split transactions
**Risks**: Data loss, incorrect calculations, poor user experience
**Duration**: 45 minutes

### Charter 2: Envelope Budgeting System
**Mission**: Test the envelope budgeting methodology implementation to verify accurate budget tracking and allocation.
**Areas**: Envelope creation, fund allocation, balance tracking, overspending scenarios
**Risks**: Budget miscalculations, confusing balance representations, envelope overflow
**Duration**: 30 minutes

### Charter 3: User Interface and Accessibility
**Mission**: Evaluate the application's usability, responsive design, and accessibility features across different devices and user capabilities.
**Areas**: Navigation, form interactions, mobile responsiveness, keyboard navigation, screen reader compatibility
**Risks**: Poor accessibility, unusable on mobile devices, navigation confusion
**Duration**: 20 minutes

### Charter 4: Data Persistence and Security
**Mission**: Examine how user data is stored, transmitted, and secured within the application.
**Areas**: Session management, data synchronization, logout behavior, password security
**Risks**: Data breaches, session hijacking, data loss, privacy violations
**Duration**: 15 minutes

### Charter 5: Performance and Browser Compatibility
**Mission**: Assess application performance, loading times, and cross-browser functionality.
**Areas**: Page load speeds, API response times, browser compatibility, error handling
**Risks**: Poor performance, browser-specific bugs, timeout issues
**Duration**: 10 minutes

## Charter Prioritization

### High Priority Charters
1. **Charter 1 (Core Transaction Management)** - Priority: Critical
   - **Reasoning**: This is the primary function of the application. Any bugs here directly impact users' ability to manage their finances accurately.
   - **Business Impact**: High - Core functionality failure would render the app unusable

2. **Charter 4 (Data Persistence and Security)** - Priority: Critical
   - **Reasoning**: Financial applications handle sensitive data. Security vulnerabilities could lead to data breaches and regulatory compliance issues.
   - **Business Impact**: High - Security issues could destroy user trust and lead to legal consequences

### Medium Priority Charters
3. **Charter 2 (Envelope Budgeting System)** - Priority: High
   - **Reasoning**: This is the unique selling proposition of Goodbudget. Issues here affect the core value proposition.
   - **Business Impact**: Medium-High - Affects user satisfaction and competitive advantage

4. **Charter 3 (User Interface and Accessibility)** - Priority: Medium
   - **Reasoning**: Poor UX can lead to user abandonment, and accessibility issues may violate legal requirements.
   - **Business Impact**: Medium - Affects user adoption and legal compliance

### Lower Priority Charters
5. **Charter 5 (Performance and Browser Compatibility)** - Priority: Medium-Low
   - **Reasoning**: While important for user experience, performance issues are often tolerable if core functionality works.
   - **Business Impact**: Low-Medium - Affects user satisfaction but doesn't prevent core usage

## Risk Analysis for Financial Web Applications

### High-Risk Areas

#### 1. Data Security and Privacy Risks
- **Financial Data Exposure**: Unauthorized access to bank account information, transaction history, and spending patterns
- **Session Management**: Weak session handling could allow account takeover
- **Data Transmission**: Unencrypted or poorly encrypted data transmission
- **Mitigation**: Implement strong encryption, secure session management, regular security audits

#### 2. Calculation and Data Integrity Risks
- **Mathematical Errors**: Incorrect budget calculations leading to financial mismanagement
- **Data Corruption**: Loss or corruption of transaction data
- **Synchronization Issues**: Data inconsistency across devices
- **Mitigation**: Implement robust validation, backup systems, and data integrity checks

#### 3. Compliance and Regulatory Risks
- **PCI DSS Compliance**: If handling payment card data
- **GDPR/Privacy Laws**: Improper handling of personal financial data
- **Financial Regulations**: Compliance with financial service regulations
- **Mitigation**: Regular compliance audits, privacy by design, legal review

### Medium-Risk Areas

#### 4. User Experience and Adoption Risks
- **Complex Interface**: Users abandoning due to poor usability
- **Mobile Incompatibility**: Loss of users who primarily use mobile devices
- **Performance Issues**: Slow loading times leading to user frustration
- **Mitigation**: User testing, responsive design, performance optimization

#### 5. Business Continuity Risks
- **Service Downtime**: Application unavailability affecting user trust
- **Data Loss**: Backup and recovery failures
- **Scalability Issues**: Performance degradation under load
- **Mitigation**: Redundant systems, regular backups, load testing

### Low-Risk Areas

#### 6. Feature and Functionality Risks
- **Minor UI Bugs**: Cosmetic issues that don't affect core functionality
- **Browser Compatibility**: Issues with older or less common browsers
- **Non-critical Feature Failures**: Problems with secondary features
- **Mitigation**: Regular testing, progressive enhancement, graceful degradation

## Findings from Testing Charters

### Charter 1 Findings: Core Transaction Management

#### Issue 1: Uneven Split Transaction Distribution
- **Severity**: High
- **Charter**: Core Transaction Management
- **Description**: When using the "Split into Multiple" feature, the application automatically assigns the full transaction amount (1150.00) to the second split row, leaving 0.00 in the first row.
- **Steps to Reproduce**:
  1. Click "Add Transaction" button
  2. Enter "nitban" in the Payee field
  3. Enter "1150" in the Amount field
  4. Select "Split into Multiple" from the Envelope dropdown
  5. Observe the split amount distribution
- **Expected Result**: The amount should be either evenly distributed between split rows or the user should be prompted to manually distribute the amount.
- **Actual Result**: The entire amount (1150.00) is automatically assigned to the second row, with 0.00 in the first row.
- **Impact**: Users may not notice this uneven distribution and save the transaction with incorrect splits, leading to budgeting errors.
- **Evidence**: The screenshot shows the uneven split
  - ![image](https://github.com/user-attachments/assets/7685eaff-913a-401d-b40c-c7780b92eea1)

#### Issue 4: Limited Form Validation
- **Severity**: Medium
- **Charter**: Core Transaction Management
- **Description**: The transaction entry form allows future dates (e.g., 06/20/2025) without warning, which could lead to incorrect budget projections.
- **Steps to Reproduce**: Enter a future date in the transaction date field.
- **Expected Result**: Warning about future-dated transactions or prevention of dates too far in the future.
- **Actual Result**: Future dates are accepted without any validation or warning.
- **Impact**: Users may accidentally enter incorrect dates, causing budget calculations to be inaccurate.
- **Evidence**: The screenshots show the transaction made with past date as the past dates need to be grayed out
  ![image](https://github.com/user-attachments/assets/3c0610cb-be07-4afc-bbe2-ed8014f35355)


### Charter 2 Findings: Envelope Budgeting System

#### Issue 2: Confusing Expense Representation in Envelopes
- **Severity**: High
- **Charter**: Envelope Budgeting System
- **Description**: When adding an expense transaction to an envelope, the system displays the amount as a negative value without clear indication of what this means to users.
- **Steps to Reproduce**:
  1. Open "Add Transaction" form
  2. Select "Expense/Credit" tab
  3. Enter date (06/20/2025)
  4. Enter payee ("nitban")
  5. Enter amount (5150)
  6. Select "Savings" envelope
  7. Select "My Account" as the account
  8. Save the transaction
- **Expected Result**: Clear indication that expenses reduce envelope balance with intuitive representation.
- **Actual Result**: The Savings envelope shows "-5,150.00" in red, which could be misinterpreted as an error or overspending rather than a recorded expense.
- **Impact**: Users may be confused about the state of their budget, potentially leading to financial mismanagement or abandonment of the application.
- **Evidence**: The screenshots show the transaction entry form with a 5000 expense and the resulting -5000 balance in the Savings envelope.
  - ![image](https://github.com/user-attachments/assets/db19a251-5916-4d39-8c66-0c922a65d762)

### Charter 3 Findings: User Interface and Accessibility

#### Issue 3: Inconsistent Visual Feedback
- **Severity**: Medium
- **Charter**: User Interface and Accessibility
- **Description**: The application uses red text for negative balances but doesn't provide sufficient context about what negative numbers represent in the budgeting system.
- **Steps to Reproduce**: Add an expense to any envelope and observe the balance display.
- **Expected Result**: Visual indicators should clearly communicate the meaning of negative balances.
- **Actual Result**: Red text is used for negative numbers, but there's no explanation or tooltip to help users understand the accounting method.
- **Impact**: New users may struggle to interpret their budget status correctly.

#### Issue 5: Sorting Functionality Issues
- **Severity**: Medium
- **Charter**: User Interface and Accessibility
- **Description**: Sorting functionality in transaction lists may not work as expected or provide unclear feedback.
- **Impact**: Users may have difficulty organizing and finding their transaction data.
- **Evidence**: Screenshot showing sorting functionality
  - ![Sorting](https://github.com/user-attachments/assets/0733bc56-d007-4aa0-bae2-743de85f4db0)

### Charter 4 & 5 Findings: Security and Performance
- **Finding**: Comprehensive technical analysis performed using browser dev-tools (detailed below)
- **Security Concerns**: Missing critical security headers identified
- **Performance Issues**: Slow initial page load times (>2 seconds)

## Technical Analysis Using Browser Dev-Tools

## API Endpoints and REST Calls

| Endpoint | Method | Purpose | Response Code | Response Time | Size |
|----------|--------|---------|---------------|---------------|------|
| `/home` | GET | Main login page | 200 | 2177ms | Unknown |
| `/` | GET | Homepage redirect | 200 | ~1500ms | Unknown |
| `/api/user` | GET | User profile data (tested) | 404 | ~500ms | N/A |
| `/api/auth` | GET | Authentication endpoint (tested) | 404 | ~400ms | N/A |
| `/api/login` | GET | Login endpoint (tested) | 404 | ~450ms | N/A |
| `/wp-content/themes/goodbudget/style.css` | HEAD | CSS stylesheet | 404 | ~300ms | N/A |

## Request/Response Headers Observed

### Main Request Details
- **Request URL**: https://goodbudget.com/home
- **Request Method**: GET
- **Status Code**: 200 OK
- **Remote Address**: CloudFront CDN (FRA6-C1 edge location)

### Response Headers
- **Content-Type**: text/html; charset=UTF-8
- **Server**: Apache/2.4.63 (Unix)
- **Cache-Control**: max-age=0, must-revalidate, private
- **Connection**: keep-alive
- **Transfer-Encoding**: chunked
- **X-Cache**: Miss from cloudfront
- **X-Amz-Cf-Pop**: FRA6-C1
- **X-Amz-Cf-Id**: [CloudFront request ID]
- **Date**: Fri, 20 Jun 2025 10:56:44 GMT
- **Expires**: Fri, 20 Jun 2025 10:56:44 GMT
- **Via**: 1.1 [CloudFront identifier]

### Request Headers (Typical)
- **:authority**: goodbudget.com
- **:method**: GET
- **:path**: /home
- **:scheme**: https
- **User-Agent**: [Browser user agent]
- **Accept**: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8

## Storage and Cookies Analysis

### Cookies
| Name | Value | Domain | Path | Purpose |
|------|-------|--------|------|---------|
| `GBSESS` | 8606f3l3a400gsumn3p0r7uujn | goodbudget.com | / | Session management |

### Storage Observations
- **Session Cookies**: Uses PHP-style session management with GBSESS cookie
- **Session ID**: Randomly generated alphanumeric string
- **Domain Scope**: Properly scoped to goodbudget.com
- **Local Storage**: No evidence of localStorage usage from server response
- **Session Storage**: No evidence of sessionStorage usage from server response

## Security Analysis

| Security Header | Status | Impact |
|----------------|--------|---------|
| **X-Frame-Options** | ❌ Missing | Vulnerable to clickjacking attacks |
| **X-Content-Type-Options** | ❌ Missing | Vulnerable to MIME type sniffing |
| **Strict-Transport-Security** | ❌ Missing | No HTTPS enforcement |
| **Content-Security-Policy** | ❌ Missing | No XSS protection via CSP |

### Security Observations
- All critical security headers are missing
- HTTPS is used but not enforced via HSTS
- No protection against common web vulnerabilities
- Session management relies on standard PHP sessions

## Performance Analysis

### Core Metrics
- **Initial Page Load**: 2,177ms (2.2 seconds)
- **CDN Performance**: CloudFront CDN with FRA6-C1 edge location
- **Server Response**: Apache/2.4.63 (Unix)
- **Caching Strategy**: `max-age=0, must-revalidate, private` (no caching)
- **Transfer Method**: Chunked encoding for streaming response

### Performance Observations
- Relatively slow initial page load (>2 seconds)
- CDN usage indicates global distribution strategy
- No browser caching due to cache-control headers
- WordPress-based architecture may contribute to slower performance

## Architecture Insights

### Technology Stack
1. **CMS**: WordPress-based (evidence from wp-content paths)
2. **CDN**: AWS CloudFront for global content delivery
3. **Web Server**: Apache/2.4.63 on Unix
4. **Session Management**: PHP-style session handling
5. **Database**: Likely MySQL (typical WordPress setup)

### API Strategy
- **Public API**: No evidence of public REST API endpoints
- **Authentication**: Traditional session-based authentication
- **Data Access**: Likely uses WordPress admin-ajax.php for AJAX calls
- **API Endpoints**: Standard REST endpoints return 404 errors

## Browser Dev-Tools Investigation Summary

### Network Tab Findings
- Monitor session establishment via GBSESS cookie
- Look for AJAX calls to WordPress admin-ajax.php
- Check for third-party analytics/tracking requests
- CloudFront CDN handles static asset delivery

### Application Tab Findings
- Minimal client-side storage usage
- Session management handled server-side
- Cookies primarily for session management
- No complex client-side data persistence

### Performance & Accessibility
- Expect moderate performance scores due to WordPress overhead
- Security score likely low due to missing headers
- Accessibility should be reasonable for a financial application
- Core Web Vitals may need optimization

## Recommendations

### For API Development
1. **Authentication**: Implement JWT or OAuth2 for API access
2. **Security Headers**: Add all missing security headers
3. **Rate Limiting**: Implement API rate limiting mechanisms
4. **CORS Policy**: Define proper CORS headers for API endpoints
5. **API Versioning**: Use versioned API endpoints (/api/v1/)
6. **Documentation**: Provide OpenAPI/Swagger documentation

### For Performance Optimization
1. **Caching**: Implement proper browser caching strategies
2. **CDN**: Optimize CloudFront configuration
3. **Compression**: Enable gzip/brotli compression
4. **Minification**: Minify CSS/JS resources
5. **Image Optimization**: Implement responsive images and WebP format

### For Security Enhancement
1. **Security Headers**: Implement all missing security headers
2. **HSTS**: Enable HTTP Strict Transport Security
3. **CSP**: Implement Content Security Policy
4. **Session Security**: Add secure and httpOnly flags to cookies
5. **Input Validation**: Implement proper input validation and sanitization
