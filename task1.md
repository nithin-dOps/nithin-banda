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

