import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Book Management (Librarian)', () => {
  const libEmail = `lib-${Date.now()}@example.com`;
  const libPassword = 'Password123!';

  test.beforeAll(async ({ browser }) => {
     // Create a librarian for these tests
     const context = await browser.newContext();
     const page = await context.newPage();
     await page.goto('http://localhost:5173/register');
     await page.getByLabel('Full Name').fill('Librarian User');
     await page.getByLabel('Email Address').fill(libEmail);
     await page.getByLabel('Password').fill(libPassword);
     await page.locator('#role-select').click();
     await page.getByRole('option', { name: 'Librarian / Admin' }).click();
     await page.getByRole('button', { name: 'Register Account' }).click();
     await expect(page).toHaveURL(/.*(home|dashboard)/);
     await context.close();
  });

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email Address').fill(libEmail);
    await page.getByLabel('Password').fill(libPassword);
    await page.getByRole('button', { name: 'Login to Dashboard' }).click();
    await expect(page).toHaveURL(/.*(home|dashboard)/);
  });

  test('should create a new book', async ({ page }) => {
    await page.goto('/librarian/books');
    
    await page.getByRole('button', { name: 'Add New Book' }).click();
    
    const isbn = `ISBN-${Date.now()}`;
    await page.getByLabel('Book Title').fill('E2E Test Book');
    await page.getByLabel('Author').fill('E2E Author');
    await page.getByLabel('ISBN').fill(isbn);
    await page.getByLabel('Total Copies').fill('5');
    await page.getByLabel('Available Now').fill('5');
    
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Check if book appears in the list
    await expect(page.locator('table')).toContainText('E2E Test Book');
    await expect(page.locator('table')).toContainText(isbn);
  });

  test('should edit an existing book', async ({ page }) => {
    await page.goto('/librarian/books');
    
    // Find our test book and click edit (it's the one with 'E2E Test Book')
    const row = page.locator('tr').filter({ hasText: 'E2E Test Book' }).first();
    await row.locator('button').filter({ has: page.locator('svg[data-testid="EditIcon"]') }).click();
    
    await page.getByLabel('Book Title').fill('E2E Test Book Updated');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    await expect(page.locator('table')).toContainText('E2E Test Book Updated');
  });

  test('should delete a book', async ({ page }) => {
    await page.goto('/librarian/books');
    
    const row = page.locator('tr').filter({ hasText: 'E2E Test Book Updated' }).first();
    
    // Switch to handling the confirm dialog
    page.once('dialog', dialog => dialog.accept());
    
    await row.locator('button').filter({ has: page.locator('svg[data-testid="DeleteIcon"]') }).click();
    
    await expect(page.locator('table')).not.toContainText('E2E Test Book Updated');
  });
});
