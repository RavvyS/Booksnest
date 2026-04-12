import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Authentication Flow', () => {
  const uniqueEmail = `testuser-${Date.now()}@example.com`;

  test('should register a new librarian account successfully', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByLabel('Full Name').fill('Test Librarian');
    await page.getByLabel('Email Address').fill(uniqueEmail);
    await page.getByLabel('Password').fill('Password123!');
    
    // Select Librarian role using the new ID
    await page.locator('#role-select').click();
    await page.getByRole('option', { name: 'Librarian / Admin' }).click();
    
    await page.getByRole('button', { name: 'Register Account' }).click();
    
    // Librarians are auto-approved, so it should redirect to home/dashboard
    await expect(page).toHaveURL(/.*(home|dashboard)/);
    // Use a more generic check for the app presence
    await expect(page.locator('body')).toContainText(/Book Nest/i);
  });

  test('should login successfully with the new librarian account', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email Address').fill(uniqueEmail);
    await page.getByLabel('Password').fill('Password123!');
    
    await page.getByRole('button', { name: 'Login to Dashboard' }).click();
    
    await expect(page).toHaveURL(/.*(home|dashboard)/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email Address').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    
    await page.getByRole('button', { name: 'Login to Dashboard' }).click();
    
    // Error message might vary
    await expect(page.locator('body')).toContainText(/user not found|invalid/i);
  });

  test('Logout should work', async ({ page }) => {
    // Navigate to login and login first
    await page.goto('/login');
    await page.getByLabel('Email Address').fill(uniqueEmail);
    await page.getByLabel('Password').fill('Password123!');
    await page.getByRole('button', { name: 'Login to Dashboard' }).click();
    await expect(page).toHaveURL(/.*(home|dashboard)/);

    // Click Avatar to open menu
    await page.getByRole('button', { name: /open settings/i }).click();
    
    // Click Logout
    await page.getByRole('menuitem', { name: /Logout/i }).click();
    
    // Should redirect to Landing page (/) or Login
    await expect(page).toHaveURL(/\/$/); // Landing page
  });
});
