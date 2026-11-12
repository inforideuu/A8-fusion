export const industriesData = [
  {
    id: 'government',
    slug: 'government',
    title: 'Government & Public Sector',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    tagline: 'Sovereign digital infrastructure, citizen portals, and civil administration systems.',
    overview: 'Modern governments require resilient, sovereign technology to serve millions of citizens, secure sensitive national data, and streamline public procurement. A8Fusion engineers digital citizen portals, e-governance backbones, and municipal management platforms that meet strict public audit benchmarks.',
    challenges: [
      'Fragmented departmental databases causing bureaucratic friction and delayed citizen services.',
      'Aging mainframe technologies vulnerable to cyber incidents and lacking modern API interfaces.',
      'Strict legislative mandates requiring local data sovereignty and non-proprietary vendor lock-in.'
    ],
    solutions: [
      'Unified Citizen Single Sign-On (SSO) & Digital ID verification portals.',
      'Automated municipal licensing, permitting, and e-tax collection engines.',
      'Sovereign cloud architectures deployed within domestic borders.'
    ],
    automation: 'Automating high-volume civil applications, business permits, and civil registry verifications through deterministic workflow engines.',
    analytics: 'National and municipal resource allocation dashboards, tax compliance forecasting, and public transit utilization telemetry.',
    useCases: [
      'Provincial government ministry deploying a centralized digital land record and title deed verification repository.',
      'Metropolitan municipal council implementing an integrated utility billing, property assessment, and citizen grievance system.'
    ]
  },
  {
    id: 'healthcare',
    slug: 'healthcare',
    title: 'Healthcare & Life Sciences',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    tagline: 'Clinical precision, interoperable EHR systems, and secure hospital administration.',
    overview: 'Healthcare institutions operate under zero-error tolerances. We engineer HIPAA and GDPR-aligned electronic health records (EHR), clinical trial data pipelines, and hospital operations systems that empower medical practitioners while safeguarding sensitive patient history.',
    challenges: [
      'Non-interoperable legacy medical devices and isolated departmental records (radiology, pathology, pharmacy).',
      'High administrative burden on clinical staff resulting in clinician burnout and manual charting errors.',
      'Stringent statutory compliance regarding patient health information privacy and audit accessibility.'
    ],
    solutions: [
      'HL7 and FHIR-compliant enterprise medical record core with doctor tablet interfaces.',
      'AI-assisted clinical transcription and intelligent prescription cross-checks for drug interactions.',
      'Automated health insurance pre-authorization and multi-payer claims settlement engine.'
    ],
    automation: 'Automated inpatient bed assignment, triage queuing, pathology test routing, and post-discharge follow-up schedules.',
    analytics: 'Hospital capacity forecasts, surgical theatre utilization rates, infection outbreak tracking, and clinical outcomes telemetry.',
    useCases: [
      'Multi-campus tertiary hospital network replacing legacy paper charts with encrypted, tablet-based clinical order entry.',
      'Diagnostic pathology laboratory chain synchronizing automated analyzer outputs with immediate SMS/Email patient portals.'
    ]
  },
  {
    id: 'education',
    slug: 'education',
    title: 'Education & Universities',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    tagline: 'Campus-wide enterprise resource planning, student lifecycles, and institutional analytics.',
    overview: 'Colleges, multi-campus university systems, and national education boards need modern platforms to govern admissions, tuition, faculty workloads, and hybrid learning. A8Fusion delivers institutional ERP suites tailored for academic rigor and accreditation standards.',
    challenges: [
      'Disjointed student records spanning admissions, course registration, housing, and alumni relations.',
      'Complex faculty workload calculations, research grant tracking, and regulatory accreditation audits.',
      'Outdated legacy portals causing server crashes during high-traffic course registration periods.'
    ],
    solutions: [
      'Integrated Student Information System (SIS) managing the entire lifecycle from matriculation to alumni endowment.',
      'Automated credit transfer evaluation, degree audit engine, and prerequisite validation.',
      'Campus financial ledger supporting financial aid disbursement, installment billing, and research grant compliance.'
    ],
    automation: 'Automated examination scheduling, grade curve computations, transcript generation, and student clearance workflows.',
    analytics: 'Student retention risk models, course demand forecasting, campus facility utilization, and faculty research output tracking.',
    useCases: [
      'Polytechnic university institute unifying 24 departmental faculties onto a single unified student lifecycle and examination portal.',
      'Private education group managing 15 schools with automated fee collection, biometric attendance, and parent communication apps.'
    ]
  },
  {
    id: 'manufacturing',
    slug: 'manufacturing',
    title: 'Manufacturing & Industry 4.0',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    tagline: 'Shop floor automation, IoT telemetry, and agile supply chain synchronization.',
    overview: 'Modern manufacturing demands real-time synchronization between the factory floor and executive planning. A8Fusion develops Manufacturing Execution Systems (MES), batch-tracking pipelines, and equipment maintenance algorithms that curb downtime and optimize raw material yields.',
    challenges: [
      'Unplanned machine breakdowns halting high-throughput production lines and causing delivery penalties.',
      'Lack of real-time visibility into WIP (Work In Progress) inventories across multiple plant facilities.',
      'Manual quality inspection bottlenecks failing to detect micro-defects before packaging.'
    ],
    solutions: [
      'Industrial IoT sensor integration capturing temperature, vibration, and cycles per minute in real time.',
      'Computer vision inspection stations identifying material anomalies at millisecond latency.',
      'Dynamic production scheduling recalculating batch orders based on material arrivals and machine readiness.'
    ],
    automation: 'Automated machine maintenance work orders triggered by sensor anomaly detection, reducing catastrophic mechanical failures.',
    analytics: 'Overall Equipment Effectiveness (OEE) metrics, scrap rate analysis, energy consumption per unit, and supply lead-time predictions.',
    useCases: [
      'Automotive parts fabrication plant tracking raw alloy usage, stamping press metrics, and batch quality certification.',
      'Pharmaceutical packaging facility maintaining 100% FDA 21 CFR Part 11 electronic batch records and audit logs.'
    ]
  },
  {
    id: 'construction',
    slug: 'construction',
    title: 'Construction & Capital Infrastructure',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    tagline: 'Job costing, sub-contractor coordination, and site progress intelligence.',
    overview: 'Large-scale civil infrastructure and commercial high-rises run on tight margins and complex contractual milestones. We engineer enterprise construction platforms that connect site supervisors with executive controllers, preventing budget overruns and schedule slippage.',
    challenges: [
      'Severe cost slippage caused by delayed communication between field sites and corporate finance.',
      'Sub-contractor non-compliance, missing safety certifications, and unverified change orders.',
      'Manual, inaccurate quantity surveying leading to material over-ordering and site wastage.'
    ],
    solutions: [
      'Digital Bill of Quantities (BoQ) tracking real-time material variance against tender estimates.',
      'Mobile site logs with GPS timestamps, geo-fenced worker check-ins, and photo evidence archives.',
      'Sub-contractor pre-qualification and certified payment application workflows.'
    ],
    automation: 'Automating progress billing milestones, interim payment certificates (IPC), and non-conformance notice escalations.',
    analytics: 'Earned Value Management (EVM), critical path delay forecasting, subcontractor productivity, and heavy machinery fuel telemetry.',
    useCases: [
      'High-speed rail contractor tracking earthmoving progress, ballast procurement, and engineering sign-offs along 200km corridor.',
      'Commercial property group managing simultaneous construction of three mixed-use urban towers with shared sub-contractors.'
    ]
  },
  {
    id: 'logistics',
    slug: 'logistics',
    title: 'Logistics & Transportation',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    tagline: 'Fleet telemetry, warehouse routing, and cross-border customs clearing.',
    overview: 'Supply chains survive on predictability. A8Fusion delivers enterprise freight tracking, automated dispatch routing, and customs documentation platforms that provide continuous visibility across ports, distribution hubs, and last-mile delivery fleets.',
    challenges: [
      'Empty return miles and inefficient route planning driving fuel expenses higher.',
      'Cross-border customs documentation delays trapping freight containers at port checkpoints.',
      'Lack of end-to-end milestone visibility for enterprise B2B cargo consignments.'
    ],
    solutions: [
      'Real-time GPS and IoT telemetry ingesting truck coordinates, reefer temperatures, and driver driving hours.',
      'Automated multi-carrier dispatch optimization matching load requirements with available capacity.',
      'Digital customs declaration filing with pre-validated tariff codes and electronic bills of lading.'
    ],
    automation: 'Automated detention and demurrage alert triggers, electronic proof-of-delivery (ePOD) capture, and dynamic route re-dispatching.',
    analytics: 'Cost-per-ton-mile analytics, on-time in-full (OTIF) fulfillment scores, driver safety scoring, and warehouse dwell-time telemetry.',
    useCases: [
      'Regional cold-chain logistics provider monitoring perishable pharmaceuticals across Southeast Asian border crossings.',
      'Container terminal logistics operator coordinating intermodal rail transfers with direct vessel loading schedules.'
    ]
  },
  {
    id: 'banking-finance',
    slug: 'banking-finance',
    title: 'Banking & Financial Services',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    tagline: 'Core banking integration, fraud detection, and regulatory compliance infrastructure.',
    overview: 'Financial institutions operate under microscopic regulatory scrutiny and zero fault tolerance. We build secure integration middleware, treasury risk engines, and sovereign banking platforms that protect capital, automate compliance, and enable modern fintech integration.',
    challenges: [
      'Fragile decades-old core banking mainframes that make launching new digital products slow and risky.',
      'Escalating compliance overhead for Anti-Money Laundering (AML), Know Your Customer (KYC), and Basel III.',
      'Increasing frequency and sophistication of financial transaction fraud and credential stuffing.'
    ],
    solutions: [
      'High-throughput message brokers insulating legacy core ledgers while exposing modern Open Banking APIs.',
      'Real-time transaction fraud scoring utilizing behavioral anomaly models and biometric authentication.',
      'Automated regulatory reporting pipelines generating compliant disclosures for central bank auditors.'
    ],
    automation: 'Automating customer KYC document verification, corporate credit limit scoring, and multi-currency reconciliation.',
    analytics: 'Liquidity risk modeling, value-at-risk (VaR) calculations, credit default probability, and customer lifetime profitability.',
    useCases: [
      'Regional commercial bank launching an Open Banking API developer portal while preserving legacy core mainframe stability.',
      'Treasury operations desk managing automated foreign exchange cross-hedging and inter-account sweep liquidity.'
    ]
  },
  {
    id: 'real-estate',
    slug: 'real-estate',
    title: 'Real Estate & Asset Portfolios',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    tagline: 'Institutional lease accounting, tenant relationship portals, and property facility telemetry.',
    overview: 'Real estate investment trusts (REITs) and property asset managers manage multi-billion portfolios requiring strict lease accounting, automated rent collections, and facility efficiency. A8Fusion builds enterprise platforms engineered for institutional property owners.',
    challenges: [
      'Complex multi-tier commercial lease structures with variable turnover rents and index-linked escalations.',
      'Disjointed facility maintenance requests resulting in tenant dissatisfaction and premature asset deterioration.',
      'Cumbersome manual reconciliation of tenant utility meters, common area maintenance (CAM), and insurance certificates.'
    ],
    solutions: [
      'IFRS 16 / ASC 842 compliant lease accounting engine automating amortization schedules and contract modifications.',
      'Institutional tenant portals for service requests, visitor security access, and electronic lease renewals.',
      'Smart building IoT telemetry monitoring HVAC energy loads, water meters, and chiller efficiencies.'
    ],
    automation: 'Automated monthly rent invoice runs, recurring CPI lease indexation recalculations, and automated tenant payment receipts.',
    analytics: 'Portfolio vacancy forecasts, net effective rent yield per square meter, tenant credit risk scoring, and facility energy benchmarks.',
    useCases: [
      'Commercial REIT managing 45 Grade-A office towers across 3 capital cities with consolidated multi-currency reporting.',
      'Industrial business park operating unified tenant gate access, logistics loading bay reservations, and sub-metered power billing.'
    ]
  },
  {
    id: 'energy-utilities',
    slug: 'energy-utilities',
    title: 'Energy & Public Utilities',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    tagline: 'Grid telemetry, outage dispatch, smart metering, and public infrastructure governance.',
    overview: 'Power grids, municipal water networks, and renewable assets demand unbreakable operational technology. A8Fusion delivers industrial software that bridges SCADA telemetry with billing, customer communication, and field repair crew coordination.',
    challenges: [
      'Massive influx of distributed renewable energy sources destabilizing traditional centralized grid planning.',
      'Aging physical infrastructure requiring predictive maintenance before critical substations fail.',
      'Extreme weather events causing widespread outages that overwhelm legacy dispatch call centers.'
    ],
    solutions: [
      'High-throughput time-series telemetry pipelines processing millions of smart meter pings per minute.',
      'Automated Outage Management System (OMS) identifying fault isolations and dispatching nearest field engineers.',
      'Municipal water distribution leakage detection combining hydraulic pressure models with acoustic sensor data.'
    ],
    automation: 'Automated field technician work orders based on substation temperature anomalies, preventing transformer burnouts.',
    analytics: 'Peak load demand forecasting, renewable generation curtailment projections, and water loss (non-revenue water) heatmaps.',
    useCases: [
      'State electricity distributor deploying smart meter infrastructure and real-time customer outage maps for 2.5 million households.',
      'Solar utility farm operator integrating 400MW inverter telemetry into a centralized performance optimization console.'
    ]
  }
];

