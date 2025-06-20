**# Task 1: Exploratory Testing Report - Goodbudget Application**

## Introduction
This document contains my findings from exploratory testing of the Goodbudget application. The testing focused on identifying usability issues, functional bugs, and potential improvements in the transaction management system.

## Testing Approach
I conducted exploratory testing focusing on the core functionality of adding transactions and managing envelopes. Testing was performed using Chrome browser with developer tools to analyze network activity, application storage, and accessibility issues.

## Issues Found

### Issue 1: Uneven Split Transaction Distribution
- **Severity**: High
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
-  **Evidence**: The screenshot shows the uneven split
  - ![image](https://github.com/user-attachments/assets/7685eaff-913a-401d-b40c-c7780b92eea1)

### Issue 2: Confusing Expense Representation in Envelopes
- **Severity**: High
- **Description**: When adding an expense transaction to an envelope, the system displays the amount as a negative value without clear indication of what this means to users.
- **Steps to Reproduce**: 
  1. Open "Add Transaction" form
  2. Select "Expense/Credit" tab
  3. Enter date (06/20/2025)
  4. Enter payee ("nitban")
  5. Enter amount (5150)
  6. Select "Savings" envelope
  7. Select "My Account" as the account
  8. Enter check number ()
  9. Save the transaction
- **Expected Result**: Clear indication that expenses reduce envelope balance with intuitive representation.
- **Actual Result**: The Savings envelope shows "-5,150.00" in red, which could be misinterpreted as an error or overspending rather than a recorded expense.
- **Impact**: Users may be confused about the state of their budget, potentially leading to financial mismanagement or abandonment of the application.
- **Evidence**: The screenshots show the transaction entry form with a 5000 expense and the resulting -5000 balance in the Savings envelope.
- ![image](https://github.com/user-attachments/assets/db19a251-5916-4d39-8c66-0c922a65d762)


### Issue 3: Inconsistent Visual Feedback
- **Severity**: Medium
- **Description**: The application uses red text for negative balances but doesn't provide sufficient context about what negative numbers represent in the budgeting system.
- **Steps to Reproduce**: Add an expense to any envelope and observe the balance display.
- **Expected Result**: Visual indicators should clearly communicate the meaning of negative balances.
- **Actual Result**: Red text is used for negative numbers, but there's no explanation or tooltip to help users understand the accounting method.
- **Impact**: New users may struggle to interpret their budget status correctly.

### Issue 4: Limited Form Validation
- **Severity**: Medium
- **Description**: The transaction entry form allows future dates (e.g., 06/20/2025) without warning, which could lead to incorrect budget projections.
- **Steps to Reproduce**: Enter a future date in the transaction date field.
- **Expected Result**: Warning about future-dated transactions or prevention of dates too far in the future.
- **Actual Result**: Future dates are accepted without any validation or warning.
- **Impact**: Users may accidentally enter incorrect dates, causing budget calculations to be inaccurate.
- **Evidence**: The screenshots show the transaction made with past date as the past dates need to be grayed out
- ![image](https://github.com/user-attachments/assets/e2405011-6f47-42cc-866e-9f96bd4b6a61)

### Issue 5: Sorting functionality

 ![Sorting](https://github.com/user-attachments/assets/0733bc56-d007-4aa0-bae2-743de85f4db0)


# Goodbudget Website API Analysis

## Overview
This document contains the analysis of the Goodbudget website (https://goodbudget.com/home) using browser dev-tools to examine network traffic, storage mechanisms, and performance characteristics.

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

  


