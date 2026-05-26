'use client';

import { BookOpen, CheckCircle, XCircle } from 'lucide-react';

export default function ModelDocsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-7 h-7 text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-white">Model Documentation</h1>
          <p className="text-sm text-slate-400">Comprehensive documentation of GeoUMKM AI models and pipeline</p>
        </div>
      </div>

      {/* Model Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Model Cards</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Location Scoring Model */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-semibold text-accent">Location Scoring Model</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Algorithm</span>
                <span className="text-white font-medium">XGBoost Regressor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Purpose</span>
                <span className="text-white font-medium">Predict location potential score</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Training Samples</span>
                <span className="text-white font-medium">8,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Test Samples</span>
                <span className="text-white font-medium">2,000</span>
              </div>
              <hr className="border-slate-700" />
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Performance Metrics</h4>
              <div className="flex justify-between">
                <span className="text-slate-400">RMSE</span>
                <span className="text-green-400 font-medium">0.1654</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MAE</span>
                <span className="text-green-400 font-medium">0.0805</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">R2 Score</span>
                <span className="text-green-400 font-medium">0.9999</span>
              </div>
            </div>
          </div>

          {/* Credit Risk Model */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-semibold text-accent">Credit Risk Model</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Algorithm</span>
                <span className="text-white font-medium">Logistic Regression</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Purpose</span>
                <span className="text-white font-medium">Estimate Probability of Default (PD)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Portfolio Size</span>
                <span className="text-white font-medium">10,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Score Bands</span>
                <span className="text-white font-medium">7</span>
              </div>
              <hr className="border-slate-700" />
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Performance Metrics</h4>
              <div className="flex justify-between">
                <span className="text-slate-400">AUC-ROC</span>
                <span className="text-green-400 font-medium">0.8303</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">KS Statistic</span>
                <span className="text-green-400 font-medium">0.6607</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Impact Summary */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Business Impact Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Government */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-blue-400">Government</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">UMKM Impacted</span>
                <span className="text-white font-medium">7,987</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">New Viable Locations</span>
                <span className="text-white font-medium">583</span>
              </div>
            </div>
          </div>

          {/* Banking */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-green-400">Banking</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">NPL Reduction</span>
                <span className="text-white font-medium">9.61%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Potential KUR Recipients</span>
                <span className="text-white font-medium">1,749</span>
              </div>
            </div>
          </div>

          {/* Investors */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-purple-400">Investors</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Market Size (Annual)</span>
                <span className="text-white font-medium">Rp 7,024.9M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Top Cluster Score</span>
                <span className="text-white font-medium">0.9623</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Pipeline Overview */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Data Pipeline Overview</h2>
        <div className="glass-card p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 text-slate-400 font-medium">Notebook</th>
                <th className="text-left py-2 text-slate-400 font-medium">Name</th>
                <th className="text-left py-2 text-slate-400 font-medium">Output</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-xs text-accent">NB01</td>
                <td className="py-2">Data Collection</td>
                <td className="py-2">Raw UMKM dataset (10,000 records)</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-xs text-accent">NB02</td>
                <td className="py-2">Data Preprocessing</td>
                <td className="py-2">Cleaned and normalized features</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-xs text-accent">NB03</td>
                <td className="py-2">Feature Engineering</td>
                <td className="py-2">37 engineered features, location scores</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-xs text-accent">NB04</td>
                <td className="py-2">Clustering</td>
                <td className="py-2">K-Means (5 clusters) + DBSCAN (408 spatial clusters)</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-xs text-accent">NB05</td>
                <td className="py-2">Prediction Model</td>
                <td className="py-2">XGBoost location scoring model</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-xs text-accent">NB06</td>
                <td className="py-2">Recommendation Engine</td>
                <td className="py-2">Counterfactual analysis, policy simulations</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 font-mono text-xs text-accent">NB07</td>
                <td className="py-2">Knowledge Base</td>
                <td className="py-2">RAG knowledge base for AI chat</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-xs text-accent">NB08</td>
                <td className="py-2">Model Evaluation</td>
                <td className="py-2">Executive summary, model cards, final metrics</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Model Limitations & Ethical Considerations */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Model Limitations & Ethical Considerations</h2>
        <div className="glass-card p-5 space-y-3">
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">&#9888;</span>
              <span><strong className="text-white">Synthetic Data:</strong> All models are trained on synthetic data generated for West Java province. Performance on real-world data may differ.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">&#9888;</span>
              <span><strong className="text-white">Geographic Bias:</strong> Model performance is biased toward urban areas (Bekasi, Bandung, Depok) where training data density is higher.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">&#9888;</span>
              <span><strong className="text-white">Not for Individual Decisions:</strong> The credit risk model is not suitable for individual lending decisions without human review. It is designed for portfolio-level analysis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">&#9888;</span>
              <span><strong className="text-white">Regular Retraining Needed:</strong> Models should be retrained when real data becomes available and periodically to account for changing economic conditions.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Deployment Readiness Checklist */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Deployment Readiness Checklist</h2>
        <div className="glass-card p-5">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-slate-300">Models serialized and versioned</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-slate-300">API designed and documented</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-slate-300">Monitoring concept defined</span>
            </div>
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-slate-300">Real data integrated</span>
            </div>
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-slate-300">Production deployed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
