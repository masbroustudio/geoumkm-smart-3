# 🗺️ GeoUMKM Intelligence V4.0

> **AI-Powered Location Intelligence & Credit Risk System for Indonesian MSMEs**  
> *Urban Resilience & Smart City - METC Datathon 2026*

![Dicoding](https://img.shields.io/badge/Dicoding-Submission-blue)
![Azure](https://img.shields.io/badge/Azure-Static%20Web%20Apps-0078D4)
![Next.js](https://img.shields.io/badge/Next.js-14-000000)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB)
![XGBoost](https://img.shields.io/badge/XGBoost-ML-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Deskripsi Proyek

**GeoUMKM Intelligence V4.0** adalah sistem intelijen lokasi dan penilaian risiko kredit berbasis **AI dan geospatial analytics** yang melayani **3 target pengguna utama**:

### 🏦 Bank (Credit Risk)
- Model credit risk scoring dengan Probability of Default (PD) buckets
- Regulatory-compliant risk assessment untuk portofolio UMKM
- Score bands dan calibration sesuai standar perbankan

### 🏛️ Pemerintah / Government (Priority Areas & Policy Simulation)
- Identifikasi kecamatan prioritas untuk intervensi program
- What-If simulation untuk estimasi dampak kebijakan (KUR, pelatihan, infrastruktur)
- Clustering wilayah berdasarkan karakteristik UMKM

### 💼 Investor (Opportunity Scoring)
- Location scoring model untuk penilaian peluang investasi
- Segmentasi pasar berdasarkan clustering geospasial
- Rekomendasi lokasi optimal per sektor usaha

---

## 📊 Statistik Proyek

| Metrik | Nilai |
|--------|-------|
| Total Data UMKM | 10,000 |
| Kecamatan | 596 |
| Kabupaten/Kota | 27 |
| Notebook | 8 |
| ML Models | XGBoost, LightGBM |
| Clusters | K-Means + DBSCAN |

---

## 📓 Notebook Pipeline

Notebooks harus dijalankan secara berurutan (sequential) karena setiap notebook menghasilkan data yang digunakan oleh notebook berikutnya.

| # | Notebook | Deskripsi |
|---|----------|-----------|
| 01 | `01_Data_Foundation.ipynb` | Generate 10,000 dataset UMKM sintetis dengan 596 kecamatan riil di Jawa Barat |
| 02 | `02_EDA_Feature_Engineering.ipynb` | Exploratory Data Analysis + Feature Engineering (34 kolom) |
| 03 | `03_Location_Scoring_Model.ipynb` | XGBoost location scoring model dengan SHAP explainability |
| 04 | `04_Credit_Risk_Model.ipynb` | Credit risk model dengan PD buckets dan regulatory compliance |
| 05 | `05_Clustering_Segmentation.ipynb` | K-Means + DBSCAN clustering untuk segmentasi wilayah |
| 06 | `06_Recommendation_WhatIf.ipynb` | Recommendation engine + What-If policy simulation |
| 07 | `07_LLM_RIG_Preparation.ipynb` | Knowledge base construction + RIG (Retrieval-Integrated Generation) preparation |
| 08 | `08_Executive_Summary.ipynb` | Model cards + executive summary untuk stakeholders |

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **ML Pipeline (XGBoost/LightGBM)** | Ensemble models untuk location scoring dan credit risk |
| **Credit Risk Model** | PD estimation dengan score bands, calibration curves, KS statistic |
| **Clustering & Segmentation** | K-Means + DBSCAN untuk segmentasi geospasial UMKM |
| **Recommendation Engine** | Rekomendasi lokasi optimal per kecamatan berdasarkan multi-criteria scoring |
| **What-If Simulation** | Simulasi dampak kebijakan pemerintah terhadap skor UMKM |
| **LLM/RIG Preparation** | Knowledge base terstruktur untuk integrasi dengan Large Language Models |
| **SHAP Explainability** | Feature importance dan model interpretability |
| **Executive Summary** | Model cards dan ringkasan untuk pengambil keputusan |
| **Interactive Dashboard** | Frontend Next.js 14 dengan visualisasi interaktif |
| **AI Chat Assistant** | Chat berbasis Azure OpenAI dengan RAG |

---

## 🛠️ Technology Stack

### Machine Learning & Data
- **XGBoost / LightGBM** - Gradient boosting models
- **scikit-learn** - ML pipeline, preprocessing, clustering
- **SHAP** - Model explainability
- **Pandas / NumPy / SciPy** - Data processing & statistics
- **Matplotlib / Seaborn** - Visualization
- **nbformat** - Programmatic notebook generation

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS
- **Recharts** - Chart visualizations
- **React-Leaflet** - Interactive maps
- **Framer Motion** - UI animations

### Backend & Deployment
- **Azure Functions (TypeScript)** - Serverless API
- **Azure Static Web Apps** - Frontend hosting
- **GitHub Actions** - CI/CD pipeline

---

## 📁 Struktur Folder

```
geoumkm-smart-3/
├── frontend/                    # Next.js 14 application (App Router)
│   ├── app/                     # App Router pages
│   │   ├── (landing)/           # Landing page routes
│   │   ├── (dashboard)/         # Dashboard routes
│   │   └── (auth)/              # Authentication routes
│   ├── components/              # React components
│   │   ├── landing/             # Landing page components
│   │   ├── dashboard/           # Dashboard components
│   │   └── chat/                # Chat panel components
│   ├── lib/                     # Utility functions & static data
│   ├── public/                  # Static assets
│   ├── package.json             # Dependencies
│   ├── next.config.js           # Next.js configuration
│   ├── tailwind.config.ts       # Tailwind CSS config
│   └── tsconfig.json            # TypeScript config
├── api/                         # Azure Functions (TypeScript)
│   ├── src/
│   │   ├── functions/           # Function endpoints
│   │   ├── data/                # Data loader
│   │   └── shared/              # Shared types & utilities
│   ├── host.json                # Functions host config
│   ├── package.json             # Dependencies
│   └── tsconfig.json            # TypeScript config
├── ml/                          # Machine Learning assets
│   ├── notebooks/               # Jupyter notebooks (01-08, berurutan)
│   ├── data/                    # Generated data & knowledge base
│   ├── models/                  # Trained model files (.joblib)
│   └── scripts/                 # ML pipeline build scripts
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md          # System architecture
│   ├── AZURE_SETUP_GUIDE.md     # Azure setup instructions
│   ├── PROJECT_STATUS_AND_ROADMAP.md
│   └── assets/                  # Documentation images & charts
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml  # CI/CD workflow
└── README.md                    # Project overview (this file)
```

---

## 🚀 Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/masbroustudio/geoumkm-smart-3.git
cd geoumkm-smart-3
```

### 2. Jalankan ML Notebooks

```bash
# Install Python dependencies
pip install pandas numpy scikit-learn xgboost lightgbm scipy matplotlib seaborn shapely nbformat nbconvert jupyter-client ipykernel

# Notebook HARUS dijalankan secara berurutan (01 -> 02 -> ... -> 08)
jupyter nbconvert --to notebook --execute ml/notebooks/01_Data_Foundation.ipynb
jupyter nbconvert --to notebook --execute ml/notebooks/02_EDA_Feature_Engineering.ipynb
jupyter nbconvert --to notebook --execute ml/notebooks/03_Location_Scoring_Model.ipynb
jupyter nbconvert --to notebook --execute ml/notebooks/04_Credit_Risk_Model.ipynb
jupyter nbconvert --to notebook --execute ml/notebooks/05_Clustering_Segmentation.ipynb
jupyter nbconvert --to notebook --execute ml/notebooks/06_Recommendation_WhatIf.ipynb
jupyter nbconvert --to notebook --execute ml/notebooks/07_LLM_RIG_Preparation.ipynb
jupyter nbconvert --to notebook --execute ml/notebooks/08_Executive_Summary.ipynb
```

> **Catatan:** Notebooks harus dijalankan secara berurutan karena setiap notebook menghasilkan file data (CSV) di folder `ml/data/` yang dibutuhkan oleh notebook berikutnya.

### 3. Jalankan Frontend (Development)

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend akan berjalan di `http://localhost:3000`.

### 4. Jalankan API (Development)

```bash
cd api
pnpm install
pnpm start
```

---

## 👤 Author

**Yudha Elfransyah**  
- Email: yudhae@gmail.com  
- GitHub: [masbroustudio](https://github.com/masbroustudio)

---

## 📜 Lisensi

MIT License - Lihat file [LICENSE](LICENSE) untuk detail.

---

*METC Datathon 2026 - Urban Resilience & Smart City*  
*Dicoding Submission*
