export const insightCategories = [
  'All Insights',
  'Enterprise Technology',
  'Artificial Intelligence',
  'Government Technology',
  'Cloud Computing',
  'Cybersecurity',
  'Digital Transformation',
  'Industry Insights'
];

export const insightsData = [
  {
    id: 'insight-1',
    slug: 'sovereign-ai-infrastructure-enterprise-governance',
    title: 'Sovereign AI Infrastructure: Why Enterprises Must Reclaim Control Over Model Weights and Corporate Data',
    category: 'Artificial Intelligence',
    featured: true,
    publishedAt: '2026-02-14',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Dr. Evelyn Chen',
      role: 'Chief Technology Officer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    excerpt: 'As public LLM services face intensifying regulatory scrutiny and intellectual property disputes, leading enterprises and governments are pivoting toward private sovereign model deployments.',
    content: `
### The Illusion of Free Intelligence

Over the past three years, the corporate world rushed toward generalized public AI APIs. While initial proof-of-concepts dazzled executive committees, the realities of enterprise compliance, intellectual property protection, and contractual confidentiality have forced a serious reckoning.

When an organization transmits sensitive internal documents, legal correspondence, or patient records to third-party multitenant cloud APIs, it relinquishes operational sovereignty. Data egress risks, unpredictable API latency fluctuations, and opaque training data policies present unacceptable vulnerabilities for regulated enterprises.

### The Imperative of Sovereign AI Architecture

At A8Fusion, our engineering practice advocates for sovereign, private AI deployments. Sovereign AI entails:

1. **Local Weight Execution**: Running open-weights foundational models (such as customized Llama 3, DeepSeek, or Mistral architectures) on customer-controlled private GPU infrastructure or isolated VPCs.
2. **Deterministic Retrieval-Augmented Generation (RAG)**: Anchoring model inferences strictly in verified corporate vector databases, with cryptographic source attribution for every generated claim.
3. **Air-Gapped Operational Capability**: Enabling mission-critical cognitive systems to function indefinitely without requiring constant outbound telemetry to public cloud endpoints.

### Tangible Business Value

Organizations that embrace sovereign intelligence eliminate vendor lock-in, insulate themselves from sudden SaaS price escalations, and protect their proprietary trade secrets. More fundamentally, they build institutional knowledge assets that compound in value over decades, rather than feeding commercial third-party training sets.

As sovereign regulatory frameworks like the EU AI Act and regional Asian data localization statutes mature, sovereign AI infrastructure will transition from a competitive advantage into an absolute statutory requirement.
    `,
    tags: ['Sovereign AI', 'Enterprise LLM', 'RAG', 'Data Privacy', 'VPC Architecture']
  },
  {
    id: 'insight-2',
    slug: 'modernising-legacy-government-systems-without-disruption',
    title: 'Modernising Legacy Civic Infrastructure: An Incremental Roadmap for Government Ministers',
    category: 'Government Technology',
    featured: true,
    publishedAt: '2026-01-28',
    readTime: '9 min read',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Tariq Al-Mansoor',
      role: 'SVP – Government & Public Sector',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    excerpt: 'The catastrophic failure rate of "rip-and-replace" public sector IT projects demands a more disciplined approach: the strangler fig modernization pattern tailored for sovereign public systems.',
    content: `
### The Public Sector Dilemma

Government ministries face an unenviable paradox: citizen expectations demand instantaneous, smartphone-accessible digital services, yet the underlying administrative machinery frequently rests upon 30-year-old COBOL mainframes, proprietary legacy databases, and fractured departmental paper archives.

Too often, public bodies attempt high-risk "big bang" overhaul contracts. History proves that massive multi-year replacement contracts suffer from rampant scope creep, budget ballooning, and eventual cancellation—damaging public trust and wasting taxpayer capital.

### The Strangler Fig Architecture in Civic Tech

A8Fusion advocates an incremental architectural pattern known as the Strangler Fig approach. Instead of attempting to deactivate the legacy core on day one, we establish an enterprise integration facade:

1. **Non-Intrusive Change Data Capture (CDC)**: Ingesting database mutations from the legacy system in real-time without modifying legacy application code.
2. **Decoupled Modern API Gateways**: Exposing modern REST and GraphQL endpoints that feed intuitive citizen web portals and mobile applications.
3. **Progressive Micro-Service Migration**: Carving out discrete domain functions (such as payment processing, application intake, or identity verification) and migrating them one by one to modern, sovereign cloud services.

### Preserving Civic Trust Through Continuous Uptime

Citizen services cannot afford maintenance outages during tax filing deadlines or election periods. By modernizing incrementally, public departments maintain 100% operational continuity while systematically retiring technical debt at a controlled, auditable pace.
    `,
    tags: ['GovTech', 'Legacy Modernization', 'Sovereign Digital Services', 'Change Data Capture']
  },
  {
    id: 'insight-3',
    slug: 'zero-trust-architecture-cross-border-enterprises',
    title: 'Zero-Trust Architecture: Dismantling the Myth of the Corporate Perimeter in Multinational Operations',
    category: 'Cybersecurity',
    featured: true,
    publishedAt: '2026-01-12',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Dr. Evelyn Chen',
      role: 'Chief Technology Officer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    excerpt: 'With distributed international workforces and multi-cloud footprints, the traditional castle-and-moat security posture is obsolete. Here is how enterprise CTOs implement genuine Zero-Trust.',
    content: `
### Beyond the VPN Illusion

For decades, enterprise security relied on the castle-and-moat paradigm: once an employee authenticated through a VPN into the internal corporate network, they enjoyed broad lateral access across corporate databases, file shares, and intranet servers.

In an era of sophisticated spear-phishing, credential theft, and supply-chain dependencies, this architecture is fundamentally broken. A single compromised employee laptop grants adversaries unfettered lateral traversal across the entire enterprise.

### Core Tenets of Enterprise Zero-Trust

A8Fusion constructs defense systems centered on three strict principles:

- **Verify Explicitly**: Authenticate and authorize based on all available data points—including user identity, device health status, geolocation, and behavioral risk scores.
- **Enforce Least-Privileged Access**: Restrict user access using Just-In-Time (JIT) and Just-Enough-Access (JEA) models, guarded by dynamic attribute-based access policies (ABAC).
- **Assume Breach**: Micro-segment internal network assets, encrypt all internal service-to-service communications with mutual TLS (mTLS), and employ automated anomaly containment.
    `,
    tags: ['Zero-Trust', 'Cybersecurity', 'mTLS', 'Identity Governance', 'Defense In Depth']
  },
  {
    id: 'insight-4',
    slug: 'finops-disciplined-cloud-economics-scale',
    title: 'FinOps Discipline: How Multinationals Cut Cloud Waste by 35% Without Sacrificing Velocity',
    category: 'Cloud Computing',
    featured: false,
    publishedAt: '2025-12-19',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Marcus Sterling',
      role: 'Managing Director & CEO',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    excerpt: 'Cloud migration promises agility, but without proactive financial engineering, enterprise cloud bills spiral out of control. We examine proven frameworks for financial governance in multi-cloud operations.',
    content: `
### The Cloud Cost Conundrum

Enterprise leaders routinely discover that their cloud infrastructure expenditures outpace revenue growth. The root cause is rarely the cloud providers themselves, but rather the absence of architectural accountability.

Engineers spin up oversized Kubernetes nodes, retain unattached block storage volumes indefinitely, and fail to configure lifecycle rules for massive analytical data lakes.

### Engineering Financial Accountability

FinOps bridges engineering velocity and financial stewardship. At A8Fusion, our cloud practice implements:
- Granular cost-allocation tagging tied directly to business units and project codes.
- Automated right-sizing heuristics that automatically downscale non-production clusters during off-peak hours.
- Dynamic spot instance and commitment-based reservation modeling that cuts baseline compute expenses by over 30%.
    `,
    tags: ['FinOps', 'Cloud Architecture', 'AWS', 'Azure', 'Cost Optimization']
  },
  {
    id: 'insight-5',
    slug: 'industrial-iot-mes-synchronization-manufacturing',
    title: 'Bridging OT and IT: Synchronizing SCADA Telemetry with Enterprise ERP in Manufacturing',
    category: 'Industry Insights',
    featured: false,
    publishedAt: '2025-11-30',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Sophia Arisandi',
      role: 'VP – Global Delivery',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    excerpt: 'How modern industrial manufacturers are breaking down the historical wall between Operational Technology (OT) on the plant floor and Information Technology (IT) in executive suites.',
    content: `
### The Historic Divide

Historically, plant automation engineers operating Programmable Logic Controllers (PLCs) and SCADA loops spoke an entirely different technical dialect than corporate enterprise architects running ERP systems.

This disconnect created delayed operational visibility: corporate planners only discovered machine yield losses or batch defects days after work orders were completed.

### Unified Namespace (UNS) Architecture

By deploying an event-driven Unified Namespace (UNS) utilizing MQTT and Apache Kafka, modern factories stream real-time operational status into central ERP databases with millisecond latency. Production schedules recalculate automatically the instant an anomaly is detected on line 3, saving thousands of hours in scrap and rework.
    `,
    tags: ['Industry 4.0', 'SCADA', 'Unified Namespace', 'Manufacturing', 'IoT Telemetry']
  }
];

