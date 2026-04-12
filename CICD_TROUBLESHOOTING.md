# CI/CD Troubleshooting Guide 🚀

This guide helps debug and resolve common failures in the GitHub Actions workflows for Booksnest.

---

## 1️⃣ Verify GitHub Secrets
Most CI failures are due to missing or incorrect Secrets. Ensure the following secrets are added in **Settings > Secrets and variables > Actions**:

| Service | Secret Name | Description |
| :--- | :--- | :--- |
| **Backend** | `JWT_SECRET` | Required for authentication tests. |
| **Backend** | `RENDER_DEPLOY_HOOK` | The deploy hook URL from your Render dashboard. |
| **Frontend** | `VERCEL_TOKEN` | Your Vercel account token. |
| **Frontend** | `VERCEL_ORG_ID` | Vercel Organization ID. |
| **Frontend** | `VERCEL_PROJECT_ID` | Vercel Project ID. |

---

## 2️⃣ Backend CI Failures
If `Backend CI` fails:
- **Check Test Logs**: Look for failing unit/integration tests in the GitHub Actions console.
- **Database Dependency**: Integration tests use `mongodb-memory-server`. If these fail, ensure the runner has enough memory or check if they pass locally with `npm run test:integration`.
- **Environment**: If tests need specific variables (like a Cloudinary Key), ensure they are either mocked in the code or added to GitHub Secrets.

---

## 3️⃣ Frontend CI Failures
If `Frontend CI/CD` fails:
- **E2E Tests (Playwright)**: We have currently **disabled** E2E tests in CI to avoid failures caused by backend dependencies. 
  - To re-enable them, uncomment the steps in `.github/workflows/frontend-ci.yml`.
  - **Warning**: Playwright tests expect a running backend. If you re-enable them, make sure the workflow starts the backend first or points to your live Render URL.
- **Vercel Deploy**: Ensure your `vercel.json` is correctly configured and that the Vercel project matches the IDs in your Secrets.

---

## 4️⃣ How to Re-enable E2E Tests in CI
If you want to run E2E tests automatically in GitHub:
1. Open `.github/workflows/frontend-ci.yml`.
2. Uncomment the `Install Playwright Browsers` and `Run E2E tests` steps.
3. Update `frontend/playwright.config.js` to point the `baseURL` to your live Render backend URL if you want to test against production.

```javascript
// Example modification in playwright.config.js
use: {
  baseURL: process.env.CI ? 'https://your-render-app.onrender.com' : 'http://localhost:5173',
}
```

---

## 5️⃣ Common Quick Fixes
- **Build Fails Locally?**: Run `npm run build` in both `frontend` and `backend`. If it fails locally, it will fail in CI.
- **Linting Errors**: GitHub will fail the CI if there are linting errors. Run `npm run lint` before pushing your code.
