export const projects = [
  {
    title: "StrideGuard (Mobile Physio)",
    description:
      "Cross-platform app computing drop angle/time and motor velocity from smartphone sensors; offline-first with local DB.",
    tech: ["Flutter", "Sensors", "SQLite"],
    repo: "https://github.com/MaybeParth/RLD_mobile/tree/master",
  },
  {
    title: "E-Commerce (Spring Boot)",
    description:
      "Product catalog, cart, checkout, and order tracking with PostgreSQL & Redis caching.",
    tech: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
    repo: "https://github.com/yourname/shop",
  },
  {
    title: "Flight Delay ML",
    description:
      "Built features from BTS + weather data; trained gradient models; exported explainable dashboards.",
    tech: ["Python", "pandas", "scikit-learn"],
    repo: "https://github.com/NiranjanBalasubramani/flight-predictor",
  },
];

export const experiences = [
  {
    company: "Syracuse University",
    role: "Software Developer",
    period: "Feb 2025 – Present",
    location: "Syracuse, NY",
    highlights: [
      "Developing a cross-platform physiotherapy app for NHRL Lab using React Native and smartphone sensors to compute Drop Angle, Drop Time, and Motor Velocity; designed to serve 1,000+ clinicians while reducing hardware costs by ~$5,000 through smartphone-based testing.",
      "Architected a versioned local patient database using react-native-async-storage and react-native-fs for seamless offline access to 100,000+ records, reducing data retrieval latency by ~40%."
    ]
  },
  {
    company: "Syracuse University",
    role: "Research Assistant",
    period: "Feb 2025 – Present",
    location: "Syracuse, NY",
    highlights: [
      "Built an R-based pipeline with minfi to preprocess and normalize DNA methylation data spanning 450,000+ CpG sites across 100+ clinical samples.",
      "Performed QC with wateRmelon (filtering 12,000+ unreliable probes, correcting batch effects) and created 20+ ggplot2 visualizations to support differential methylation analysis."
    ]
  },
  {
    company: "MTX Group, Inc.",
    role: "Software Developer Intern",
    period: "May 2024 – Aug 2024",
    location: "Schenectady, NY",
    highlights: [
      "Developed modular LWCs and Apex classes to streamline service workflows—cutting redundant clicks by ~40% and accelerating adoption across 120+ internal users.",
      "Implemented Apex Batch jobs to process 100k+ records asynchronously with checkpointing and error handling—reducing execution time by ~80% and saving ~$25,000/month in manual support costs.",
      "Designed Round Robin case assignment (Apex + custom queues, Service Cloud) to automate distribution, improving first-response SLAs by ~30% and reducing manual triaging."
    ]
  },
  {
    company: "Speech Markers Pvt. Ltd.",
    role: "Software Developer Intern",
    period: "May 2023 – Jul 2023",
    location: "Pune, MH, India",
    highlights: [
      "Led a Flutter app integrated with KOHA via REST APIs; collaborated with two senior engineers to support growing student engagement.",
      "Built reusable widgets and integrated SQLite for robust offline catalog/loan access—powering seamless usage for 10,000+ students.",
      "Implemented CI/CD with GitHub Actions to automate build/test/deploy—reducing manual release overhead by ~90% and accelerating feature delivery.",
      "Revamped architecture with Provider and optimized DB queries—shrinking app size by ~70%, lowering latency by ~20%, and scaling smoothly under ~5× data growth."
    ]
  }
];

