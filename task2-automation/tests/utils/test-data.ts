/**
 * Test data utilities and constants for Goodbudget E2E tests
 */

export interface TestUser {
  email: string;
  password: string;
  householdName: string;
}

export interface Transaction {
  payee: string;
  amount: string;
  envelope: string;
  account: string;
  date?: string;
  notes?: string;
}

export interface SplitTransaction {
  payee: string;
  totalAmount: string;
  splits: Array<{
    envelope: string;
    amount: string;
  }>;
  account: string;
  date?: string;
}

/**
 * Generate unique test data to avoid conflicts
 */
export class TestDataGenerator {
  private static getTimestamp(): string {
    return Date.now().toString();
  }
  
  static generateTestUser(): TestUser {
    const timestamp = this.getTimestamp();
    return {
      email: `test.user.${timestamp}@example.com`,
      password: 'TestPassword123!',
      householdName: `TestHousehold_${timestamp}`
    };
  }
  
  static generateTransaction(): Transaction {
    const timestamp = this.getTimestamp();
    return {
      payee: `TestPayee_${timestamp}`,
      amount: '25.50',
      envelope: 'Groceries',
      account: 'Checking',
      date: new Date().toLocaleDateString('en-US'),
      notes: `Test transaction created at ${new Date().toISOString()}`
    };
  }
  
  static generateSplitTransaction(): SplitTransaction {
    const timestamp = this.getTimestamp();
    return {
      payee: `SplitPayee_${timestamp}`,
      totalAmount: '100.00',
      splits: [
        { envelope: 'Groceries', amount: '60.00' },
        { envelope: 'Entertainment', amount: '40.00' }
      ],
      account: 'Checking',
      date: new Date().toLocaleDateString('en-US')
    };
  }
}

/**
 * Common selectors used across tests
 */
export const Selectors = {
  // Authentication
  loginForm: '[data-testid="login-form"], form[action*="login"]',
  emailInput: 'input[name="email"], input[type="email"]',
  passwordInput: 'input[name="password"], input[type="password"]',
  loginButton: 'button[type="submit"], input[type="submit"]',
  signupLink: 'a[href*="signup"], a:has-text("Sign up")',
  
  // Navigation
  addTransactionButton: 'button:has-text("Add Transaction"), a:has-text("Add Transaction")',
  transactionsTab: 'a:has-text("Transactions"), [data-testid="transactions-tab"]',
  envelopesTab: 'a:has-text("Envelopes"), [data-testid="envelopes-tab"]',
  
  // Transaction Form
  transactionForm: '[data-testid="transaction-form"], form[action*="transaction"]',
  payeeInput: 'input[name="payee"], [data-testid="payee-input"]',
  amountInput: 'input[name="amount"], [data-testid="amount-input"]',
  envelopeSelect: 'select[name="envelope"], [data-testid="envelope-select"]',
  accountSelect: 'select[name="account"], [data-testid="account-select"]',
  dateInput: 'input[name="date"], input[type="date"]',
  notesInput: 'textarea[name="notes"], [data-testid="notes-input"]',
  saveButton: 'button:has-text("Save"), input[value="Save"]',
  
  // Split Transaction
  splitOption: 'option:has-text("Split"), [data-testid="split-option"]',
  splitRows: '[data-testid="split-row"], .split-row',
  splitEnvelopeSelect: '[data-testid="split-envelope"], .split-envelope select',
  splitAmountInput: '[data-testid="split-amount"], .split-amount input',
  
  // Validation and Messages
  errorMessage: '.error, [data-testid="error"], .alert-danger',
  successMessage: '.success, [data-testid="success"], .alert-success',
  validationError: '.validation-error, [data-testid="validation-error"]',
  
  // Common UI Elements
  modal: '.modal, [data-testid="modal"]',
  closeButton: 'button:has-text("Close"), [data-testid="close"]',
  confirmButton: 'button:has-text("Confirm"), [data-testid="confirm"]',
  cancelButton: 'button:has-text("Cancel"), [data-testid="cancel"]',
};

/**
 * Common test utilities
 */
export class TestUtils {
  /**
   * Wait for a specific amount of time
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Generate a random number within range
   */
  static randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Format currency amount
   */
  static formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }
  
  /**
   * Get current date in MM/DD/YYYY format
   */
  static getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US');
  }
}
