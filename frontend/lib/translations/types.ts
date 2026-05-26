export interface TranslationKeys {
  // Sidebar navigation
  sidebar: {
    overview: string;
    creditScoring: string;
    portfolioAnalytics: string;
    locationIntelligence: string;
    umkmDirectory: string;
    clustering: string;
    policySimulation: string;
    reports: string;
    modelDocs: string;
    settings: string;
  };
  // Dashboard common labels
  dashboard: {
    title: string;
    totalUmkm: string;
    avgScore: string;
    highRiskAreas: string;
    survivalRate: string;
    mapView: string;
    markers: string;
    heatmap: string;
    export: string;
    download: string;
    generate: string;
    lightMode: string;
    darkMode: string;
    exportScoreDistribution: string;
    exportTopKabupaten: string;
    exportClusterDistribution: string;
  };
  // Landing page
  landing: {
    hero: {
      title: string;
      titleHighlight: string;
      titleSuffix: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      statUmkm: string;
      statKecamatan: string;
      statKabKota: string;
      statAiModels: string;
    };
    navbar: {
      features: string;
      forWho: string;
      technology: string;
      pricing: string;
      cta: string;
    };
    features: {
      heading: string;
      subheading: string;
      creditScoring: { title: string; description: string };
      locationIntelligence: { title: string; description: string };
      clustering: { title: string; description: string };
      policySimulation: { title: string; description: string };
      aiChat: { title: string; description: string };
      executiveReports: { title: string; description: string };
    };
    forWho: {
      heading: string;
      subheading: string;
      bankLabel: string;
      governmentLabel: string;
      investorLabel: string;
      bank: {
        title: string;
        subtitle: string;
        benefits: string[];
        cta: string;
      };
      government: {
        title: string;
        subtitle: string;
        benefits: string[];
        cta: string;
      };
      investor: {
        title: string;
        subtitle: string;
        benefits: string[];
        cta: string;
      };
    };
    pricing: {
      heading: string;
      subheading: string;
      starter: {
        name: string;
        description: string;
        features: string[];
        cta: string;
      };
      professional: {
        name: string;
        description: string;
        badge: string;
        features: string[];
        cta: string;
      };
      enterprise: {
        name: string;
        description: string;
        price: string;
        features: string[];
        cta: string;
      };
    };
    footer: {
      description: string;
      product: string;
      company: string;
      companyAbout: string;
      companyCareer: string;
      companyBlog: string;
      companyContact: string;
      legal: string;
      legalPrivacy: string;
      legalTerms: string;
      legalSla: string;
      copyright: string;
    };
  };
  // Chat panel
  chat: {
    title: string;
    subtitle: string;
    placeholder: string;
    personaBank: string;
    personaGovernment: string;
    personaInvestor: string;
  };
}
