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
