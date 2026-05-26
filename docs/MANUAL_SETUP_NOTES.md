# Catatan Setup Manual - GeoUMKM Intelligence V4.0

Dokumen ini adalah checklist praktis untuk setup dan deployment GeoUMKM Intelligence.
Untuk penjelasan detail setiap langkah, lihat [AZURE_SETUP_GUIDE.md](./AZURE_SETUP_GUIDE.md).

---

## A. Prasyarat (Prerequisites)

- [ ] Azure account (Pay-As-You-Go subscription)
- [ ] Azure CLI installed (v2.50+)
- [ ] Node.js v18+ dan pnpm
- [ ] Python 3.10+ dengan pip (untuk notebooks)
- [ ] Git
- [ ] VS Code (recommended)

---

## B. Setup Lokal (Local Development)

### 1. Clone repository

```bash
git clone https://github.com/<your-org>/geoumkm-smart-3.git
cd geoumkm-smart-3
```

### 2. Jalankan Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend akan berjalan di `http://localhost:3000`.

### 3. Jalankan API (opsional)

```bash
cd api
pnpm install
pnpm start
```

API akan berjalan di `http://localhost:7071/api`.

### 4. Buat file `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:7071/api
NEXT_PUBLIC_APP_NAME=GeoUMKM Intelligence
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME=<nama-tenant-b2c>
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID=<client-id-dari-app-registration>
NEXT_PUBLIC_AZURE_AD_B2C_POLICY_NAME=<nama-sign-in-policy>
```

**Daftar Environment Variables:**

| Variable | Deskripsi |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL Azure Functions (default: `http://localhost:7071/api`) |
| `NEXT_PUBLIC_APP_NAME` | Nama aplikasi |
| `NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME` | Nama tenant B2C |
| `NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID` | Client ID dari app registration |
| `NEXT_PUBLIC_AZURE_AD_B2C_POLICY_NAME` | Nama sign-in policy |

---

## C. Menjalankan ML Notebooks

- [ ] Install Python dependencies:

```bash
pip install pandas numpy scikit-learn xgboost shap joblib matplotlib seaborn
```

- [ ] Jalankan notebooks secara berurutan (01 sampai 08):
  - `01_data_collection.ipynb`
  - `02_data_preprocessing.ipynb`
  - `03_feature_engineering.ipynb`
  - `04_clustering.ipynb`
  - `05_prediction_model.ipynb`
  - `06_recommendation_engine.ipynb`
  - `07_knowledge_base.ipynb`
  - `08_model_evaluation.ipynb`

- [ ] Verifikasi output:
  - Models tersimpan di `ml/models/`
  - Knowledge base tersimpan di `ml/data/knowledge_base/`

> **Catatan:** Notebooks menggunakan synthetic data - tidak perlu download data eksternal.

---

## D. Setup Azure (Manual via Portal)

### 1. Resource Group

- [ ] Buat Resource Group: `rg-geoumkm-prod`
- [ ] Region: **Southeast Asia**

> Lihat detail lengkap di AZURE_SETUP_GUIDE.md Bagian Step 1

### 2. Azure Static Web Apps

- [ ] Connect ke GitHub repository
- [ ] Framework preset: **Next.js**
- [ ] Build location: `frontend`

> Lihat detail lengkap di AZURE_SETUP_GUIDE.md Bagian Step 2

### 3. Azure Functions App

- [ ] Runtime: **Node.js 18**
- [ ] Plan: **Consumption (Serverless)**
- [ ] Region: **Southeast Asia**

> Lihat detail lengkap di AZURE_SETUP_GUIDE.md Bagian Step 3

### 4. Azure SQL Database

- [ ] Tier: **Basic (5 DTU)**
- [ ] Set server name dan admin credentials
- [ ] Allow Azure services access

> Lihat detail lengkap di AZURE_SETUP_GUIDE.md Bagian Step 4

### 5. Azure OpenAI Service

- [ ] Request access terlebih dahulu (jika belum)
- [ ] Deploy model: **gpt-4o**
- [ ] Catat endpoint + API key

> Lihat detail lengkap di AZURE_SETUP_GUIDE.md Bagian Step 5

### 6. Azure AI Search

- [ ] Tier: **Free**
- [ ] Buat index untuk knowledge base

> Lihat detail lengkap di AZURE_SETUP_GUIDE.md Bagian Step 12

### 7. Azure Entra ID B2C

- [ ] Buat tenant B2C baru
- [ ] Register aplikasi (app registration)
- [ ] Buat user flow: **Sign up and sign in**

> Lihat detail lengkap di AZURE_SETUP_GUIDE.md Bagian Step 8

### 8. Azure Key Vault

- [ ] Simpan semua secrets:
  - SQL connection string
  - OpenAI API key
  - AI Search key

> Lihat detail lengkap di AZURE_SETUP_GUIDE.md Bagian Step 9

---

## E. Konfigurasi Azure Functions

Tambahkan app settings (environment variables) berikut di Azure Functions:

| Variable | Deskripsi |
|----------|-----------|
| `SQL_CONNECTION_STRING` | Connection string ke Azure SQL Database |
| `AZURE_OPENAI_ENDPOINT` | Endpoint Azure OpenAI resource |
| `AZURE_OPENAI_KEY` | API key Azure OpenAI |
| `AZURE_OPENAI_DEPLOYMENT` | Nama deployment model (e.g., `gpt-4o`) |
| `AZURE_SEARCH_ENDPOINT` | Endpoint Azure AI Search |
| `AZURE_SEARCH_KEY` | Admin key Azure AI Search |
| `AZURE_SEARCH_INDEX` | Nama index untuk knowledge base |

> Lihat detail lengkap di AZURE_SETUP_GUIDE.md Bagian Step 10

---

## F. Deployment Checklist

- [ ] Push code ke GitHub branch `main`
- [ ] Azure Static Web Apps auto-deploy frontend via GitHub Actions
- [ ] Set deployment token di GitHub Secrets: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- [ ] Deploy API ke Azure Functions (via VS Code Azure extension atau `func azure functionapp publish <app-name>`)
- [ ] Configure custom domain (opsional)
- [ ] Set CORS di Functions App untuk allow SWA domain

> Lihat detail lengkap di AZURE_SETUP_GUIDE.md Bagian Step 11 dan Step 14

---

## G. Verifikasi Post-Deployment

- [ ] Frontend loads di SWA URL
- [ ] API health check: `GET <functions-url>/api/overview` returns JSON
- [ ] AI Chat merespons (requires OpenAI + Search configured)
- [ ] Login flow berfungsi (requires B2C configured)
- [ ] Map menampilkan semua 595 kecamatan markers

---

## H. Catatan Penting (Important Notes)

- Frontend bisa berjalan tanpa Azure (static fallback data)
- ML notebooks hanya perlu dijalankan ulang jika ingin regenerate data
- Estimated monthly cost: ~$10-25 (tergantung usage)
- Untuk development, cukup jalankan frontend saja (`pnpm dev`)

---

## I. API Deployment via GitHub Actions

The API auto-deploys to Azure Functions when files in the `api/` directory are pushed to the `main` branch. The workflow is defined in `.github/workflows/deploy-api.yml`.

### 1. Get the Publish Profile

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to your Function App (`geoumkm-api`)
3. Click **"Get publish profile"** in the top toolbar
4. Download the `.PublishSettings` XML file

### 2. Add as GitHub Secret

1. Go to your GitHub repository > **Settings** > **Secrets and variables** > **Actions**
2. Click **"New repository secret"**
3. Name: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
4. Value: paste the entire content of the `.PublishSettings` file
5. Click **"Add secret"**

### 3. Important Notes on API Data

- The API reads CSV data files from `api/src/data/`
- These files are generated by running the ML notebooks (01-08)
- If the notebooks have not been run, the API will fail to serve data
- See section C above for instructions on running the ML notebooks

---

## J. Azure OpenAI Integration

The chat API supports Azure OpenAI for intelligent responses. When configured, the assistant uses GPT-4o to generate context-aware answers based on the persona and knowledge base. When not configured, it gracefully falls back to keyword matching.

### 1. Request Azure OpenAI Access

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **"Azure OpenAI"** in the top search bar
3. Click **"Create"** to create a new Azure OpenAI resource
4. If you do not have access yet, click **"Request Access"** and fill out the form
5. Wait for approval (usually 1-2 business days)

### 2. Create Resource and Deploy Model

1. Once approved, create an Azure OpenAI resource in your resource group (`rg-geoumkm-prod`)
2. Region: **Southeast Asia** (or nearest available)
3. Go to [Azure OpenAI Studio](https://oai.azure.com)
4. Navigate to **Deployments** > **Create new deployment**
5. Select model: **gpt-4o**
6. Deployment name: `gpt-4o` (or custom name)
7. Note your **endpoint** and **API key** from the resource's "Keys and Endpoint" page

### 3. Environment Variables

The following environment variables control the Azure OpenAI integration:

| Variable | Required | Description |
|----------|----------|-------------|
| `AZURE_OPENAI_ENDPOINT` | Yes | Your Azure OpenAI resource endpoint (e.g., `https://your-resource.openai.azure.com`) |
| `AZURE_OPENAI_KEY` | Yes | API key from your Azure OpenAI resource |
| `AZURE_OPENAI_DEPLOYMENT` | No | Deployment name (default: `gpt-4o`) |

### 4. Configure in Azure Functions App Settings

1. Go to [Azure Portal](https://portal.azure.com) > your Function App
2. Navigate to **Settings** > **Environment variables** (or **Configuration** > **Application settings**)
3. Add the three variables listed above
4. Click **Save** and restart the Function App

### 5. Test Locally with local.settings.json

For local development, add the variables to `api/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_OPENAI_ENDPOINT": "https://your-resource.openai.azure.com",
    "AZURE_OPENAI_KEY": "your-api-key-here",
    "AZURE_OPENAI_DEPLOYMENT": "gpt-4o"
  }
}
```

> **Note:** Never commit `local.settings.json` to version control. It is already in `.gitignore`.

### 6. Expected Behavior

- **With env vars set:** The chat API calls Azure OpenAI with a persona-specific system prompt and knowledge base context. Responses are AI-generated and contextual.
- **Without env vars:** The chat API falls back to keyword matching against the knowledge base. No external API calls are made.
- **On error (timeout, network issue):** The API logs the error and falls back to keyword matching automatically. The 15-second timeout prevents long hangs.

---

## K. Application Insights Setup

GeoUMKM includes a lightweight analytics wrapper that logs page views, events, and errors. By default it is a no-op (zero overhead). When you set the environment variable, it activates and logs with an `[Analytics]` prefix as a placeholder for a real Application Insights SDK.

### 1. Create Application Insights Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **"Application Insights"** and click **Create**
3. Resource Group: `rg-geoumkm-prod`
4. Name: `appi-geoumkm`
5. Region: **Southeast Asia**
6. Click **Review + Create**

### 2. Get the Instrumentation Key

1. Open the Application Insights resource
2. Go to **Overview** and copy the **Instrumentation Key** (or Connection String)

### 3. Set Environment Variable

Add to `frontend/.env.local` for local development:

```env
NEXT_PUBLIC_APPINSIGHTS_KEY=<your-instrumentation-key>
```

For production, add this to your Azure Static Web Apps environment variables.

### 4. Tracked Events

| Event | Location | Properties |
|-------|----------|------------|
| Page View | Dashboard navigation | `pageName` |
| `chat_message_sent` | AI Chat panel | `persona` |
| `report_exported` | Reports page | `reportType` |
| `theme_toggled` | Theme toggle | `newTheme` |

### 5. Expected Behavior

- **Without `NEXT_PUBLIC_APPINSIGHTS_KEY`:** All analytics calls are no-ops (no console output, no errors)
- **With the key set:** Events are logged to `console.log` with `[Analytics]` prefix
- **Production upgrade:** Replace the console.log calls in `frontend/lib/analytics.ts` with the real Application Insights SDK (`@microsoft/applicationinsights-web`)

---

## L. PWA Support

GeoUMKM is configured as a Progressive Web App (PWA), allowing users to install it on mobile and desktop devices and use it offline.

### 1. Manifest

The web app manifest is at `frontend/public/manifest.json`. It defines:

- App name and short name
- Start URL (`/overview`)
- Display mode (`standalone`)
- Theme and background colors
- App icon (SVG)

### 2. Service Worker

The service worker (`frontend/public/sw.js`) provides:

- **Install:** Caches the app shell (all main dashboard routes + offline page)
- **Static assets:** Cache-first strategy for same-origin requests
- **API calls:** Network-first strategy for URLs containing `/api/`
- **Offline fallback:** Serves `/offline` page when navigation fails without network

### 3. Service Worker Registration

The service worker is registered in `frontend/app/layout.tsx` only when:

- The browser supports service workers (`'serviceWorker' in navigator`)
- The app is NOT running on localhost (development mode)

This prevents caching issues during development.

### 4. Offline Page

The offline fallback page is at `frontend/app/offline/page.tsx`. It displays a simple message informing the user they are offline, with a "Try Again" button to reload.

### 5. Testing PWA Locally

To test the PWA behavior locally:

1. Run `pnpm build` in the `frontend/` directory
2. Serve the `out/` directory with a static file server (e.g., `npx serve out`)
3. Open Chrome DevTools > Application tab to inspect the service worker and manifest
4. Use the "Offline" checkbox in the Network tab to test offline behavior

---

## M. Azure AD B2C Authentication Setup

GeoUMKM includes a prepared authentication scaffold (AuthProvider + AuthGuard) that currently uses mock state for demo purposes. When you are ready to enable real authentication, follow these steps to configure Azure AD B2C.

### 1. Create a B2C Tenant

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **"Azure AD B2C"** and click **Create**
3. Select **"Create a new Azure AD B2C Tenant"**
4. Organization name: `GeoUMKM Auth` (or your preferred name)
5. Initial domain name: `geoumkmauth` (this becomes `geoumkmauth.onmicrosoft.com`)
6. Region: **Southeast Asia** (or nearest)
7. Click **Review + Create**

### 2. Register the Application

1. Switch to your new B2C tenant directory
2. Go to **Azure AD B2C** > **App registrations** > **New registration**
3. Name: `GeoUMKM Frontend`
4. Supported account types: **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**
5. Redirect URI: Select **Single-page application (SPA)** and enter:
   - `http://localhost:3000` (for development)
   - `https://<your-production-url>` (for production)
6. Click **Register**
7. Note the **Application (client) ID** - this is your `NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID`

### 3. Create User Flows

1. In Azure AD B2C, go to **User flows** > **New user flow**
2. Select **Sign up and sign in** (Recommended version)
3. Name: `susi` (the full policy name will be `B2C_1_susi`)
4. Identity providers: Select **Email signup**
5. User attributes to collect: **Display Name**, **Email Address**
6. Application claims to return: **Display Name**, **Email Addresses**, **User's Object ID**
7. Click **Create**

### 4. Environment Variables

Add these to `frontend/.env.local`:

```env
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME=geoumkmauth
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID=<client-id-from-app-registration>
NEXT_PUBLIC_AZURE_AD_B2C_POLICY_NAME=B2C_1_susi
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME` | The initial domain name of your B2C tenant (without `.onmicrosoft.com`) |
| `NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID` | Application (client) ID from the app registration |
| `NEXT_PUBLIC_AZURE_AD_B2C_POLICY_NAME` | The name of your sign-up/sign-in user flow (e.g., `B2C_1_susi`) |

### 5. Enable AuthGuard in Dashboard

Once B2C is configured and environment variables are set:

1. Open `frontend/app/(dashboard)/layout.tsx`
2. Follow the TODO comment to wrap the layout with `<AuthProvider>` and `<AuthGuard>`
3. Update `frontend/lib/auth-context.tsx` to replace mock login/logout with MSAL calls:
   - Install `@azure/msal-browser` and `@azure/msal-react`
   - Initialize MSAL with B2C configuration
   - Replace `login()` with `msalInstance.loginRedirect()`
   - Replace `logout()` with `msalInstance.logoutRedirect()`
4. Test the full sign-up/sign-in flow

> **Note:** Until B2C is configured, the dashboard remains fully accessible without authentication. The AuthGuard component is available but not active.
