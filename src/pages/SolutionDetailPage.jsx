import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SolutionTopologyVisualizer from '../components/common/SolutionTopologyVisualizer';
import { solutionsData } from '../data/solutionsData';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Server, 
  Database, 
  Lock, 
  Layers, 
  Cpu, 
  Boxes, 
  Terminal, 
  FileCheck2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const solution = solutionsData.find(s => s.slug === slug);

  if (!solution) {
    return <Navigate to="/solutions" replace />;
  }

  // Option 1: Architecture Topology Stack Data tailored to all 9 solutions
  const architectureTopologyData = {
    'enterprise-erp': {
      tier1: {
        title: 'Tier 01: Client Ingress & Experience',
        desc: 'Multi-device portal layer with real-time biometric and role authorizations.',
        tags: ['Web Application', 'Warehouse Handhelds', 'Supplier EDI Gateway', 'REST & GraphQL APIs']
      },
      tier2: {
        title: 'Tier 02: Core Orchestration & Domain Engine',
        desc: 'Sub-millisecond ledger computation, event streaming, and automated BoM reconciliations.',
        tags: ['Double-Entry Ledger Core', 'Kafka Event Bus', 'Automated BoM Engine', 'Multi-Branch Routing']
      },
      tier3: {
        title: 'Tier 03: Sovereign Persistence & Security',
        desc: 'Cryptographic state verification with zero-trust network boundaries and HSM key quorums.',
        tags: ['Distributed PostgreSQL (ACID)', 'Redis Telemetry Cache', 'Air-Gapped Sovereign VPC', 'Hardware HSM Vault']
      }
    },
    'enterprise-crm': {
      tier1: {
        title: 'Tier 01: Institutional Engagement Layer',
        desc: 'Executive deal pipeline interfaces and cross-jurisdictional relationship tracking.',
        tags: ['Institutional Deal Cockpit', 'Relationship Graph UI', 'Executive Mobile Feed', 'Secure Email Bridge']
      },
      tier2: {
        title: 'Tier 02: Contract & Governance Engine',
        desc: 'SIAC-enforceable contract lifecycle management and audit-trailed approvals.',
        tags: ['Contract Lifecycle Engine', 'Deterministic Pipeline Graph', 'Granular RBAC Enforcer', 'Multi-Jurisdiction Logic']
      },
      tier3: {
        title: 'Tier 03: Zero-Egress Confidential Storage',
        desc: 'Hardware-isolated vaults guaranteeing zero unauthorized foreign telemetry egress.',
        tags: ['Zero-Knowledge Encrypted DB', 'Air-Gapped VPC Enclave', 'Immutable Audit Trails', 'HSM Access Matrix']
      }
    },
    'enterprise-hrms': {
      tier1: {
        title: 'Tier 01: Workforce Portals & Access',
        desc: 'Decentralized employee portals, biometric hardware terminals, and manager hubs.',
        tags: ['Employee Self-Service', 'Biometric Terminal Bridges', 'Executive HR Cockpit', 'Mobile Roster Sync']
      },
      tier2: {
        title: 'Tier 02: Human Capital Orchestration',
        desc: 'Autonomous multi-country payroll calculations and multi-jurisdiction tax matrices.',
        tags: ['Multi-Country Tax Engine', 'Autonomous Payroll Bus', 'Talent Performance Matrix', 'Leave & Shift Allocator']
      },
      tier3: {
        title: 'Tier 03: Sovereign Identity & Records',
        desc: 'Encrypted personnel records complying with regional GDPR and localized data laws.',
        tags: ['Decentralized ID Vault', 'AES-256 PII Encryption', 'ISO/IEC 27001 Data Enclave', 'Cryptographic Escrow']
      }
    },
    'financial-management': {
      tier1: {
        title: 'Tier 01: Fiscal Command & Ingress',
        desc: 'CFO dashboards, automated invoicing pipelines, and bank clearing gateways.',
        tags: ['CFO Executive Command', 'Automated AP/AR Flow', 'Treasury & FX Cockpit', 'ISO 20022 Bank Gateway']
      },
      tier2: {
        title: 'Tier 02: High-Velocity Ledger Engine',
        desc: 'Sub-millisecond mathematical double-entry reconciliation with zero floating point drift.',
        tags: ['Double-Entry Math Core', 'Sub-Millisecond Settlement', 'Automated Bank Reconciler', 'Tax Compliance Bus']
      },
      tier3: {
        title: 'Tier 03: Cryptographic Fiscal Vault',
        desc: 'Tamper-evident write-once immutable ledger architecture with multi-party quorum.',
        tags: ['SHA-256 State Hashing', 'Immutable Audit Ledger', 'HSM Hardware Key Quorum', 'Disaster Mirror Nodes']
      }
    },
    'business-intelligence': {
      tier1: {
        title: 'Tier 01: Executive Visualization Tier',
        desc: 'Sub-second streaming analytics cockpits and interactive KPI canvas displays.',
        tags: ['Cabinet Command Cockpit', 'Streaming Telemetry Glass', 'Custom Executive Canvas', 'Scheduled Automated Briefs']
      },
      tier2: {
        title: 'Tier 02: High-Velocity Analytics Core',
        desc: 'Distributed ClickHouse columnar query pipeline with real-time Kafka event ingestion.',
        tags: ['ClickHouse OLAP Pipeline', 'Real-Time Kafka Ingestion', 'Predictive ML Forecasting', 'Sub-Second Aggregator']
      },
      tier3: {
        title: 'Tier 03: Sovereign Data Lakehouse',
        desc: 'Petabyte-scale in-country data lakes isolated from foreign telemetry ingress.',
        tags: ['Air-Gapped Data Lake', 'Microsecond Query Cache', 'AES-256 Storage Enclave', 'Zero-Egress Gateway']
      }
    },
    'document-management': {
      tier1: {
        title: 'Tier 01: Document Ingress & Verification',
        desc: 'Encrypted document drop zones, automated OCR semantic scanning, and legally binding signers.',
        tags: ['Encrypted Drop Ingress', 'OCR Semantic Classifier', 'Legally Binding E-Signer', 'Multi-Party Approvals']
      },
      tier2: {
        title: 'Tier 02: Semantic Knowledge Engine',
        desc: 'Deterministic vector indexing, cryptographic version trees, and automated retention matrices.',
        tags: ['Semantic RAG Search Core', 'Tamper-Evident Versioning', 'Automated Legal Retention', 'Document Workflow Router']
      },
      tier3: {
        title: 'Tier 03: Hardware-Secured Storage Vault',
        desc: 'Air-gapped WORM-compliant storage with hardware security module (HSM) key isolation.',
        tags: ['AES-256-GCM S3/Ceph Vault', 'Hardware HSM Key Vault', 'WORM Compliant Storage', 'Zero-Knowledge Auth']
      }
    },
    'enterprise-ai': {
      tier1: {
        title: 'Tier 01: Cognitive Interface & Ingress',
        desc: 'Enterprise assistant frontends, programmatic SDKs, and voice/document ingestion bridges.',
        tags: ['C-Suite Cognitive Assistant', 'Enterprise Copilot UI', 'SDK / Streaming REST Endpoints', 'Multi-Modal Ingress']
      },
      tier2: {
        title: 'Tier 02: Sovereign Inference & RAG Core',
        desc: 'Private on-premise model execution with deterministic vector retrieval and hallucination guards.',
        tags: ['Private GPU Model Runtime', 'Deterministic RAG Engine', 'Enterprise Policy Guardrails', 'Zero-Hallucination Filter']
      },
      tier3: {
        title: 'Tier 03: Sovereign Vector Storage & Security',
        desc: 'In-country hardware-isolated GPU nodes ensuring model weights never exit authorized perimeters.',
        tags: ['Milvus/Qdrant Vector DB', '100% On-Premise Weights', 'Air-Gapped Private VPC', 'Confidential GPU Enclave']
      }
    },
    'construction-intelligence': {
      tier1: {
        title: 'Tier 01: Field & Telemetry Ingress',
        desc: 'Job-site tablet applications, drone photogrammetry uploads, and IoT sensor networks.',
        tags: ['Field Tablet Inspection App', 'Drone Survey Ingress', 'BIM 3D Model Explorer', 'Contractor Portal']
      },
      tier2: {
        title: 'Tier 02: Capital Analytics & Scheduling Core',
        desc: 'Critical path Monte Carlo delay modeling and automated bill-of-quantities reconciler.',
        tags: ['Critical Path Monte Carlo', 'Automated BoQ Reconciler', 'Field IoT Sensor Bus', 'Milestone Escrow Logic']
      },
      tier3: {
        title: 'Tier 03: Sovereign Site Data Storage',
        desc: 'Immutable project milestone ledgers and geo-spatial telemetry vaults.',
        tags: ['Time-Series Sensor DB', 'Tamper-Proof Milestone Vault', 'Geo-Spatial Spatial Store', 'Air-Gapped VPC']
      }
    },
    'healthcare-technology': {
      tier1: {
        title: 'Tier 01: Clinical Ingress & Workstations',
        desc: 'Physician EHR cockpits, bedside device telemetry, and patient portal integrations.',
        tags: ['Doctor Clinical Workstation', 'Patient Health Portal', 'Bedside Device Telemetry', 'EHR Integration Bus']
      },
      tier2: {
        title: 'Tier 02: Interoperability & Medical Engine',
        desc: 'HL7/FHIR R4 enterprise message routing, ICD-11 diagnostic mapping, and PACS image pipeline.',
        tags: ['HL7 / FHIR R4 Engine', 'ICD-11 Diagnostic Mapper', 'DICOM PACS Pipeline', 'Real-Time Clinical Alerts']
      },
      tier3: {
        title: 'Tier 03: Sovereign PHI Vault & Compliance',
        desc: 'Air-gapped hospital cloud enclaves enforcing zero protected health information egress.',
        tags: ['HIPAA / State Data Enclave', 'Zero-Egress Patient DB', 'Hardware Cryptographic Vault', 'Audit Log Escrow']
      }
    }
  };

  const topology = architectureTopologyData[solution.slug] || {
    tier1: {
      title: 'Tier 01: Ingress & Client Portals',
      desc: 'Unified enterprise access points with strict role authorization and TLS 1.3 encryption.',
      tags: ['Executive Portals', 'Mobile Applications', 'RESTful Endpoints', 'GraphQL 3.0']
    },
    tier2: {
      title: 'Tier 02: Core Orchestration Engine',
      desc: 'High-concurrency microservices bus managing transaction flow and event routing.',
      tags: ['Event-Driven Bus', 'Zero-Lock ACID Engine', 'Service Mesh Proxy', 'Kafka Telemetry']
    },
    tier3: {
      title: 'Tier 03: Sovereign Data & Security',
      desc: 'Air-gapped private cloud storage with hardware-enforced cryptographic validation.',
      tags: ['PostgreSQL Cluster', 'Redis In-Memory Cache', 'Air-Gapped VPC', 'Hardware HSM Vault']
    }
  };

  // Related solutions
  const relatedSolutions = solutionsData.slice(0, 3);

  return (
    <div className="bg-[#F8FAFC]">
      <PageHeader
        badge={solution.badge}
        title={solution.title}
        subtitle={solution.tagline}
        bgImage="/solutions.png"
        breadcrumbs={[
          { label: 'Solutions', link: '/solutions' },
          { label: solution.title }
        ]}
        primaryCtaText="Request Solution Demonstration"
        primaryCtaLink={`/request-project?solution=${solution.slug}`}
        secondaryCtaText="All Solutions Catalog"
        secondaryCtaLink="/solutions"
      />

      {/* Overview & Architecture Blueprint */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Architectural Narrative & Enterprise Scenarios */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
                  System Architecture
                </span>
                <h2 className="text-3xl font-serif font-normal text-slate-900 leading-tight">
                  Modular Platform Engineered for Zero Operational Latency
                </h2>
                <div className="w-16 h-1 bg-indigo-600 rounded"></div>
                
                <p className="text-sm text-slate-600 font-sans leading-relaxed pt-1">
                  {solution.shortDesc}
                </p>
              </div>

              {/* Verified Status Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 card-hover-solution-spec">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>COMMISSIONING &amp; DEPLOYMENT SPECIFICATION</span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Status: <strong className="text-slate-900">{solution.status}</strong>. Custom configurations, schema partitions, and single-tenant sovereign VPC deployments are tailored to client regulatory requirements.
                </p>
              </div>

              {/* Enterprise Use Cases */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Target Enterprise Scenarios
                </h4>
                <div className="space-y-1">
                  {solution.useCases.map((uc, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 p-2 rounded-lg card-hover-usecase-row">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{uc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Responsive Interactive System Topology Diagram (Equal Size & Height) */}
            <div className="lg:col-span-6 flex flex-col h-full">
              <SolutionTopologyVisualizer solution={solution} topology={topology} />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Integrated Modules */}
      <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-serif">
              Core Building Blocks
            </span>
            <h2 className="text-3xl font-serif font-normal text-slate-900">
              Integrated Modules ({solution.modules.length})
            </h2>
            <p className="text-sm text-slate-600 font-sans">
              Each module can be independently enabled or disabled based on role authorization and institutional operational workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solution.modules.map((mod, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 card-hover-solution-module">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-600">MOD 0{i + 1}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">{mod.name}</h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Demo & Evaluation CTA */}
      <section className="py-20 bg-[#0B172A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-serif font-normal text-white">
            Schedule a Confidential Demo of {solution.title}
          </h2>
          <p className="text-sm text-slate-300 font-sans max-w-xl mx-auto leading-relaxed">
            Witness our high-concurrency architecture, real-time ledgers, and role-based access controls in an interactive sandbox.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={`/request-project?solution=${solution.slug}`}
              className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Request Platform Evaluation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Contact Solutions Architect
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

