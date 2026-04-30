# 🗺️ GeoUMKM Intelligence 3.0

> **AI-Powered Location Decision Support System for Indonesian MSMEs**  
> *Urban Resilience & Smart City — METC Datathon 2026*

![Dicoding](https://img.shields.io/badge/Dicoding-Submission-blue)
![Azure](https://img.shields.io/badge/Azure-Synapse%20%7C%20Static%20Web%20Apps-0078D4)
![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Deskripsi Proyek

**GeoUMKM Intelligence 3.0** adalah sistem intelijen lokasi berbasis **AI dan geospatial analytics** yang membantu:

- **UMKM** memilih lokasi usaha optimal dengan skor potensi sukses tinggi (45-95)
- **Pemerintah** (Kemenkop UKM & Pemda) mengidentifikasi 15 kecamatan prioritas untuk program KUR, SEHATI, dan pelatihan

Proyek ini dikembangkan menggunakan **6.000 data UMKM sintetis di Jawa Barat** dengan **18+ fitur advance** dan analisis statistik mendalam.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Advanced Geospatial Feature Engineering** | 18+ fitur (jarak ke pusat ekonomi, skor infrastruktur, cluster success rate, population density proxy, dll) |
| **K-Means Clustering** | 8 cluster dengan karakteristik unik untuk segmentasi wilayah |
| **Location Recommendation Engine** | Top 15 lokasi terbaik per jenis usaha (Makanan, Fashion, Kerajinan, Jasa, Pertanian) |
| **What-If Analysis Simulator** | Prediksi skor potensi untuk skenario lokasi baru |
| **Government Priority Dashboard** | 15 kecamatan dengan skor terendah + rekomendasi intervensi spesifik |
| **Analisis Statistik Mendalam** | Kruskal-Wallis, Tukey HSD, Regresi Linear Berganda, Effect Size (Cohen's d), Uji Normalitas |

---

## 🛠️ Technology Stack

- **Azure Synapse Analytics** — Big data processing & geospatial joins
- **Python** — XGBoost, Folium, Seaborn, SciPy, Statsmodels, Pandas
- **Apache Spark** — Distributed computing
- **Azure Static Web Apps** — Deployment & hosting
- **Jupyter Notebook** — Documentation & analysis

---

## 📁 Struktur Folder

---
```
geoumkm-intelligence-3.0/
├── notebooks/                    # Notebook Jupyter (.ipynb)
│   ├── 01_Data_Generation_v3_Realistic.ipynb
│   ├── 02_Clustering_Recommendation_v3.ipynb
│   ├── 03_Final_Summary_v3.ipynb
│   ├── 04_Visualisasi_Distribusi_Skor.ipynb
│   ├── 05_Analisis_Statistik_Mendalam_V3.ipynb
│   └── 06_Visualisasi_Lengkap_V3.ipynb
│
├── docs/                         # Dokumentasi HTML (export)
│   ├── 01_Data_Generation_v3_Realistic.html
│   ├── 02_Clustering_Recommendation_v3.html
│   ├── 03_Final_Summary_v3.html
│   ├── 04_Visualisasi_Distribusi_Skor.html
│   ├── 05_Analisis_Statistik_Mendalam_V3.html
│   └── 06_Visualisasi_Lengkap_V3.html
│
├── index.html                    # Dashboard utama (Azure Static Web Apps)
├── README.md
├── LICENSE
└── .gitignore
```
---


---

## 🚀 Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/username/geoumkm-intelligence-3.0.git
cd geoumkm-intelligence-3.0

# Buka semua notebook
code notebooks/

pip install jupyter nbconvert
jupyter nbconvert --to html notebooks/*.ipynb --output-dir docs/

# Buka index.html di browser
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux