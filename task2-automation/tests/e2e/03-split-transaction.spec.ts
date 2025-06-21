import { test, expect } from '@playwright/test';
import { TestDataGenerator, Selectors, SplitTransaction } from '../utils/test-data';

/**
 * E2E Test Suite: Split Transaction Management
 * 
 * Business Critical Flow #3: Split Transaction Management
 * Tests the split transaction functionality and validates Issue 1 from exploratory testing
 */

test.describe('Split Transaction Management', () => {
  let testSplitTransaction: SplitTransaction;

  test.beforeEach(async ({ page }) => {
    // Generate test data
    testSplitTransaction = TestDataGenerator.generateSplitTransaction();
    
    // Navigate to Goodbudget and assume we're logged in
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should access split transaction option', async ({ page }) => {
    // Navigate to Add Transaction
    await page.click(Selectors.addTransactionButton);
    await page.waitForLoadState('networkidle');
    
    // Look for split transaction option
    const envelopeSelect = page.locator(Selectors.envelopeSelect);
    
    if (await envelopeSelect.isVisible()) {
      // Check if "Split into Multiple" option exists
      const splitOption = page.locator(Selectors.splitOption);
      await expect(splitOption).toBeVisible();
    }
  });

  test('should display split rows when split option is selected', async ({ page }) => {
    await page.click(Selectors.addTransactionButton);
    await page.waitForLoadState('networkidle');
    
    // Fill basic transaction info
    await page.fill(Selectors.payeeInput, testSplitTransaction.payee);
    await page.fill(Selectors.amountInput, testSplitTransaction.totalAmount);
    
    // Select split option
    const envelopeSelect = page.locator(Selectors.envelopeSelect);
    if (await envelopeSelect.isVisible()) {
      await envelopeSelect.selectOption({ label: 'Split into Multiple' });
      await page.waitForTimeout(1000); // Wait for UI to update
      
      // Verify split rows appear
      const splitRows = page.locator(Selectors.splitRows);
      await expect(splitRows).toHaveCount(2, { timeout: 5000 }); // Should have at least 2 split rows
    }
  });

  test('should test Issue 1: Uneven Split Transaction Distribution', async ({ page }) => {
    // This test specifically validates the bug found in exploratory testing
    await page.click(Selectors.addTransactionButton);
    await page.waitForLoadState('networkidle');
    
    // Fill transaction details exactly as in the bug report
    await page.fill(Selectors.payeeInput, 'nitban');
    await page.fill(Selectors.amountInput, '1150');
    
    // Select "Split into Multiple"
    const envelopeSelect = page.locator(Selectors.envelopeSelect);
    if (await envelopeSelect.isVisible()) {
      await envelopeSelect.selectOption({ label: 'Split into Multiple' });
      await page.waitForTimeout(1000);
      
      // Check the split amount distribution
      const splitAmountInputs = page.locator(Selectors.splitAmountInput);
      const splitRowCount = await splitAmountInputs.count();
      
      if (splitRowCount >= 2) {
        const firstRowAmount = await splitAmountInputs.nth(0).inputValue();
        const secondRowAmount = await splitAmountInputs.nth(1).inputValue();
        
        console.log(`Split distribution - First row: ${firstRowAmount}, Second row: ${secondRowAmount}`);
        
        // Document the current behavior (Issue 1)
        // Expected: Even distribution or manual entry required
        // Actual: Full amount goes to second row, first row gets 0.00
        
        // This assertion will document the current buggy behavior
        if (firstRowAmount === '0' || firstRowAmount === '0.00') {
          console.log('⚠️  Issue 1 confirmed: Uneven split distribution detected');
          console.log(`First row: ${firstRowAmount}, Second row: ${secondRowAmount}`);
          
          // Test fails if the bug is present (which it currently is)
          expect(firstRowAmount).not.toBe('0.00');
          expect(firstRowAmount).not.toBe('0');
        }
      }
    }
  });

  test('should allow manual adjustment of split amounts', async ({ page }) => {
    await page.click(Selectors.addTransactionButton);
    await page.waitForLoadState('networkidle');
    
    await page.fill(Selectors.payeeInput, testSplitTransaction.payee);
    await page.fill(Selectors.amountInput, testSplitTransaction.totalAmount);
    
    const envelopeSelect = page.locator(Selectors.envelopeSelect);
    if (await envelopeSelect.isVisible()) {
      await envelopeSelect.selectOption({ label: 'Split into Multiple' });
      await page.waitForTimeout(1000);
      
      // Manually set split amounts
      const splitAmountInputs = page.locator(Selectors.splitAmountInput);
      const splitRowCount = await splitAmountInputs.count();
      
      if (splitRowCount >= 2) {
        // Set first split amount
        await splitAmountInputs.nth(0).fill(testSplitTransaction.splits[0].amount);
        
        // Set second split amount
        await splitAmountInputs.nth(1).fill(testSplitTransaction.splits[1].amount);
        
        // Verify amounts were set correctly
        await expect(splitAmountInputs.nth(0)).toHaveValue(testSplitTransaction.splits[0].amount);
        await expect(splitAmountInputs.nth(1)).toHaveValue(testSplitTransaction.splits[1].amount);
      }
    }
  });

  test('should validate split amount totals', async ({ page }) => {
    await page.click(Selectors.addTransactionButton);
    await page.waitForLoadState('networkidle');
    
    await page.fill(Selectors.payeeInput, testSplitTransaction.payee);
    await page.fill(Selectors.amountInput, '100.00');
    
    const envelopeSelect = page.locator(Selectors.envelopeSelect);
    if (await envelopeSelect.isVisible()) {
      await envelopeSelect.selectOption({ label: 'Split into Multiple' });
      await page.waitForTimeout(1000);
      
      const splitAmountInputs = page.locator(Selectors.splitAmountInput);
      const splitRowCount = await splitAmountInputs.count();
      
      if (splitRowCount >= 2) {
        // Set amounts that don't add up to total
        await splitAmountInputs.nth(0).fill('30.00');
        await splitAmountInputs.nth(1).fill('80.00'); // Total: 110.00 (exceeds 100.00)
        
        // Try to save
        await page.click(Selectors.saveButton);
        
        // Check for validation error
        const hasError = await page.locator(Selectors.errorMessage).isVisible().catch(() => false);
        const validationError = await page.locator(Selectors.validationError).isVisible().catch(() => false);
        
        // Should show validation error for mismatched totals
        expect(hasError || validationError).toBeTruthy();
      }
    }
  });

  test('should assign envelopes to split rows', async ({ page }) => {
    await page.click(Selectors.addTransactionButton);
    await page.waitForLoadState('networkidle');
    
    await page.fill(Selectors.payeeInput, testSplitTransaction.payee);
    await page.fill(Selectors.amountInput, testSplitTransaction.totalAmount);
    
    const envelopeSelect = page.locator(Selectors.envelopeSelect);
    if (await envelopeSelect.isVisible()) {
      await envelopeSelect.selectOption({ label: 'Split into Multiple' });
      await page.waitForTimeout(1000);
      
      // Assign envelopes to split rows
      const splitEnvelopeSelects = page.locator(Selectors.splitEnvelopeSelect);
      const splitRowCount = await splitEnvelopeSelects.count();
      
      if (splitRowCount >= 2) {
        // Get available envelope options
        const firstSplitSelect = splitEnvelopeSelects.nth(0);
        const options = await firstSplitSelect.locator('option').allTextContents();
        
        if (options.length > 2) { // Skip "Select..." option
          // Select different envelopes for each split
          await firstSplitSelect.selectOption({ index: 1 });
          await splitEnvelopeSelects.nth(1).selectOption({ index: 2 });
          
          // Verify selections
          const firstSelection = await firstSplitSelect.inputValue();
          const secondSelection = await splitEnvelopeSelects.nth(1).inputValue();
          
          expect(firstSelection).not.toBe('');
          expect(secondSelection).not.toBe('');
          expect(firstSelection).not.toBe(secondSelection);
        }
      }
    }
  });

  test('should save valid split transaction', async ({ page }) => {
    await page.click(Selectors.addTransactionButton);
    await page.waitForLoadState('networkidle');
    
    // Fill complete split transaction
    await page.fill(Selectors.payeeInput, testSplitTransaction.payee);
    await page.fill(Selectors.amountInput, testSplitTransaction.totalAmount);
    
    // Select account if available
    const accountSelect = page.locator(Selectors.accountSelect);
    if (await accountSelect.isVisible()) {
      const options = await accountSelect.locator('option').allTextContents();
      if (options.length > 1) {
        await accountSelect.selectOption({ index: 1 });
      }
    }
    
    const envelopeSelect = page.locator(Selectors.envelopeSelect);
    if (await envelopeSelect.isVisible()) {
      await envelopeSelect.selectOption({ label: 'Split into Multiple' });
      await page.waitForTimeout(1000);
      
      // Set up split amounts that total correctly
      const splitAmountInputs = page.locator(Selectors.splitAmountInput);
      const splitEnvelopeSelects = page.locator(Selectors.splitEnvelopeSelect);
      const splitRowCount = await splitAmountInputs.count();
      
      if (splitRowCount >= 2) {
        // Set amounts that add up to total
        await splitAmountInputs.nth(0).fill('60.00');
        await splitAmountInputs.nth(1).fill('40.00');
        
        // Select envelopes
        const envelopeOptions = await splitEnvelopeSelects.nth(0).locator('option').allTextContents();
        if (envelopeOptions.length > 2) {
          await splitEnvelopeSelects.nth(0).selectOption({ index: 1 });
          await splitEnvelopeSelects.nth(1).selectOption({ index: 2 });
        }
        
        // Save transaction
        await page.click(Selectors.saveButton);
        await page.waitForLoadState('networkidle');
        
        // Verify success
        const currentUrl = page.url();
        const hasSuccessMessage = await page.locator(Selectors.successMessage).isVisible().catch(() => false);
        
        expect(hasSuccessMessage || !currentUrl.includes('add')).toBeTruthy();
      }
    }
  });

  test('should handle split transaction cancellation', async ({ page }) => {
    await page.click(Selectors.addTransactionButton);
    await page.waitForLoadState('networkidle');
    
    // Start creating split transaction
    await page.fill(Selectors.payeeInput, testSplitTransaction.payee);
    await page.fill(Selectors.amountInput, testSplitTransaction.totalAmount);
    
    const envelopeSelect = page.locator(Selectors.envelopeSelect);
    if (await envelopeSelect.isVisible()) {
      await envelopeSelect.selectOption({ label: 'Split into Multiple' });
      await page.waitForTimeout(1000);
      
      // Cancel the transaction
      const cancelButton = page.locator(Selectors.cancelButton);
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        await page.waitForLoadState('networkidle');
        
        // Should return to previous page
        const currentUrl = page.url();
        expect(currentUrl.includes('add')).toBeFalsy();
      }
    }
  });

  test('should support keyboard navigation in split form', async ({ page }) => {
    await page.click(Selectors.addTransactionButton);
    await page.waitForLoadState('networkidle');
    
    await page.fill(Selectors.payeeInput, testSplitTransaction.payee);
    await page.fill(Selectors.amountInput, testSplitTransaction.totalAmount);
    
    const envelopeSelect = page.locator(Selectors.envelopeSelect);
    if (await envelopeSelect.isVisible()) {
      await envelopeSelect.selectOption({ label: 'Split into Multiple' });
      await page.waitForTimeout(1000);
      
      // Test tab navigation through split fields
      const splitAmountInputs = page.locator(Selectors.splitAmountInput);
      const splitRowCount = await splitAmountInputs.count();
      
      if (splitRowCount >= 1) {
        await splitAmountInputs.nth(0).focus();
        await expect(splitAmountInputs.nth(0)).toBeFocused();
        
        // Tab to next split field
        await page.keyboard.press('Tab');
        
        // Should focus on envelope select or next amount field
        const splitEnvelopeSelects = page.locator(Selectors.splitEnvelopeSelect);
        if (await splitEnvelopeSelects.nth(0).isVisible()) {
          await expect(splitEnvelopeSelects.nth(0)).toBeFocused();
        }
      }
    }
  });
});
