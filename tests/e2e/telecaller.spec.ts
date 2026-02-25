import { test, expect } from '@playwright/test';

const TELE_EMAIL = 'telecaller.auto@rapid.com';
const TELE_PASS = 'Tele@12345';

async function loginAsTelecaller(page) {
  // Prefer programmatic login to avoid brittle selectors
  const resp = await page.request.post('http://localhost:3000/api/users/login', {
    data: { email: TELE_EMAIL, password: TELE_PASS }
  });
  if (!resp.ok()) throw new Error('Backend login failed');
  const body = await resp.json();
  const { user, token } = body;

  // Seed redux-persist state and axios token
  await page.addInitScript(({ user, token }) => {
    // Token for axios
    localStorage.setItem('token', token);
    // Persisted auth slice
    const authState = {
      user,
      token,
      isAuthenticated: true,
      loading: false,
      error: null,
      permissionsLoading: false,
    } as any;
    const persistRoot = {
      auth: JSON.stringify(authState),
      _persist: { version: -1, rehydrated: true }
    } as any;
    localStorage.setItem('persist:root', JSON.stringify(persistRoot));
  }, { user, token });

  await page.goto('/');
  // Should render app with auth; navigate to telecaller dashboard explicitly
  await page.goto('/telecaller/dashboard');
  await page.waitForURL(/\/telecaller\/(dashboard)?/i, { timeout: 15000 });
}

// Basic telecaller smoke: login and navigation items
test('telecaller can login and see telecaller features', async ({ page }) => {
  await loginAsTelecaller(page);

  // Sidebar/menu assertions (best-effort, ensure core links exist)
  // Doctor list link (telecaller)
  const doctorsLink = page.getByRole('link', { name: /doctor|total doctor list/i }).first();
  await expect(doctorsLink).toBeVisible();

  // Quotation list link
  const quotationLink = page.getByRole('link', { name: /quotation/i }).first();
  await expect(quotationLink).toBeVisible();

  // Ensure admin-only user management not visible
  const userMgmt = page.getByRole('link', { name: /user management|all users|add user/i });
  await expect(userMgmt).toHaveCount(0);
});

// Validate doctors page loads data (network-level check)
test('telecaller can access doctor list', async ({ page }) => {
  await loginAsTelecaller(page);

  const [resp] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/doctors') && r.request().method() === 'GET'),
    page.goto('/telecaller/all-doctors')
  ]);

  expect(resp.ok()).toBeTruthy();
  const json = await resp.json();
  expect(json.success).toBeTruthy();
});

// Validate quotation list loads data (network-level check)
test('telecaller can access quotation list', async ({ page }) => {
  await loginAsTelecaller(page);

  const [resp] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/quotations') && r.request().method() === 'GET'),
    page.goto('/telecaller/quotation-list')
  ]);

  expect(resp.ok()).toBeTruthy();
  const json = await resp.json();
  expect(json.success).toBeTruthy();
});
