export const servicesData = [
  {
    id: 'enterprise-software-development',
    slug: 'enterprise-software-development',
    title: 'Enterprise Software Development',
    tagline: 'Engineering resilient, scalable core platforms for mission-critical operations.',
    heroSubtitle: 'We architect and build robust multi-tenant platforms, enterprise workflows, and high-concurrency systems engineered to endure regulatory scrutiny and exponential growth.',
    overview: 'A8Fusion designs and constructs enterprise application suites for complex organizations requiring zero-downtime reliability, strict compliance, and high throughput. Our engineering culture balances sophisticated architectural patterns with practical operational discipline.',
    capabilities: [
      'Multi-tenant Cloud Architectures & Distributed Systems',
      'Custom Multi-Branch & Multi-Entity Business Engines',
      'Enterprise Workflow Automation & Rule Orchestration',
      'High-Throughput RESTful & GraphQL API Gateways',
      'Legacy Monolith Decomposition & Microservices Migration',
      'Secure Enterprise Mobile & Desktop Workstations',
      'Role-Based Granular Access Control (RBAC) & ABAC',
      'Third-Party Systems & Enterprise Service Bus Integration'
    ],
    challenges: [
      {
        title: 'Architectural Fragility Under Load',
        description: 'Legacy platforms often fail when user concurrency or transaction volumes surge during operational peaks.'
      },
      {
        title: 'Disjointed Departmental Silos',
        description: 'Disparate line-of-business tools hinder real-time executive visibility and duplicate data management costs.'
      },
      {
        title: 'Regulatory & Data Sovereignty Mandates',
        description: 'Cross-border institutions face stringent compliance audits that standard off-the-shelf software cannot satisfy.'
      }
    ],
    approach: [
      { step: '01', title: 'Domain-Driven Modeling', desc: 'Isolating bounded contexts and mission-critical domain logic prior to writing a line of code.' },
      { step: '02', title: 'Modular Architecture', desc: 'Implementing decoupled event-driven services with clear contract definitions and fallback resiliency.' },
      { step: '03', title: 'Security by Design', desc: 'Embedding cryptographic data verification, static code analysis, and automated vulnerability scanning.' },
      { step: '04', title: 'Continuous Observability', desc: 'Integrating distributed tracing, latency profiling, and real-time operational telemetry from day one.' }
    ],
    technologies: ['Java / Spring Boot', 'Node.js / TypeScript', 'Go', 'Python', '.NET Core', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes'],
    industries: ['Banking & Financial Services', 'Government & Public Sector', 'Manufacturing & Logistics', 'Healthcare'],
    faqs: [
      {
        q: 'How does A8Fusion ensure zero downtime during major system updates?',
        a: 'We leverage blue-green and canary deployment pipelines backed by backward-compatible database schemas and distributed message brokers to ensure continuous service availability.'
      },
      {
        q: 'Can A8Fusion build upon our existing proprietary codebase?',
        a: 'Yes. We conduct rigorous architectural audits to isolate technical debt, refactor high-risk modules, and establish clean API interfaces for incremental modernization.'
      }
    ]
  },
  {
    id: 'artificial-intelligence',
    slug: 'artificial-intelligence',
    title: 'AI & Machine Learning',
    tagline: 'Private, sovereign, and precision intelligence for the modern enterprise.',
    heroSubtitle: 'Deploy sovereign large language models, predictive intelligence pipelines, and intelligent document extraction engines behind your secure corporate perimeter.',
    overview: 'We bridge foundational AI research and enterprise production. From private LLMs fine-tuned on corporate repositories to automated decision-support algorithms, our AI systems are designed for traceability, explainability, and governance.',
    capabilities: [
      'Private Enterprise Large Language Models (LLM) & RAG Systems',
      'Cognitive Document Processing & Automated Information Extraction',
      'Predictive Analytics for Supply Chain & Asset Maintenance',
      'Autonomous Enterprise Workflows & Intelligent Agent Orchestration',
      'Natural Language Interfaces for Core Business Databases',
      'Fraud Detection, Anomaly Detection & Risk Scoring Engines',
      'Computer Vision for Industrial Inspection & Quality Verification',
      'Ethical AI Governance, Hallucination Guards & Model Auditing'
    ],
    challenges: [
      {
        title: 'Data Privacy & Intellectual Property Leakage',
        description: 'Enterprises cannot risk public AI clouds consuming confidential corporate documents or citizen records.'
      },
      {
        title: 'Hallucinations in Critical Workflows',
        description: 'Unverified generative AI outputs can result in severe financial, legal, or operational compliance errors.'
      },
      {
        title: 'Lack of Domain Context',
        description: 'Generic commercial AI models lack deep familiarity with enterprise taxonomy, contracts, and legacy records.'
      }
    ],
    approach: [
      { step: '01', title: 'Data Readiness & Curating', desc: 'Auditing data assets, sanitizing sensitive identifiers, and building vector embeddings within your VPC.' },
      { step: '02', title: 'Private Model Selection', desc: 'Deploying open-weights sovereign models or private hosted endpoints guarded by VPC firewalls.' },
      { step: '03', title: 'Deterministic Grounding', desc: 'Implementing Retrieval-Augmented Generation (RAG) with citation trails and validation layers.' },
      { step: '04', title: 'Supervised Evaluation', desc: 'Continuous benchmark testing against proprietary domain test suites to guarantee accuracy.' }
    ],
    technologies: ['Python', 'PyTorch', 'Hugging Face', 'LangChain', 'LlamaIndex', 'vLLM', 'Ollama / DeepSeek', 'Qdrant', 'Milvus', 'Ray'],
    industries: ['Government', 'Healthcare', 'Banking & Finance', 'Legal & Institutional'],
    faqs: [
      {
        q: 'Are our internal corporate documents used to train public AI models?',
        a: 'Never. All A8Fusion AI solutions operate within your isolated cloud tenant or private data center. Data is never shared or transmitted to external AI providers.'
      },
      {
        q: 'What is the typical timeframe for a private enterprise AI deployment?',
        a: 'A scoped Retrieval-Augmented Generation (RAG) pilot is typically deployed in 4 to 6 weeks, followed by enterprise integration and user training.'
      }
    ]
  },
  {
    id: 'cloud-infrastructure',
    slug: 'cloud-infrastructure',
    title: 'Cloud & Infrastructure',
    tagline: 'High-availability multi-cloud architecture and sovereign digital infrastructure.',
    heroSubtitle: 'Designing, deploying, and maintaining high-throughput cloud environments across AWS, Azure, and private sovereign data centers.',
    overview: 'We establish secure, cost-optimized, and resilient cloud architectures engineered for multi-region failover, sovereign data residence, and continuous compliance. Our engineers treat infrastructure strictly as code.',
    capabilities: [
      'Multi-Cloud Strategy & Architecture (AWS, Microsoft Azure, GCP)',
      'Automated Infrastructure as Code (Terraform, Pulumi, Ansible)',
      'Sovereign Cloud Deployments & Local Data Residency Alignment',
      'Container Orchestration (Kubernetes, OpenShift, Nomad)',
      'Continuous Integration & Continuous Delivery (CI/CD Pipelines)',
      'FinOps Cloud Cost Optimization & Capacity Governance',
      'Disaster Recovery Planning & Automated Geo-Redundant Failover',
      '24/7 SRE Telemetry, Distributed Tracing & Synthetic Monitoring'
    ],
    challenges: [
      {
        title: 'Runaway Cloud Expenditures',
        description: 'Unmonitored cloud resources and over-provisioned instances inflate enterprise infrastructure budgets exponentially.'
      },
      {
        title: 'Regional Outages & Single Points of Failure',
        description: 'Relying on single availability zones exposes mission-critical enterprise workflows to catastrophic downtime.'
      },
      {
        title: 'Deployment Bottlenecks',
        description: 'Manual release workflows impede agility and introduce configuration drift between staging and production.'
      }
    ],
    approach: [
      { step: '01', title: 'Infrastructure Baseline', desc: 'Conducting well-architected reviews across security, reliability, performance, and cost pillars.' },
      { step: '02', title: 'Declarative IaC', desc: 'Codifying all networking, storage, compute, and IAM policies into audited versioned repositories.' },
      { step: '03', title: 'Automated Hardening', desc: 'Enforcing CIS benchmarks, network egress limits, and end-to-end TLS encryption in transit and at rest.' },
      { step: '04', title: 'Observability & Runbooks', desc: 'Deploying automated self-healing clusters, incident runbooks, and Prometheus/Grafana monitors.' }
    ],
    technologies: ['AWS', 'Microsoft Azure', 'Terraform', 'Kubernetes', 'Docker', 'Prometheus', 'Grafana', 'GitLab CI', 'ArgoCD', 'Cloudflare'],
    industries: ['Government', 'Banking & Finance', 'E-Commerce', 'Telecom'],
    faqs: [
      {
        q: 'Can A8Fusion assist with sovereign cloud compliance for government clients?',
        a: 'Yes. We architect sovereign configurations utilizing domestic data regions and isolated government cloud enclaves with strict data residency boundaries.'
      },
      {
        q: 'How does your FinOps service reduce cloud expenditure?',
        a: 'We eliminate idle capacity, right-size compute instances, implement automated auto-scaling, and leverage savings plans, often reducing total cloud spend by 25% to 40%.'
      }
    ]
  },
  {
    id: 'cybersecurity',
    slug: 'cybersecurity',
    title: 'Cybersecurity & Governance',
    tagline: 'Zero-trust defense engineering for institutional resilience and data protection.',
    heroSubtitle: 'Protect critical digital assets, prevent unauthorized infiltration, and ensure full compliance with international security standards and data protection frameworks.',
    overview: 'Our cybersecurity practice builds resilience into every layer of enterprise software and infrastructure. We operate under the rigorous premise of zero-trust: verify explicitly, grant least-privilege access, and assume breach.',
    capabilities: [
      'Enterprise Zero-Trust Architecture Design & Implementation',
      'Comprehensive Application Security Testing (SAST, DAST, SCA)',
      'Cloud Security Posture Management & Configuration Auditing',
      'Identity & Access Management (IAM), SSO, & MFA Orchestration',
      'Hardware Security Module (HSM) & Cryptographic Key Management',
      'Data Loss Prevention (DLP) & End-to-End Enterprise Encryption',
      'Threat Modeling, Vulnerability Assessments & Penetration Testing',
      'ISO 27001, SOC 2, HIPAA & GDPR Governance Frameworks'
    ],
    challenges: [
      {
        title: 'Sophisticated Targeted Threats',
        description: 'Enterprises face advanced persistent threats (APTs) seeking unauthorized access to corporate IP and citizen data.'
      },
      {
        title: 'Shadow IT & Unmonitored Endpoints',
        description: 'Proliferation of unauthorized internal tools creates invisible backdoors into corporate infrastructure.'
      },
      {
        title: 'Strict Regulatory Penalties',
        description: 'Breaches of data protection laws trigger severe legal penalties, client loss, and catastrophic reputational damage.'
      }
    ],
    approach: [
      { step: '01', title: 'Threat Surface Audit', desc: 'Mapping all entry vectors, internal API endpoints, databases, and third-party dependency vectors.' },
      { step: '02', title: 'Zero-Trust Architecture', desc: 'Replacing broad network perimeters with micro-segmented, identity-verified trust boundaries.' },
      { step: '03', title: 'Continuous Validation', desc: 'Executing automated vulnerability scanners, red-team simulations, and strict static analysis.' },
      { step: '04', title: 'Incident Response Protocol', desc: 'Formulating automated containment protocols, forensic logging, and regulatory notification procedures.' }
    ],
    technologies: ['HashiCorp Vault', 'Okta / Keycloak', 'Wazuh', 'SonarQube', 'CrowdStrike', 'OWASP ZAP', 'Trivy', 'OpenVAS', 'Snort'],
    industries: ['Government & Public Sector', 'Banking & Finance', 'Healthcare', 'Energy & Utilities'],
    faqs: [
      {
        q: 'Which security services are delivered directly vs through accredited partners?',
        a: 'A8Fusion handles all secure software engineering, architecture, code audits, and zero-trust IAM in-house. Specialist military-grade penetration testing and accredited SOC audits are conducted alongside vetted, accredited testing partners.'
      },
      {
        q: 'Can you assist our team in achieving ISO 27001 certification?',
        a: 'Yes. We prepare the complete technical infrastructure, access controls, audit logs, and technical documentation required for ISO 27001 readiness.'
      }
    ]
  },
  {
    id: 'system-integration',
    slug: 'system-integration',
    title: 'Enterprise System Integration',
    tagline: 'Unifying disparate enterprise software into synchronized, real-time ecosystem.',
    heroSubtitle: 'Eliminate information fragmentation by connecting core ERPs, custom software, databases, legacy mainframes, and modern cloud microservices.',
    overview: 'Enterprises thrive on connected data. A8Fusion eliminates information silos by designing robust middleware, event-driven message buses, and API connectors that link legacy systems with contemporary digital platforms without disrupting live operations.',
    capabilities: [
      'Enterprise Service Bus (ESB) & Event-Driven Architecture',
      'Custom API Gateways, Webhooks & Real-Time Sync Engines',
      'Legacy Mainframe & Core Banking / ERP Adapter Development',
      'High-Volume ETL / ELT Data Pipelines & Bi-directional Sync',
      'Third-Party SaaS Integration (Salesforce, SAP, Oracle, Workday)',
      'Data Cleansing, Deduplication & Entity Resolution Engines',
      'Fail-Safe Queue Management & Dead-Letter Recovery Systems',
      'Real-Time Transaction Reconciliations & Audit Logging'
    ],
    challenges: [
      {
        title: 'Data Fragmentation Across Siloed Systems',
        description: 'Critical business intelligence remains trapped inside legacy silos, leading to inconsistent operational reports.'
      },
      {
        title: 'Unreliable Point-to-Point Scripts',
        description: 'Ad-hoc synchronization scripts break silently, causing missing orders, failed reconciliations, and customer friction.'
      },
      {
        title: 'Legacy Inflexibility',
        description: 'Decades-old core applications cannot easily integrate with modern mobile, cloud, or AI interfaces.'
      }
    ],
    approach: [
      { step: '01', title: 'Interface Analysis', desc: 'Documenting schema structures, latency tolerances, and idempotency requirements across all endpoints.' },
      { step: '02', title: 'Middleware Blueprint', desc: 'Deploying high-throughput message brokers (Kafka/RabbitMQ) to decouple publishers and subscribers.' },
      { step: '03', title: 'Data Transformation', desc: 'Building schema validation, canonical data models, and automated fallback logic.' },
      { step: '04', title: 'Continuous Auditing', desc: 'Establishing end-to-end transaction tracking and real-time reconciliation dashboards.' }
    ],
    technologies: ['Apache Kafka', 'RabbitMQ', 'Apache Camel', 'gRPC', 'GraphQL', 'REST / OpenAPI', 'PostgreSQL', 'Airbyte', 'Docker'],
    industries: ['Logistics & Supply Chain', 'Manufacturing', 'Retail & Commerce', 'Banking & Insurance'],
    faqs: [
      {
        q: 'How do you handle system failures during high-volume data synchronization?',
        a: 'We implement transactional outbox patterns, distributed idempotency keys, and automated dead-letter queues to ensure zero data loss and flawless automated recovery.'
      },
      {
        q: 'Will integration require shutting down our active legacy systems?',
        a: 'No. We utilize non-intrusive CDC (Change Data Capture) and shadow API adapters to synchronize data without introducing downtime to active production systems.'
      }
    ]
  },
  {
    id: 'digital-transformation',
    slug: 'digital-transformation',
    title: 'Digital Transformation',
    tagline: 'Modernizing core enterprise processes into agile, digitized workflows.',
    heroSubtitle: 'Transforming institutional operations through end-to-end automation, cloud-native modernization, and human-centered digital experiences.',
    overview: 'Digital transformation is not merely adopting new software; it is re-engineering institutional workflows to operate at modern speed. A8Fusion partners with enterprise leadership to identify operational bottlenecks and replace manual friction with automated, measurable digital workflows.',
    capabilities: [
      'Comprehensive Enterprise Process Mining & Workflow Auditing',
      'Legacy Monolith Modernization & Cloud Re-Platforming',
      'Paperless Enterprise Operations & Digital Citizen Services',
      'Cross-Departmental Robotic & Cognitive Workflow Automation',
      'Modern Executive Dashboards & Operational Command Centers',
      'Change Management Architecture & Technical Upskilling Programs',
      'Regulatory-Compliant Digital Signature & Approvals Infrastructure',
      'Continuous Innovation Roadmapping & KPI Tracking'
    ],
    challenges: [
      {
        title: 'Cultural Resistance & User Adoption Hurdles',
        description: 'New technology implementations often fail when user experience is neglected or staff are poorly transitioned.'
      },
      {
        title: 'Accumulated Decades of Technical Debt',
        description: 'Patchwork fixes over decades make legacy software brittle, expensive to maintain, and impossible to scale.'
      },
      {
        title: 'Slow Executive Decision-Making',
        description: 'Manual spreadsheets and delayed month-end reports mean leaders act on outdated historical figures.'
      }
    ],
    approach: [
      { step: '01', title: 'Workflow Diagnostics', desc: 'Mapping actual user touchpoints, time spent per task, and identifying root causes of institutional latency.' },
      { step: '02', title: 'Target Architecture', desc: 'Defining a modular, cloud-ready future state with clear incremental milestone deliveries.' },
      { step: '03', title: 'Agile Implementation', desc: 'Rolling out high-impact functional pilots that deliver rapid productivity gains without operational disruption.' },
      { step: '04', title: 'Measurement & Refinement', desc: 'Tracking throughput increases, cycle-time reductions, and refining usability based on user feedback.' }
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'BPMN 2.0 Engines', 'Camunda', 'PowerBI / Metabase', 'Kubernetes'],
    industries: ['Government & Public Administration', 'Healthcare Systems', 'Education', 'Construction'],
    faqs: [
      {
        q: 'How does A8Fusion ensure staff actually adopt transformed systems?',
        a: 'We design intuitive UI/UX centered around staff daily tasks, conduct role-based interactive training, and deploy systems incrementally to minimize disruption.'
      },
      {
        q: 'How do you measure ROI on enterprise digital transformation?',
        a: 'We establish baseline metrics before kickoff—such as processing time per application, error rates, and operational overhead—and track tangible improvements post-launch.'
      }
    ]
  },
  {
    id: 'technology-consulting',
    slug: 'technology-consulting',
    title: 'Technology Consulting',
    tagline: 'Strategic CTO-level technical advisory for boardrooms and institutions.',
    heroSubtitle: 'Objective architectural evaluations, enterprise software selection, technology feasibility studies, and digital governance planning.',
    overview: 'We provide senior architectural insight and objective technology counsel to boards of directors, state ministers, and chief executives. We help enterprise leaders make high-stakes technology investments with confidence, grounded in rigorous engineering analysis rather than vendor hype.',
    capabilities: [
      'Enterprise Architecture Review & Technical Due Diligence',
      'Unbiased Commercial Software Evaluation & Selection Advisory',
      'Cloud Strategy, Vendor Lock-in Mitigation & Exit Planning',
      'Digital Governance, Data Sovereignty & Compliance Roadmaps',
      'Capital Expenditure (CapEx) vs OpEx Technology Budgeting',
      'Feasibility Studies for Large-Scale Sovereign Platforms',
      'Disaster Recovery, High-Availability & Resiliency Auditing',
      'Interim Fractional CTO & Systems Architect Advisory'
    ],
    challenges: [
      {
        title: 'Misaligned Vendor Incentives',
        description: 'Software vendors often push proprietary platforms that lock clients into exorbitant recurring licensing fees.'
      },
      {
        title: 'Over-Engineered Complexity',
        description: 'Enterprises frequently invest in trendy technologies that do not solve their core business challenges.'
      },
      {
        title: 'Lack of Senior Technical Governance',
        description: 'Non-technical executive boards need clear, unbiased engineering expertise to evaluate multi-million dollar IT tenders.'
      }
    ],
    approach: [
      { step: '01', title: 'Discovery & Stakeholder Alignment', desc: 'Interviewing executive, operational, and financial leadership to distill strategic business priorities.' },
      { step: '02', title: 'Technical Feasibility & Gap Analysis', desc: 'Deep-diving into current infrastructure, codebase quality, compliance hurdles, and cost structures.' },
      { step: '03', title: 'Independent Evaluation Matrix', desc: 'Formulating objective scoring matrices for architectural viability, total cost of ownership, and security.' },
      { step: '04', title: 'Actionable Executive Roadmap', desc: 'Delivering clear decision frameworks, implementation schedules, and risk-mitigation strategies.' }
    ],
    technologies: ['TOGAF Framework', 'Cloud Economics Modeling', 'Architecture Decision Records (ADRs)', 'Compliance Matrices'],
    industries: ['Government & Municipalities', 'Private Equity & Sovereign Funds', 'Financial Institutions', 'Healthcare Systems'],
    faqs: [
      {
        q: 'Does A8Fusion accept referral commissions from software vendors?',
        a: 'No. Our consulting practice remains 100% independent and vendor-agnostic to guarantee objective recommendations that serve only our clients best interests.'
      },
      {
        q: 'Can A8Fusion evaluate an ongoing IT tender or RFP response?',
        a: 'Yes. We frequently act as technical evaluation advisors for government bodies and corporate procurement committees assessing complex technical submissions.'
      }
    ]
  }
];

