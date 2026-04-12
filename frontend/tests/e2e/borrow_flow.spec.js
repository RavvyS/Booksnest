import { test, expect } from '@playwright/test';

test.describe('Borrowing & Queue Flow', () => {
  const libEmail = `lib-flow-${Date.now()}@example.com`;
  const readerAEmail = `readerA-flow-${Date.now()}@example.com`;
  const readerBEmail = `readerB-flow-${Date.now()}@example.com`;
  const password = 'Password123!';
  const bookTitle = `Queue Test Book ${Date.now()}`;
  const isbn = `ISBN-Q-${Date.now()}`;

  test('Comprehensive Borrow & Queue Flow', async ({ page }) => {
    // 1. Register Librarian
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('Main Librarian');
    await page.getByLabel('Email Address').fill(libEmail);
    await page.getByLabel('Password').fill(password);
    await page.locator('#role-select').click();
    await page.getByRole('option', { name: 'Librarian / Admin' }).click();
    await page.getByRole('button', { name: 'Register Account' }).click();
    await expect(page).toHaveURL(/.*(home|dashboard)/);

    // 2. Create Book with 1 copy
    await page.goto('/librarian/books');
    await page.getByRole('button', { name: 'Add New Book' }).click();
    await page.getByLabel('Book Title').fill(bookTitle);
    await page.getByLabel('Author').fill('Flow Author');
    await page.getByLabel('ISBN').fill(isbn);
    await page.getByLabel('Total Copies').fill('1');
    await page.getByLabel('Available Now').fill('1');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.locator('table')).toContainText(bookTitle);

    // 3. Logout Librarian
    await page.getByRole('button', { name: /open settings/i }).click();
    await page.getByRole('menuitem', { name: /Logout/i }).click();

    // 4. Register Reader A
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('Reader A');
    await page.getByLabel('Email Address').fill(readerAEmail);
    await page.getByLabel('Password').fill(password);
    await page.locator('#role-select').click();
    await page.getByRole('option', { name: 'Reader / Student' }).click();
    await page.getByRole('button', { name: 'Register Account' }).click();
    await expect(page.getByText(/pending librarian approval/i)).toBeVisible();

    // 5. Register Reader B
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('Reader B');
    await page.getByLabel('Email Address').fill(readerBEmail);
    await page.getByLabel('Password').fill(password);
    await page.locator('#role-select').click();
    await page.getByRole('option', { name: 'Reader / Student' }).click();
    await page.getByRole('button', { name: 'Register Account' }).click();
    await expect(page.getByText(/pending librarian approval/i)).toBeVisible();

    // 6. Login Librarian to approve both
    await page.goto('/login');
    await page.getByLabel('Email Address').fill(libEmail);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Login to Dashboard' }).click();
    await expect(page).toHaveURL(/.*(home|dashboard)/);

    await page.goto('/librarian/users');
    // Approve A
    await expect(page.locator('table')).toContainText(readerAEmail);
    await page.locator('tr').filter({ hasText: readerAEmail }).getByRole('button', { name: /approve/i }).click();
    // Approve B
    await expect(page.locator('table')).toContainText(readerBEmail);
    await page.locator('tr').filter({ hasText: readerBEmail }).getByRole('button', { name: /approve/i }).click();

    // 7. Logout Librarian
    await page.getByRole('button', { name: /open settings/i }).click();
    await page.getByRole('menuitem', { name: /Logout/i }).click();

    // 8. Reader A borrows the book
    await page.goto('/login');
    await page.getByLabel('Email Address').fill(readerAEmail);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Login to Dashboard' }).click();
    await expect(page).toHaveURL(/.*(home|dashboard)/);

    await page.goto('/books');
    await page.getByPlaceholder(/search books/i).fill(bookTitle);
    await page.getByText(bookTitle).first().click();
    await page.getByRole('button', { name: /Borrow Book/i }).click();
    await expect(page.getByText(/Borrowed successfully/i)).toBeVisible();

    // 9. Logout A, Login B
    await page.getByRole('button', { name: /open settings/i }).click();
    await page.getByRole('menuitem', { name: /Logout/i }).click();

    await page.goto('/login');
    await page.getByLabel('Email Address').fill(readerBEmail);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Login to Dashboard' }).click();
    await expect(page).toHaveURL(/.*(home|dashboard)/);
    
    // 10. Reader B joins queue
    await page.goto('/books');
    await page.getByPlaceholder(/search books/i).fill(bookTitle);
    await page.getByText(bookTitle).first().click();
    await page.getByRole('button', { name: /Join Waitlist/i }).click();
    await expect(page.getByText(/Joined the waitlist/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /Position #1/i })).toBeVisible();

    // 11. Logout B, Login A to return
    await page.getByRole('button', { name: /open settings/i }).click();
    await page.getByRole('menuitem', { name: /Logout/i }).click();

    await page.goto('/login');
    await page.getByLabel('Email Address').fill(readerAEmail);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Login to Dashboard' }).click();
    await expect(page).toHaveURL(/.*(home|dashboard)/);
    
    await page.goto('/reader/borrows');
    await page.locator('button').filter({ hasText: /Return/i }).click();
    await expect(page.getByText(/returned successfully/i)).toBeVisible();

    // 12. Logout A, Login B to verify auto-assignment
    await page.getByRole('button', { name: /open settings/i }).click();
    await page.getByRole('menuitem', { name: /Logout/i }).click();

    await page.goto('/login');
    await page.getByLabel('Email Address').fill(readerBEmail);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Login to Dashboard' }).click();
    await expect(page).toHaveURL(/.*(home|dashboard)/);
    
    await page.goto('/reader/borrows');
    await page.goto('/reader/borrows');
    await expect(page.getByRole('heading', { name: /Active Borrows 1/i })).toBeVisible();
    await expect(page.getByRole('main')).toContainText(bookTitle);
  });
});
