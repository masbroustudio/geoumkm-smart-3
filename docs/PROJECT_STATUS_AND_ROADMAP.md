# Project Status & Roadmap - GeoUMKM Intelligence V4.0

> **Last Updated:** January 2025
> **Version:** 4.0 (Active Development)
> **Repository:** geoumkm-smart-3

---

## Context

The project was built across 2 Kiro sessions:

1. **Session 1 (`task-rebuild-geoumkm-notebooks`):** Rebuilt 8 ML notebooks from scratch
2. **Session 2 (`task-geoumkm-v4-phase1`):** Built Next.js 14 frontend, API layer, documentation, and CI/CD

The previous session crashed with error: `The toolUse blocks at messages.90.content contain duplicate Ids` - this is a Kiro internal error (not a code issue), meaning the session ran out of context or hit a bug.

---

## Section 1: What Has Been Completed

### ML Pipeline (100% Complete)

| Notebook | Description | Key Output |
|----------|-------------|------------|
| 01 | Data Foundation | 10,000 UMKM with 596 real kecamatan Jawa Barat |
| 02 | EDA & Feature Engineering | 34 columns total |
| 03 | Location Scoring Model | XGBoost + SHAP (R2=0.9999) |
| 04 | Credit Risk Model | Binary classification, PD buckets, score bands |
| 05 | Clustering & Segmentation | K-Means (5 clusters) + DBSCAN |
| 06 | Recommendation & What-If Simulation | Scenario engine |
| 07 | LLM & RIG Preparation | Knowledge base (595 docs) |
| 08 | Executive Summary & Model Cards | Final documentation |

**Artifacts:**
- Models: `ml/models/location_scoring_model.joblib`, `ml/models/credit_risk_model.joblib`
- Knowledge base: 6 JSON files in `ml/data/knowledge_base/`
- All 8 notebooks in `ml/notebooks/` execute end-to-end

---

### Frontend - Next.js 14 (90% Complete)

**Architecture:**
- App Router with route groups: `(landing)`, `(dashboard)`, `(auth)`
- Static export mode (`output: 'export'`) for Azure Static Web Apps
- Dark mode (hardcoded, no toggle yet)
- Mobile responsive sidebar

**Landing Page:**
- Premium design with Framer Motion animations
- Glassmorphism effects
- Fully responsive

**Dashboard Pages (9 total):**

| Page | Features | Status |
|------|----------|--------|
| Overview | KPI cards, score distribution chart, top kabupaten chart, cluster donut | Done |
| Credit Scoring | Bands table, PD buckets, SHAP waterfall chart | Done |
| Location Intelligence | Leaflet map with markers, filters, comparison radar chart | Done |
| Clustering | Cluster profiles, gov priority, investment opportunities | Done |
| Policy Simulation | What-if simulator, budget allocation sliders with live predictions | Done |
| Portfolio Analytics | Risk charts, HHI computation, stress testing | Done |
| Kecamatan Detail | Drill-down from map markers | Done |
| Reports | PDF export via jsPDF, CSV data export | Done |
| Settings | Placeholder | Skeleton |

**AI Chat Panel:**
- Floating panel with persona switching (Bank/Government/Investor)
- Local knowledge base keyword matching
- Suggested questions per persona
- Rich text formatting (bullets, citations)
- API integration with local fallback

**Data Strategy:**
- Static data fallback in `frontend/lib/static-data.ts` when API is not available

---

### Backend API - Azure Functions (80% Complete)

> **Important:** Architecture doc says Python but actual implementation is TypeScript/Node.js

**Location:** `api/` directory

**Endpoints (9 functions):**

| Function | Path | Description |
|----------|------|-------------|
| `chat.ts` | `/api/chat` | AI chat with keyword matching + Azure OpenAI fallback |
| `cluster.ts` | `/api/cluster` | Cluster profiles, gov priority, investment data |
| `credit.ts` | `/api/credit` | Credit score bands and PD buckets |
| `kecamatan.ts` | `/api/kecamatan` | Kecamatan reference data |
| `overview.ts` | `/api/overview` | Dashboard overview stats |
| `policy.ts` | `/api/policy` | Policy impacts, priority kecamatan, what-if scenarios |
| `recommend.ts` | `/api/recommend` | Location recommendations with filters |
| `score.ts` | `/api/score` | Location scores with kabupaten filter |
| `whatif.ts` | `/api/whatif` | Custom what-if simulation logic |

**Technical Details:**
- Data loaded from CSV files via `papaparse`
- Caching layer for loaded data
- API envelope pattern: `{ success: true, data: {...} }`

---

### Documentation (Complete)

| Document | Lines | Description |
|----------|-------|-------------|
| `docs/ARCHITECTURE.md` | ~299 | Full system architecture with mermaid diagrams |
| `docs/AZURE_SETUP_GUIDE.md` | ~763 | 14-step Azure setup (Portal + CLI instructions) |
| `README.md` | - | Project overview |

---

### CI/CD (Complete)

- `.github/workflows/deploy-frontend.yml` - Deploys frontend to Azure Static Web Apps
- Triggers on push to `main` (frontend/** path filter)
- Uses pnpm, Node.js 22

---

## Section 2: What Is NOT Complete / Needs Work

### Authentication (NOT implemented)

- Auth pages exist (`/login`, `/register`) but are UI-only placeholders
- No Azure Entra ID B2C integration
- No token validation, session management, or protected routes
- "Coming Soon" banner on form submission

### Azure SQL Database (NOT implemented)

- Architecture doc describes SQL tables but no database schema exists
- API reads from CSV files, not SQL
- No migration scripts, no ORM, no connection to Azure SQL

### Azure Blob Storage Integration (NOT implemented)

- No file upload/download for ML models
- No report export to Blob Storage
- Models are loaded from local filesystem

### Azure OpenAI Integration (Partial)

- Chat endpoint has code to call Azure OpenAI but it is behind environment variables
- Falls back to keyword-based local knowledge base matching when no API key configured
- No actual RAG pipeline connecting Azure AI Search

### Azure AI Search (NOT implemented)

- Knowledge base JSON files exist (`ml/data/knowledge_base/`)
- No indexer, no upload script, no search integration
- Chat uses local keyword matching instead

### Azure Key Vault (NOT implemented)

- Referenced in docs but no code to read secrets from Key Vault
- API uses direct environment variables

### Unit/Integration Tests (ZERO)

- No test files exist anywhere in the project
- No testing framework configured (no jest, vitest, playwright)
- No test scripts in `package.json`

### Dark Mode Toggle (NOT implemented)

- CSS variables for light mode are defined but unreachable
- `<html>` hardcoded to `className="dark"`
- All component styling uses hardcoded dark-palette Tailwind classes
- Adding light mode requires touching nearly every component

### Real Data Pipeline (NOT implemented)

- Frontend uses hardcoded static data in `frontend/lib/static-data.ts`
- API reads from CSV files that are gitignored (will not exist on fresh clone without running notebooks)
- No ETL pipeline from notebooks to database to API to frontend

### PDF Report Export (Partial)

- `jspdf` + `jspdf-autotable` installed
- Basic PDF generation exists in `frontend/lib/pdf-report.ts`
- But exports static/mock data, not real queried data

### API Deployment (NOT implemented)

- No Azure Functions deployment workflow
- No `requirements.txt` or Python setup (because it is TypeScript, not Python as docs say)
- No `func` CLI configuration for deployment
- `api/host.json` exists but no actual deployment tested

---

## Section 3: Bugs & Inconsistencies Found

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | Architecture doc says Python backend, code is TypeScript | Medium | `docs/ARCHITECTURE.md` says "Azure Functions (Python 3.11)" but `api/` uses TypeScript with `@azure/functions` npm package. Need to update docs. |
| 2 | README.md is outdated | Low | Still says "GeoUMKM Smart V3.0" in title, references old `notebooks/` and `data/` paths that no longer exist (moved to `ml/`). Structure section is wrong. |
| 3 | CSV files are gitignored | High | `.gitignore` has `*.csv` which means the data files that the API needs will not exist after a fresh clone. The API will fail without running the notebooks first. |
| 4 | `next-env.d.ts` is gitignored | Low | `.gitignore` has `next-env.d.ts` but the project needs it for TypeScript compilation. This was manually tracked before but the ignore rule could cause issues. |
| 5 | Cluster naming inconsistency | Low | Static data has clusters named "Urban Digital Leaders (2)" and "High-Risk Underserved (4)" with parenthetical numbers, which looks like auto-generated names not cleaned up. |
| 6 | Map data is limited | Medium | Only 20 kecamatan in `kecamatanMapData` out of 596 available. The map will look very sparse. |

---

## Section 4: Feature Improvements & Development Recommendations

### Priority 1: Critical for Production

| # | Feature | Description | Effort |
|---|---------|-------------|--------|
| 1 | Fix README.md | Update to V4.0, fix directory structure section, fix running instructions | Small |
| 2 | Fix ARCHITECTURE.md | Change Python references to TypeScript, update API section | Small |
| 3 | Add authentication | Integrate Azure Entra ID B2C, protect dashboard routes, add login flow | Large |
| 4 | Database integration | Create Azure SQL schema, migrate from CSV to SQL, add connection pooling | Large |
| 5 | Deploy API | Create deployment workflow for Azure Functions (TypeScript), test endpoints | Medium |
| 6 | Fix data pipeline | Either bundle CSV data with the API deployment or migrate to database | Medium |

### Priority 2: Important for UX

| # | Feature | Description | Effort |
|---|---------|-------------|--------|
| 7 | Dark/Light mode toggle | Add theme context, system preference detection, toggle button in sidebar | Medium |
| 8 | Full map data | Load all 596 kecamatan coordinates into the map, add clustering for markers | Medium |
| 9 | Real AI Chat (RAG) | Connect Azure OpenAI + AI Search, upload knowledge base, enable RAG | Large |
| 10 | Testing | Add vitest for unit tests, playwright for E2E, minimum coverage targets | Medium |
| 11 | Loading states | Add skeleton loaders, error boundaries, retry mechanisms | Small |
| 12 | i18n (Bahasa/English) | Add language switcher, translate all UI strings | Medium |

### Priority 3: Nice to Have

| # | Feature | Description | Effort |
|---|---------|-------------|--------|
| 13 | Export to Excel | Add xlsx export alongside CSV and PDF | Small |
| 14 | User preferences | Save dashboard filters, favorite kecamatan, custom views | Medium |
| 15 | Notifications | Alert when credit risk thresholds are breached | Medium |
| 16 | Audit trail | Log user actions for compliance | Medium |
| 17 | Multi-tenant | Support multiple organizations with data isolation | Large |
| 18 | PWA support | Offline access, push notifications, installable | Medium |
| 19 | Performance monitoring | Add Application Insights, track page load times, API latency | Small |
| 20 | API rate limiting | Add rate limiting, request validation, CORS config | Small |

---

## Section 5: Manual Steps Required (Azure Setup)

These steps CANNOT be automated by Kiro and must be done manually by the developer.

### Must Do Before Going Live

| # | Action | Why Manual | Reference |
|---|--------|-----------|-----------|
| 1 | Create Azure account & subscription | Requires payment info | [azure.microsoft.com/free](https://azure.microsoft.com/free) |
| 2 | Create Resource Group `rg-geoumkm-prod` | One-time setup | AZURE_SETUP_GUIDE.md Step 1 |
| 3 | Create Static Web Apps | Connects to GitHub | AZURE_SETUP_GUIDE.md Step 2 |
| 4 | Add `AZURE_STATIC_WEB_APPS_API_TOKEN` GitHub secret | Required for CI/CD | AZURE_SETUP_GUIDE.md Step 11 |
| 5 | Apply for Azure OpenAI access | Manual approval (1-5 days) | [aka.ms/oai/access](https://aka.ms/oai/access) |
| 6 | Create Azure OpenAI resource + deploy gpt-4o | After approval | AZURE_SETUP_GUIDE.md Step 5 |
| 7 | Create Azure AI Search service | For RAG | AZURE_SETUP_GUIDE.md Step 6 |
| 8 | Create Azure SQL Database | For production data | AZURE_SETUP_GUIDE.md Step 4 |
| 9 | Create Azure Entra ID B2C tenant | For auth | AZURE_SETUP_GUIDE.md Step 8 |
| 10 | Create Key Vault + store secrets | Security | AZURE_SETUP_GUIDE.md Step 9 |
| 11 | Configure environment variables | Connect all services | AZURE_SETUP_GUIDE.md Step 10 |
| 12 | Purchase custom domain (optional) | Branding | AZURE_SETUP_GUIDE.md Step 14 |

### For Demo/Development Only

If you just want to run locally without Azure:

```bash
cd frontend
pnpm install
pnpm dev
# Opens at http://localhost:3000
# All features work with static/mock data (no Azure needed)
```

---

## Section 6: Error Context

The error encountered in the previous session:

```
The toolUse blocks at messages.90.content contain duplicate Ids: tooluse_pppEG3D9v541U2JAzAzB6q
```

This is a **Kiro internal error**, not a code bug. It means:

- The session hit a context length limit or internal deduplication issue
- The work done before the crash IS saved (all commits were pushed)
- You can continue development in a new session (which is what happened)
- No code was lost or corrupted

---

## Section 7: Recommended Next Steps

Based on the current state, here is the recommended development sequence:

### Immediate (This Session)

1. Fix README.md - update to V4.0 with correct structure
2. Fix ARCHITECTURE.md - correct Python to TypeScript discrepancy
3. Consider bundling essential CSV data or adding a data-seed script

### Short Term (Next 1-2 Sessions)

4. Add dark/light mode toggle
5. Add testing framework (vitest) with basic coverage
6. Deploy API to Azure Functions (create workflow)
7. Expand map data to cover all 596 kecamatan

### Medium Term

8. Integrate Azure Entra ID B2C authentication
9. Migrate from CSV files to Azure SQL
10. Connect Azure OpenAI for real AI chat
11. Add Application Insights monitoring

---

## Directory Structure (Current)

```
geoumkm-smart-3/
├── frontend/              # Next.js 14 App Router
│   ├── app/
│   │   ├── (landing)/     # Premium landing page
│   │   ├── (dashboard)/   # 9 dashboard pages
│   │   └── (auth)/        # Login/Register (placeholder)
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utilities, static data, API client
│   └── public/            # Static assets
├── api/                   # Azure Functions (TypeScript)
│   └── src/
│       ├── functions/     # 9 HTTP endpoints
│       ├── data/          # CSV data loader
│       └── shared/        # Types and utilities
├── ml/                    # Machine Learning pipeline
│   ├── notebooks/         # 8 Jupyter notebooks
│   ├── models/            # Trained model artifacts
│   ├── data/              # Generated datasets + knowledge base
│   └── scripts/           # Utility scripts
├── docs/                  # Project documentation
│   ├── ARCHITECTURE.md
│   ├── AZURE_SETUP_GUIDE.md
│   ├── PROJECT_STATUS_AND_ROADMAP.md  # (this file)
│   └── assets/            # Chart images from notebooks
└── .github/
    └── workflows/         # CI/CD pipeline
```

---

## Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Next.js (App Router) | 14.x |
| UI Styling | Tailwind CSS | 3.x |
| Animations | Framer Motion | 11.x |
| Charts | Recharts | 2.x |
| Maps | React-Leaflet | 4.x |
| PDF Export | jsPDF + jspdf-autotable | latest |
| Backend | Azure Functions | 4.x |
| Backend Language | TypeScript | 5.x |
| Data Parsing | PapaParse | latest |
| ML Framework | scikit-learn, XGBoost | latest |
| Explainability | SHAP | latest |
| Package Manager | pnpm | 10.x |
| Node.js | - | 22.x |
| Deployment | Azure Static Web Apps | - |

---

## Monthly Cost Estimation (Production)

| Service | Tier | Est. Monthly Cost |
|---------|------|-------------------|
| Static Web Apps | Free | $0 |
| Azure Functions | Consumption | ~$0-5 |
| Azure SQL | Basic (5 DTU) | ~$5 |
| Azure OpenAI | Pay-per-use | ~$10-50 |
| Azure AI Search | Free | $0 |
| Blob Storage | LRS Hot | ~$1 |
| Key Vault | Standard | ~$0.03/secret |
| Entra ID B2C | 50k free auths | $0 |
| **Total** | | **~$16-61/month** |

---

*This document should be updated as features are completed or priorities shift.*
