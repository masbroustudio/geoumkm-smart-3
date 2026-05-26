export interface ModelMetrics {
  auc_roc: number;
  ks_statistic: number;
  location_scoring_r2: number;
}

export interface ModelComparison {
  model_name: string;
  algorithm: string;
  target: string;
  auc_roc: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  key_features: string[];
}

export const modelMetrics: ModelMetrics = {
  auc_roc: 0.8303,
  ks_statistic: 0.6607,
  location_scoring_r2: 0.9999,
};

export const modelComparison: ModelComparison[] = [
  {
    model_name: 'Location Scoring',
    algorithm: 'XGBoost Regressor',
    target: 'Location Potential Score',
    auc_roc: 0.8303,
    accuracy: 0.94,
    precision: 0.92,
    recall: 0.91,
    f1_score: 0.915,
    key_features: ['Infrastructure Score', 'Digital Access', 'Market Proximity', 'Financial Access', 'Risk Index'],
  },
  {
    model_name: 'Credit Risk',
    algorithm: 'Logistic Regression',
    target: 'Probability of Default',
    auc_roc: 0.7856,
    accuracy: 0.88,
    precision: 0.86,
    recall: 0.84,
    f1_score: 0.85,
    key_features: ['Omset Bulanan', 'Tahun Berdiri', 'Location Score', 'Jumlah Karyawan', 'Digital Presence'],
  },
];
