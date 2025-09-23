export const projects = [
  {
    title: "StrideGuard (Mobile Physio)",
    description: "Smartphone-sensor physio tests with offline patient DB.",
    tech: ["Flutter", "Sensors", "SQLite"],
    repo: "https://github.com/MaybeParth/RLD_mobile/tree/master",                 
    image: "/projects/strideguard.jpeg",               // optional (put under /public/projects/)
  },
  {
    title: "Ourlib",
    description: "Catalog, cart, checkout, and order tracking.",
    tech: ["JavaScript", "ReactJS", "SQlite", "Firebase"],
    repo: "https://github.com/MaybeParth/ourlib",
    link: "https://play.google.com/store/search?q=ourlib&c=apps&hl=en_US",
    image: "/projects/ourlib.jpeg",
  },
  {
    title: "Flight Delay ML",
    description: "Feature engineering on BTS + weather; interpretable models.",
    tech: ["Python", "pandas", "scikit-learn"],
    repo: "https://github.com/NiranjanBalasubramani/flight-predictor",
    image: "/projects/flight.png",
  },
  // {
  //   title: "E-Commerce (Spring Boot)",
  //   description: "Catalog, cart, checkout, and order tracking.",
  //   tech: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
  //   repo: "https://github.com/yourname/shop",
  //   //image: "/projects/shop.png",
  // },
  
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

// src/lib/data.ts
export const skills = [
  { text: "Next.js", value: 80 },
  { text: "React", value: 90 },
  { text: "TypeScript", value: 85 },
  { text: "Tailwind CSS", value: 70 },
  { text: "Node.js", value: 75 },
  { text: "Express", value: 55 },
  { text: "PostgreSQL", value: 60 },
  { text: "Redis", value: 45 },
  { text: "React Native", value: 70 },
  { text: "Flutter", value: 65 },
  { text: "Dart", value: 65 },
  { text: "Java", value: 70 },
  { text: "Selenium", value: 60 },
  { text: "Salesforce", value: 55 },
  { text: "LWC", value: 55 },
  { text: "Jenkins", value: 55 },
  { text: "Python", value: 70 },
  { text: "scikit-learn", value: 50 },
  { text: "Git", value: 60 },
  { text: "AWS", value: 55 },
  { text: "Docker", value: 50 },
];

