export const solutionsData = [
  {
    id: 'enterprise-erp',
    slug: 'enterprise-erp',
    title: 'A8 Enterprise ERP',
    tagline: 'Unified resource planning engine for multi-entity, multi-country organizations.',
    badge: 'Flagship Platform',
    status: 'Core Enterprise Offering',
    shortDesc: 'A comprehensive, modular ERP platform connecting financial ledgers, international procurement, warehousing, personnel, and operational logistics under a unified data model.',
    modules: [
      { name: 'Core Financials', desc: 'Multi-currency general ledger, automated reconciliation, and international GAAP/IFRS tax reporting.' },
      { name: 'Global Procurement', desc: 'End-to-end purchase orders, vendor evaluations, electronic tenders, and contract lifecycles.' },
      { name: 'Inventory & Warehousing', desc: 'Multi-warehouse batch tracking, barcode integration, automated re-order thresholds, and bin management.' },
      { name: 'Human Capital Operations', desc: 'Workforce records, department hierarchies, time-tracking, and integrated payroll processing.' },
      { name: 'Operations & Logistics', desc: 'Production scheduling, resource allocation, equipment maintenance, and dispatch logs.' },
      { name: 'Project & Milestone Accounting', desc: 'Job costing, real-time burn-rate analytics, stage billing, and timesheet approvals.' },
      { name: 'Multi-Company & Multi-Branch', desc: 'Inter-company transactions, consolidated balance sheets, and granular branch authorization.' },
      { name: 'Executive BI & Reporting', desc: 'Real-time operational dashboards, cash-flow projections, and automated PDF export schedules.' }
    ],
    architecture: {
      type: 'Distributed Micro-modular Cloud-Native Architecture',
      deployment: 'Private VPC / On-Premise Sovereign Data Center / Dedicated Cloud',
      security: 'End-to-end AES-256 data encryption, TLS 1.3, RBAC, immutable database audit logs'
    },
    useCases: [
      'Multi-national conglomerates coordinating multi-branch supply chains across Southeast Asia and the Middle East.',
      'Mid-to-large industrial manufacturers balancing raw material procurement with dynamic delivery pipelines.'
    ]
  },
  {
    id: 'enterprise-crm',
    slug: 'enterprise-crm',
    title: 'A8 Enterprise CRM',
    tagline: 'Strategic client lifecycle and institutional relationship intelligence.',
    badge: 'Enterprise Platform',
    status: 'Core Enterprise Offering',
    shortDesc: 'A secure, high-touch customer relationship platform designed for long sales cycles, government stakeholder relations, and high-value B2B enterprise agreements.',
    modules: [
      { name: 'Account & Institutional Hierarchy', desc: 'Deep organizational charts, parent-subsidiary mappings, and multi-stakeholder contacts.' },
      { name: 'Pipeline & Opportunity Governance', desc: 'Multi-stage sales milestone tracking, win/loss telemetry, and deal-velocity analytics.' },
      { name: 'Contract & Quotation Engine', desc: 'Automated enterprise quote generation, margin calculations, and approval workflows.' },
      { name: 'Omnichannel Communication Log', desc: 'Unified capture of executive correspondence, meeting minutes, and document exchanges.' },
      { name: 'Customer Service & SLA Resolution', desc: 'Tiered escalation ticketing, SLA breach alerts, and automated customer issue routing.' },
      { name: 'Workflow & Notification Triggers', desc: 'Automated follow-up reminders, task assignments, and executive deal alerts.' },
      { name: 'Enterprise Integrations', desc: 'Bi-directional synchronization with ERP billing, Outlook/Google Workspace, and document vaults.' }
    ],
    architecture: {
      type: 'Event-Driven Real-Time Sync Framework',
      deployment: 'Cloud VPC / On-Premise Secure Enclave',
      security: 'Field-level access security, complete interaction audit logs, SSO integration'
    },
    useCases: [
      'B2B enterprise firms managing long-cycle multi-million dollar tenders and strategic corporate partnerships.',
      'Professional services and legal institutions requiring confidential client history and conflict-of-interest checks.'
    ]
  },
  {
    id: 'enterprise-hrms',
    slug: 'enterprise-hrms',
    title: 'A8 Enterprise HRMS',
    tagline: 'Global workforce management, automated compliance, and talent analytics.',
    badge: 'Human Capital Platform',
    status: 'Core Enterprise Offering',
    shortDesc: 'Streamlining cross-border talent acquisition, sovereign payroll compliance, time and attendance, performance metrics, and employee self-service portals.',
    modules: [
      { name: 'Employee Information Hub', desc: 'Centralized biographical records, document archives, digital contracts, and family benefits.' },
      { name: 'Applicant Tracking & Hiring', desc: 'Structured interview pipelines, resume parsing, candidate scoring, and automated offer letters.' },
      { name: 'Biometric Attendance & Geofencing', desc: 'Hardware-agnostic biometric device integration, shift management, and mobile punch verification.' },
      { name: 'Multi-Country Payroll Engine', desc: 'Tax withholding, social security compliance, direct bank file generation, and payslip distribution.' },
      { name: 'Leave & Absence Administration', desc: 'Customizable leave schemes, multi-tier approval chains, and automated accrual recalculation.' },
      { name: 'Performance & OKR Reviews', desc: 'Quarterly review cycles, 360-degree feedback loops, and objective alignment trackers.' },
      { name: 'Workforce Demographic Analytics', desc: 'Attrition risk indicators, diversity metrics, department productivity, and headcount cost forecasting.' }
    ],
    architecture: {
      type: 'Multi-Tenant High-Security HR Core',
      deployment: 'Private VPC / On-Premise Enterprise Server',
      security: 'Personally Identifiable Information (PII) vault, role-based segregation of duties'
    },
    useCases: [
      'Distributed organizations operating across multiple regional tax jurisdictions with complex shift schedules.',
      'Government agencies and institutional bodies requiring auditable leave tracking and merit evaluation.'
    ]
  },
  {
    id: 'financial-management',
    slug: 'financial-management',
    title: 'A8 Financial Management Suite',
    tagline: 'Sovereign accounting, multi-currency ledgers, and forensic audit capability.',
    badge: 'Financial Architecture',
    status: 'Core Enterprise Offering',
    shortDesc: 'An institutional accounting and financial planning platform engineered for enterprise controllers, providing immutable audit trails and real-time fiscal intelligence.',
    modules: [
      { name: 'Multi-Currency General Ledger', desc: 'Automated currency revaluation, sub-ledger reconciliation, and real-time trial balance generation.' },
      { name: 'Accounts Payable (AP) Automation', desc: '3-way invoice matching, OCR invoice capture, and automated vendor disbursement approval chains.' },
      { name: 'Accounts Receivable (AR) & Credit', desc: 'Credit limit monitoring, automated reminder escalations, and payment gateway reconciliation.' },
      { name: 'Enterprise Budgeting & Forecasting', desc: 'Top-down and bottom-up budget planning, variance analysis, and what-if scenario simulations.' },
      { name: 'Corporate Expense Governance', desc: 'Mobile receipt capture, corporate card feeds, and automated policy violation alerts.' },
      { name: 'Cryptographic Audit Trails', desc: 'Tamper-evident system logs recording every modification, ledger adjustment, and user authorization.' },
      { name: 'Treasury & Cash Management', desc: 'Live bank balance polling, liquidity forecasting, and inter-account sweep management.' }
    ],
    architecture: {
      type: 'Double-Entry Invariant Financial Kernel',
      deployment: 'Strict Private VPC / Sovereign Bank-Grade Hosting',
      security: 'Cryptographic log verification, ISO 27001 / SOC 1 Type II aligned controls'
    },
    useCases: [
      'Holding corporations managing multi-subsidiary treasury, inter-company loans, and financial audits.',
      'Public utility authorities processing high-volume municipal collections and vendor disbursements.'
    ]
  },
  {
    id: 'business-intelligence',
    slug: 'business-intelligence',
    title: 'A8 Business Intelligence (BI)',
    tagline: 'Executive decision command centers with real-time operational telemetry.',
    badge: 'Analytics Suite',
    status: 'Core Enterprise Offering',
    shortDesc: 'A high-performance business intelligence and data visualization suite that aggregates enterprise data into actionable executive dashboards and predictive forecasts.',
    modules: [
      { name: 'Executive Command Cockpit', desc: 'Unified C-suite dashboards aggregating revenue, cash flow, operational throughput, and incident alerts.' },
      { name: 'Ad-Hoc Query & Report Builder', desc: 'Drag-and-drop report constructor with natural language SQL querying and scheduled automated email delivery.' },
      { name: 'Interactive Data Visualizations', desc: 'Heatmaps, geospatial asset distribution, Sankey flow diagrams, and multi-tier drilldown charts.' },
      { name: 'Predictive Trend Analysis', desc: 'Statistical forecasting models predicting seasonal demand spikes, supply constraints, and inventory turns.' },
      { name: 'Real-Time Streaming Metrics', desc: 'Sub-second telemetry ingestion for factory IoT, fleet coordinates, and active server nodes.' },
      { name: 'Universal Data Lake Connectors', desc: 'Native adapters for PostgreSQL, Snowflake, ClickHouse, Oracle, BigQuery, and legacy flat files.' }
    ],
    architecture: {
      type: 'Columnar High-Throughput Analytics Engine',
      deployment: 'Cloud VPC / On-Premise GPU-Accelerated Node',
      security: 'Row-level and column-level data masking, tenant data isolation'
    },
    useCases: [
      'Corporate leadership teams requiring live operational status across regional subsidiaries without waiting for month-end reports.',
      'Logistics authorities tracking cross-border cargo transit, port dwell times, and vessel status.'
    ]
  },
  {
    id: 'document-management',
    slug: 'document-management',
    title: 'A8 Document Management System (DMS)',
    tagline: 'Encrypted document vaults, cryptographic versioning, and compliance workflows.',
    badge: 'Information Governance',
    status: 'Core Enterprise Offering',
    shortDesc: 'A secure digital repository for enterprise contracts, official circulars, architectural blueprints, and institutional records with legally-binding approval workflows.',
    modules: [
      { name: 'Zero-Knowledge Encrypted Vault', desc: 'Client-side encrypted file storage ensuring even infrastructure administrators cannot view classified payloads.' },
      { name: 'Cryptographic Version Control', desc: 'Immutable revision history tracking who modified, reviewed, or approved each document version.' },
      { name: 'Full-Text Semantic Indexing & OCR', desc: 'Extracting text from scanned PDFs, physical invoices, and high-resolution blueprint schematics.' },
      { name: 'Multi-Level Approval Workflows', desc: 'Configurable routing chains with electronic signature integration and automated reminder escalations.' },
      { name: 'Automated Retention & Destruction', desc: 'Lifecycle management enforcing regulatory record retention schedules and certified data purging.' },
      { name: 'Granular Access Permissions', desc: 'Role-based, department-based, and project-based document confidentiality boundaries.' }
    ],
    architecture: {
      type: 'Distributed S3-Compatible Object Store with Vector Metadata Index',
      deployment: 'Sovereign On-Premise Enclave / Dedicated Cloud VPC',
      security: 'FIPS 140-2 validated encryption, complete forensic audit trails'
    },
    useCases: [
      'Government ministries managing classified tenders, ministerial minutes, and sovereign land registry records.',
      'Engineering and construction firms maintaining thousands of revision-controlled structural blueprints and safety certificates.'
    ]
  },
  {
    id: 'enterprise-ai',
    slug: 'enterprise-ai',
    title: 'A8 Enterprise AI Platform',
    tagline: 'Private, localized cognitive assistants and deterministic RAG systems.',
    badge: 'Cognitive Platform',
    status: 'Advanced Capability',
    shortDesc: 'Self-hosted AI infrastructure providing internal knowledge synthesis, automated regulatory compliance checks, and secure document intelligence with zero external data leakage.',
    modules: [
      { name: 'Private Knowledge Retrieval (RAG)', desc: 'Grounding LLM responses exclusively in your verified enterprise documentation with pinpoint source citations.' },
      { name: 'Autonomous Enterprise Agents', desc: 'Task-specific AI agents that draft responses, cross-reference invoices against contracts, and prepare briefings.' },
      { name: 'On-Premise Model Hosting', desc: 'Running high-efficiency open weights (Llama 3, DeepSeek, Mistral) on sovereign GPU infrastructure.' },
      { name: 'Automated Document Synthesis', desc: 'Instant extraction of key obligations, penalty clauses, and delivery dates from 500+ page contracts.' },
      { name: 'Deterministic Hallucination Guards', desc: 'Heuristic and semantic validation layers preventing fabricated assertions in critical workflows.' },
      { name: 'Enterprise Vector Database Cluster', desc: 'High-speed embedding indexing with real-time incremental updates and tenant isolation.' }
    ],
    architecture: {
      type: 'Sovereign VPC Vector Pipeline & Containerized vLLM Inferencing Engine',
      deployment: 'On-Premise Air-Gapped GPU Cluster / Sovereign VPC',
      security: 'Zero outbound network connections required, strict prompt-injection guardrails'
    },
    useCases: [
      'Corporate legal teams reviewing complex cross-border joint venture contracts in seconds.',
      'Public utility customer desks resolving citizen inquiries with 100% verified policy citations.'
    ]
  },
  {
    id: 'construction-intelligence',
    slug: 'construction-intelligence',
    title: 'A8 Construction Intelligence',
    tagline: 'Capital project planning, contractor telemetry, and field analytics.',
    badge: 'Industrial Platform',
    status: 'Sector-Specific Suite',
    shortDesc: 'A specialized platform connecting site supervisors, quantity surveyors, sub-contractors, and developers on multi-year infrastructure and high-rise developments.',
    modules: [
      { name: 'Capital Budgeting & BoQ Tracking', desc: 'Real-time reconciliation of Bill of Quantities against actual site procurement and certified works.' },
      { name: 'Site Progress Telemetry', desc: 'Daily site logs, drone orthomosaic photo logs, milestone verification, and weather delay documentation.' },
      { name: 'Contractor & Labor Allocation', desc: 'Sub-contractor attendance, trade credential verification, safety induction logs, and equipment utilization.' },
      { name: 'Material Requisition & Wastage', desc: 'Inventory tracking from batch plant dispatch to site pour, curbing material diversion and wastage.' },
      { name: 'Quality & Safety Punch Lists', desc: 'Mobile incident reporting, non-conformance notices (NCRs), and automated resolution checklists.' },
      { name: 'Gantt Schedule Critical Path', desc: 'Dynamic scheduling with automated delay propagation and critical path conflict alerts.' }
    ],
    architecture: {
      type: 'Offline-First Mobile Sync Engine with Centralized Cloud Hub',
      deployment: 'Hybrid Cloud / Mobile Edge Sync',
      security: 'Role-based contractor partitioning, tamper-proof site inspection photos with GPS timestamps'
    },
    useCases: [
      'Commercial property developers overseeing concurrent multi-tower construction projects.',
      'Civil engineering contractors building state highways, bridges, and public transit infrastructure.'
    ]
  },
  {
    id: 'healthcare-technology',
    slug: 'healthcare-technology',
    title: 'A8 Healthcare Technology Suite',
    tagline: 'Clinical hospital administration, patient records, and health informatics.',
    badge: 'Healthcare Suite',
    status: 'Sector-Specific Suite',
    shortDesc: 'An integrated clinical and administrative management platform engineered for tertiary hospitals, regional clinic networks, and diagnostic centers.',
    modules: [
      { name: 'Electronic Medical Records (EMR)', desc: 'Standardized clinical charting, diagnostic history, allergy flags, and physician order entry.' },
      { name: 'Inpatient & Outpatient Administration', desc: 'Bed census management, queue allocation, patient triage, and discharge summaries.' },
      { name: 'Operating Theatre & Scheduling', desc: 'Surgical room booking, anesthesiology checklists, and sterile supply tracking.' },
      { name: 'Pharmacy & Drug Dispensing', desc: 'Prescription validation, automated drug interaction warnings, and batch-level expiry control.' },
      { name: 'Laboratory Information (LIS)', desc: 'Diagnostic analyzer interfacing, specimen barcode tracking, and automated patient portal report delivery.' },
      { name: 'Insurance & Sovereign Billing', desc: 'Multi-payer claim generation, electronic pre-authorization, and co-pay calculation.' }
    ],
    architecture: {
      type: 'HL7 / FHIR Compliant Clinical Data Architecture',
      deployment: 'Sovereign On-Premise Enclave / Dedicated Cloud VPC',
      security: 'HIPAA & GDPR health data compliance, granular audit trails for record views'
    },
    useCases: [
      'Multi-specialty hospital networks managing inpatient flow, clinical governance, and sovereign health insurance claims.',
      'Regional diagnostic laboratories synchronizing pathology testing across distributed collection centers.'
    ]
  }
];

